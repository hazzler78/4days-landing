#!/usr/bin/env node
/**
 * Generates the AI/LLM text versions of the site from the freshly built pages:
 *
 *   public/llms-full.txt   – all pages in sitemap.xml in one file
 *   public/<slug>.md       – one Markdown file per page (index.md = start page),
 *                            used by the "Kopiera för AI" / "Visa som Markdown" buttons
 *
 * Runs automatically after `next build` (see "build" in package.json), so the files
 * always match the deployed content. It starts `next start` on a local port,
 * reads sitemap.xml, fetches every page and converts <main> to Markdown
 * (navigation, footer, cookie banner and scripts are left out). Text is copied
 * verbatim – nothing is rewritten.
 *
 * Manual run (after a build):  npm run generate:llm
 * If any page fails, the script exits non-zero so the build fails instead of
 * publishing stale or partial files.
 *
 * public/llms.txt is hand-written and is NOT touched by this script.
 */
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BASE = "https://www.4days.ai";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DIR = path.join(ROOT, "public");

/* ------------------------------------------------------------------ */
/* Minimal HTML parser (the built pages are well-formed React output)  */
/* ------------------------------------------------------------------ */

const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr", "param"]);
const RAW = new Set(["script", "style"]);
const RCDATA = new Set(["title", "textarea"]);
const ENTITIES = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: "\u00a0", shy: "\u00ad",
  ndash: "\u2013", mdash: "\u2014", hellip: "\u2026", laquo: "\u00ab", raquo: "\u00bb",
  lsquo: "\u2018", rsquo: "\u2019", ldquo: "\u201c", rdquo: "\u201d", bull: "\u2022",
  middot: "\u00b7", copy: "\u00a9", reg: "\u00ae", trade: "\u2122", times: "\u00d7",
  euro: "\u20ac", deg: "\u00b0", rarr: "\u2192", larr: "\u2190", minus: "\u2212",
  auml: "\u00e4", ouml: "\u00f6", aring: "\u00e5", Auml: "\u00c4", Ouml: "\u00d6", Aring: "\u00c5",
  eacute: "\u00e9",
};

function decode(s) {
  return s.replace(/&(#x[0-9a-fA-F]+|#[0-9]+|[a-zA-Z][a-zA-Z0-9]*);/g, (m, e) => {
    if (e[0] === "#") {
      const cp = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(cp) ? String.fromCodePoint(cp) : m;
    }
    return Object.prototype.hasOwnProperty.call(ENTITIES, e) ? ENTITIES[e] : m;
  });
}

const text = (data, parent = null) => ({ type: "text", data, parent });
const elem = (name, attrs = {}, parent = null) => ({ type: "tag", name, attrs, children: [], parent });

function parseHTML(html) {
  const doc = elem("[document]");
  const stack = [doc];
  const top = () => stack[stack.length - 1];
  const add = (n) => { n.parent = top(); top().children.push(n); };
  let i = 0;
  while (i < html.length) {
    const lt = html.indexOf("<", i);
    if (lt === -1) { add(text(decode(html.slice(i)))); break; }
    if (lt > i) add(text(decode(html.slice(i, lt))));
    if (html.startsWith("<!--", lt)) {
      const end = html.indexOf("-->", lt + 4);
      const stop = end === -1 ? html.length : end;
      add({ type: "comment", data: html.slice(lt + 4, stop) });
      i = stop + 3;
      continue;
    }
    if (html[lt + 1] === "!" || html[lt + 1] === "?") {
      const end = html.indexOf(">", lt);
      add({ type: "doctype", data: html.slice(lt + 2, end) });
      i = end + 1;
      continue;
    }
    if (html[lt + 1] === "/") {
      const end = html.indexOf(">", lt);
      const name = html.slice(lt + 2, end).trim().toLowerCase();
      for (let k = stack.length - 1; k > 0; k--) {
        if (stack[k].name === name) { stack.length = k; break; }
      }
      i = end + 1;
      continue;
    }
    const m = /^<([a-zA-Z][^\s/>]*)/.exec(html.slice(lt, lt + 200));
    if (!m) { add(text("<")); i = lt + 1; continue; }
    const name = m[1].toLowerCase();
    let j = lt + m[0].length;
    const attrs = {};
    let selfClosing = false;
    while (j < html.length) {
      while (/\s/.test(html[j])) j++;
      if (html[j] === ">") { j++; break; }
      if (html[j] === "/" && html[j + 1] === ">") { selfClosing = true; j += 2; break; }
      if (html[j] === "/") { j++; continue; }
      const an = /^[^\s=/>]+/.exec(html.slice(j, j + 500));
      if (!an) { j++; continue; }
      j += an[0].length;
      while (/\s/.test(html[j])) j++;
      let val = "";
      if (html[j] === "=") {
        j++;
        while (/\s/.test(html[j])) j++;
        const q = html[j];
        if (q === '"' || q === "'") {
          const e = html.indexOf(q, j + 1);
          val = html.slice(j + 1, e);
          j = e + 1;
        } else {
          const uv = /^[^\s>]*/.exec(html.slice(j, j + 2000))[0];
          val = uv;
          j += uv.length;
        }
      }
      attrs[an[0].toLowerCase()] = decode(val);
    }
    const node = elem(name, attrs);
    add(node);
    if (RAW.has(name) || RCDATA.has(name)) {
      const close = html.toLowerCase().indexOf(`</${name}`, j);
      const stop = close === -1 ? html.length : close;
      const body = html.slice(j, stop);
      if (body) node.children.push(text(RCDATA.has(name) ? decode(body) : body, node));
      const gt = html.indexOf(">", stop);
      i = gt === -1 ? html.length : gt + 1;
      continue;
    }
    if (!VOID.has(name) && !selfClosing) stack.push(node);
    i = j;
  }
  return doc;
}

/* ------------------------------ DOM helpers ------------------------------ */

const isTag = (n) => n && n.type === "tag";
const isStr = (n) => n && (n.type === "text" || n.type === "comment" || n.type === "doctype");
const classes = (n) => (isTag(n) && n.attrs.class ? n.attrs.class.split(/\s+/).filter(Boolean) : []);
const idx = (n) => (n.parent ? n.parent.children.indexOf(n) : -1);
const prevSib = (n) => { const i = idx(n); return i > 0 ? n.parent.children[i - 1] : null; };
const nextSib = (n) => { const i = idx(n); return i >= 0 && i < n.parent.children.length - 1 ? n.parent.children[i + 1] : null; };

function descendants(n, out = []) {
  for (const c of n.children || []) { out.push(c); if (isTag(c)) descendants(c, out); }
  return out;
}
const findAll = (n, pred) => descendants(n).filter((d) => isTag(d) && pred(d));
const find = (n, pred) => findAll(n, pred)[0] || null;
const named = (...names) => (d) => names.includes(d.name);
function findParent(n, names) {
  for (let p = n.parent; p; p = p.parent) if (names.includes(p.name)) return p;
  return null;
}
function getText(n, sep = "", strip = false) {
  let parts = descendants(n)
    .filter((d) => d.type === "text" && !(d.parent && RAW.has(d.parent.name)))
    .map((d) => d.data);
  if (strip) parts = parts.map((s) => s.trim()).filter(Boolean);
  return parts.join(sep);
}
function decompose(n) { if (n.parent) { const i = idx(n); if (i >= 0) n.parent.children.splice(i, 1); } n.parent = null; }
function insertAt(parent, i, node) { node.parent = parent; parent.children.splice(i, 0, node); }
const insertAfter = (n, node) => insertAt(n.parent, idx(n) + 1, node);
const insertBefore = (n, node) => insertAt(n.parent, idx(n), node);
function replaceWith(n, node) { const p = n.parent, i = idx(n); p.children.splice(i, 1); n.parent = null; insertAt(p, i, node); }
function setString(n, s) { n.children = [text(s, n)]; }
function append(n, child) { if (typeof child === "string") child = text(child); child.parent = n; n.children.push(child); }

function urljoin(href) {
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(href)) return href;
  if (href.startsWith("//")) return "https:" + href;
  if (href.startsWith("/")) return BASE + href;
  return BASE + "/" + href;
}

/* ---------------------- Page cleanup (structure only) --------------------- */

function faqAnswers(doc) {
  const map = new Map();
  for (const s of findAll(doc, (d) => d.name === "script" && d.attrs.type === "application/ld+json")) {
    let data;
    try { data = JSON.parse(getRawText(s)); } catch { continue; }
    const walk = (o) => {
      if (Array.isArray(o)) return o.forEach(walk);
      if (!o || typeof o !== "object") return;
      if (o["@type"] === "Question" && o.name && o.acceptedAnswer && o.acceptedAnswer.text) map.set(o.name, o.acceptedAnswer.text);
      Object.values(o).forEach(walk);
    };
    walk(data);
  }
  return map;
}
const getRawText = (n) => n.children.filter((c) => c.type === "text").map((c) => c.data).join("");

function prepareMain(doc) {
  const faq = faqAnswers(doc);
  const m = find(doc, named("main"));
  if (!m) throw new Error("no <main> element");
  for (const t of findAll(m, named("script", "style", "noscript", "svg", "img", "picture", "video", "iframe", "template", "input", "select", "textarea"))) decompose(t);
  for (const t of findAll(m, (d) => d.attrs["aria-hidden"] === "true")) if (!getText(t, "", true)) decompose(t);
  for (const f of findAll(m, named("form"))) decompose(f);

  // Animated counters (AnimatedNumber) render 0 on the server; the real value is in data-llm-value.
  for (const sp of findAll(m, (d) => d.attrs["data-llm-value"] !== undefined)) setString(sp, sp.attrs["data-llm-value"]);

  for (const a of findAll(m, (d) => d.name === "a" && d.attrs.href !== undefined)) a.attrs.href = urljoin(a.attrs.href);

  // Card links that wrap block content -> "part – [heading](url) – part".
  const BLOCKISH = ["p", "h2", "h3", "h4", "span", "div"];
  for (const a of findAll(m, (d) => d.name === "a" && d.attrs.href !== undefined)) {
    const hasBlock = find(a, named("p", "h2", "h3", "h4", "div"));
    const blockSpans = findAll(a, (d) => d.name === "span" && classes(d).includes("block")).length;
    if (!hasBlock && blockSpans < 2) continue;
    const leaves = findAll(a, named(...BLOCKISH)).filter((x) => !find(x, named(...BLOCKISH)) && getText(x, "", true));
    const head = find(a, named("h2", "h3", "h4")) ||
      leaves.find((x) => classes(x).includes("font-semibold") && classes(x).includes("block")) || null;
    const p = elem("p");
    leaves.forEach((x, i) => {
      if (i) append(p, " – ");
      if (x === head || (head === null && i === 0)) {
        const l = elem("a", { href: a.attrs.href });
        setString(l, getText(x, " ", true));
        append(p, l);
      } else append(p, getText(x, " ", true));
    });
    replaceWith(a, p);
  }

  // Ordered lists render their own "1." spans; drop them (Markdown numbers the items).
  for (const li of findAll(m, named("li"))) {
    const f = find(li, named("span"));
    if (f && li.children[0] === f && /^\d+\.$/.test(getText(f, "", true)) && li.parent && li.parent.name === "ol") decompose(f);
  }

  // Keep words in adjacent elements from running together.
  for (const t of findAll(m, () => true)) {
    if (!t.parent) continue;
    if (isTag(nextSib(t))) insertAfter(t, text(" "));
    const ps = prevSib(t);
    if (classes(t).includes("block") && isStr(ps) && ps.data.trim()) insertBefore(t, text(" "));
  }

  // FAQ accordions: answers are collapsed in the HTML, so take them from the page's FAQPage JSON-LD.
  const accordion = findAll(m, (d) => d.name === "button" && d.attrs["aria-expanded"] !== undefined)
    .filter((b) => faq.has(getText(b, "", true)));
  if (accordion.length) {
    for (const b of accordion) {
      const q = getText(b, "", true);
      const h = findParent(b, ["h3", "h2", "h4"]) || b;
      h.name = "h3";
      setString(h, q);
      const pe = elem("p");
      setString(pe, faq.get(q));
      insertAfter(h, pe);
    }
    for (const t of findAll(m, (d) => d.attrs.hidden !== undefined)) if (!getText(t, "", true)) decompose(t);
  }
  return m;
}

/* -------------- HTML -> Markdown (port of python-markdownify 1.2) ------------- */

const reHeading = /^h(\d+)/;
const BLOCK_INSIDE = new Set(["p", "blockquote", "article", "div", "section", "ol", "ul", "li", "dl", "dt", "dd", "table", "thead", "tbody", "tfoot", "tr", "td", "th"]);
const removeInside = (el) => isTag(el) && (reHeading.test(el.name) || BLOCK_INSIDE.has(el.name));
const removeOutside = (el) => removeInside(el) || (isTag(el) && el.name === "pre");
const isBlockContent = (el) => isTag(el) || (el && el.type === "text" && el.data.trim() !== "");
function nextBlockContentSibling(el) {
  for (let s = nextSib(el); s; s = nextSib(s)) if (isBlockContent(s)) return s;
  return null;
}
const stripChars = (s, chars) => {
  let a = 0, b = s.length;
  while (a < b && chars.includes(s[a])) a++;
  while (b > a && chars.includes(s[b - 1])) b--;
  return s.slice(a, b);
};
const WS = " \t\r\n";
function chomp(t) {
  const prefix = t && t[0] === " " ? " " : "";
  const suffix = t && t[t.length - 1] === " " ? " " : "";
  return [prefix, suffix, t.trim()];
}
const inline = (mark) => (el, t, pt) => {
  if (pt.has("_noformat")) return t;
  const [p, s, x] = chomp(t);
  if (!x) return "";
  return p + mark + x + mark + s;
};
const lineIndent = (t, fn) => t.replace(/^(.*)/gm, (_m, c) => fn(c));

const convert = {
  a(el, t, pt) {
    if (pt.has("_noformat")) return t;
    const [p, s, x] = chomp(t);
    if (!x) return "";
    const href = el.attrs.href, title = el.attrs.title;
    if (x.replace(/\\_/g, "_") === href && !title) return `<${href}>`;
    const tp = title ? ` "${title.replace(/"/g, '\\"')}"` : "";
    return href ? `${p}[${x}](${href}${tp})${s}` : x;
  },
  b: inline("**"), strong: inline("**"), em: inline("*"), i: inline("*"), del: inline("~~"), s: inline("~~"),
  sub: inline(""), sup: inline(""),
  blockquote(el, t, pt) {
    t = stripChars(t || "", WS);
    if (pt.has("_inline")) return " " + t + " ";
    if (!t) return "\n";
    return "\n" + lineIndent(t, (c) => (c ? "> " + c : ">")) + "\n\n";
  },
  br(el, t, pt) { return pt.has("_inline") ? (t ? t + " " : " ") : "  \n" + t; },
  code(el, t, pt) {
    if (pt.has("_noformat")) return t;
    let [p, s, x] = chomp(t);
    if (!x) return "";
    const max = Math.max(0, ...(x.match(/`+/g) || []).map((r) => r.length));
    const d = "`".repeat(max + 1);
    if (max > 0) x = " " + x + " ";
    return p + d + x + d + s;
  },
  div(el, t, pt) {
    if (pt.has("_inline")) return " " + t.trim() + " ";
    t = t.trim();
    return t ? `\n\n${t}\n\n` : "";
  },
  dd(el, t, pt) {
    t = (t || "").trim();
    if (pt.has("_inline")) return " " + t + " ";
    if (!t) return "\n";
    t = lineIndent(t, (c) => (c ? "    " + c : ""));
    return ":" + t.slice(1) + "\n";
  },
  dt(el, t, pt) {
    t = (t || "").trim().replace(/[\t \r\n]+/g, " ");
    if (pt.has("_inline")) return " " + t + " ";
    return t ? `\n\n${t}\n` : "\n";
  },
  hr() { return "\n\n---\n\n"; },
  img() { return ""; },
  button(el, t) { return t; },
  list(el, t, pt) {
    const ns = nextBlockContentSibling(el);
    const beforeParagraph = !!(ns && !(isTag(ns) && (ns.name === "ul" || ns.name === "ol")));
    if (pt.has("li")) return "\n" + t.trimEnd();
    return "\n\n" + t + (beforeParagraph ? "\n" : "");
  },
  li(el, t) {
    t = (t || "").trim();
    if (!t) return "\n";
    let bullet;
    const parent = el.parent;
    if (parent && parent.name === "ol") {
      const st = parent.attrs.start;
      const start = st && /^\d+$/.test(st) ? parseInt(st, 10) : 1;
      bullet = `${start + parent.children.slice(0, idx(el)).filter((c) => isTag(c) && c.name === "li").length}.`;
    } else bullet = "-";
    bullet += " ";
    const ind = " ".repeat(bullet.length);
    t = lineIndent(t, (c) => (c ? ind + c : ""));
    return bullet + t.slice(bullet.length) + "\n";
  },
  p(el, t, pt) {
    if (pt.has("_inline")) return " " + stripChars(t, WS) + " ";
    t = stripChars(t, WS);
    return t ? `\n\n${t}\n\n` : "";
  },
  pre(el, t) {
    if (!t) return "";
    t = t.replace(/^[ \n]*\n/, "").replace(/[ \n]*$/, "");
    return "\n\n```\n" + t + "\n```\n\n";
  },
  q(el, t) { return '"' + t + '"'; },
  script() { return ""; },
  style() { return ""; },
  table(el, t) { return "\n\n" + t.trim() + "\n\n"; },
  caption(el, t) { return t.trim() + "\n\n"; },
  figcaption(el, t) { return "\n\n" + t.trim() + "\n\n"; },
  td(el, t) { return cell(el, t); },
  th(el, t) { return cell(el, t); },
  tr(el, t) {
    const cells = findAll(el, named("td", "th"));
    const prevTag = el.parent.children.slice(0, idx(el)).filter(isTag);
    const isFirstRow = prevTag.length === 0;
    const pn = el.parent.name;
    const isHeadRow = cells.every((c) => c.name === "th") || (pn === "thead" && findAll(el.parent, named("tr")).length === 1);
    const isHeadRowMissing = (isFirstRow && pn !== "tbody") ||
      (isFirstRow && pn === "tbody" && findAll(el.parent.parent, named("thead")).length < 1);
    let full = 0;
    for (const c of cells) full += colspan(c);
    let over = "", under = "";
    const parentPrevTag = el.parent.parent ? el.parent.parent.children.slice(0, idx(el.parent)).filter(isTag) : [];
    if (isHeadRow && isFirstRow) {
      under += "| " + Array(full).fill("---").join(" | ") + " |\n";
    } else if (isHeadRowMissing || (isFirstRow && (pn === "table" || (pn === "tbody" && parentPrevTag.length === 0)))) {
      over += "| " + Array(full).fill("").join(" | ") + " |\n";
      over += "| " + Array(full).fill("---").join(" | ") + " |\n";
    }
    return over + "|" + t + "\n" + under;
  },
};
convert.article = convert.section = convert.dl = convert.div;
convert.ul = convert.ol = convert.list;
convert.kbd = convert.samp = convert.code;
function colspan(c) { const v = c.attrs.colspan; return v && /^\d+$/.test(v) ? Math.max(1, Math.min(1000, parseInt(v, 10))) : 1; }
function cell(el, t) { return " " + t.trim().replace(/\n/g, " ") + " |".repeat(colspan(el)); }
function convFn(name) {
  if (name === "span") return null; // stripped
  if (Object.prototype.hasOwnProperty.call(convert, name)) return convert[name];
  const m = reHeading.exec(name);
  if (m) {
    const n = Math.max(1, Math.min(6, parseInt(m[1], 10)));
    return (el, t, pt) => {
      if (pt.has("_inline")) return t;
      t = t.trim().replace(/[\t \r\n]+/g, " ");
      return `\n\n${"#".repeat(n)} ${t}\n\n`;
    };
  }
  return null;
}

function processText(el, pt) {
  let t = el.data || "";
  if (!pt.has("pre")) t = t.replace(/[\t \r\n]*[\r\n][\t \r\n]*/g, "\n").replace(/[\t ]+/g, " ");
  if (!pt.has("_noformat")) t = t.replace(/\*/g, "\\*").replace(/_/g, "\\_");
  const ps = prevSib(el), ns = nextSib(el);
  if (removeOutside(ps) || (removeInside(el.parent) && !ps)) t = t.replace(/^[ \t\r\n]+/, "");
  if (removeOutside(ns) || (removeInside(el.parent) && !ns)) t = t.trimEnd();
  return t;
}

function processTag(node, pt) {
  const inside = removeInside(node);
  const canIgnore = (el) => {
    if (isTag(el)) return false;
    if (el.type !== "text") return true;
    if (el.data.trim() !== "") return false;
    if (inside && (!prevSib(el) || !nextSib(el))) return true;
    if (removeOutside(prevSib(el)) || removeOutside(nextSib(el))) return true;
    return false;
  };
  const kids = node.children.filter((c) => !canIgnore(c));
  const ptc = new Set(pt);
  ptc.add(node.name);
  if (reHeading.test(node.name) || node.name === "td" || node.name === "th") ptc.add("_inline");
  if (["pre", "code", "kbd", "samp"].includes(node.name)) ptc.add("_noformat");
  let strs = kids.map((c) => (isTag(c) ? processTag(c, ptc) : processText(c, ptc))).filter(Boolean);
  if (!(node.name === "pre" || findParent(node, ["pre"]))) {
    const out = [""];
    for (const s of strs) {
      let [, lead, content, trail] = /^(\n*)((?:[\s\S]*[^\n])?)(\n*)$/.exec(s);
      if (out[out.length - 1] && lead) {
        const prev = out.pop();
        lead = "\n".repeat(Math.min(2, Math.max(prev.length, lead.length)));
      }
      out.push(lead, content, trail);
    }
    strs = out;
  }
  let t = strs.join("");
  const fn = convFn(node.name);
  if (fn) t = fn(node, t, pt);
  return t;
}

export function pageToMarkdown(html) {
  const doc = parseHTML(html);
  const titleEl = find(doc, named("title"));
  const title = titleEl ? getText(titleEl, "", true) : "";
  const m = prepareMain(doc);
  let md = processTag(m, new Set());
  md = md.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  return { title, md };
}

export function buildFiles(pages, date) {
  const out = [
    "# 4days.ai – fullständigt innehåll",
    "",
    `> Genererad ${date} från de ${pages.length} sidorna i ${BASE}/sitemap.xml. Texten är kopierad ordagrant från de publika sidorna (navigering, sidfot, cookiebanner och skript är borttagna).`,
    "",
  ];
  const md = {};
  for (const p of pages) {
    out.push("---", "", `## ${p.title}`, "", `URL: ${p.url}`, "", p.md, "");
    md[p.slug] = `> Källa: ${p.url}\n\n${p.md}\n`;
  }
  return { full: out.join("\n").trimEnd() + "\n", md };
}

/* ------------------------------- Build step ------------------------------- */

async function waitFor(url, ms) {
  const until = Date.now() + ms;
  for (;;) {
    try { const r = await fetch(url); if (r.ok) return; } catch {}
    if (Date.now() > until) throw new Error(`server did not answer ${url} within ${ms} ms`);
    await new Promise((r) => setTimeout(r, 300));
  }
}

async function main() {
  const port = Number(process.env.LLM_GEN_PORT || 3999);
  const origin = `http://127.0.0.1:${port}`;
  const require = createRequire(import.meta.url);
  const nextBin = require.resolve("next/dist/bin/next");
  const server = spawn(process.execPath, [nextBin, "start", "-p", String(port), "-H", "127.0.0.1"], {
    cwd: ROOT,
    stdio: ["ignore", "ignore", "inherit"],
    env: { ...process.env, NODE_ENV: "production" },
  });
  try {
    await waitFor(`${origin}/sitemap.xml`, 90_000);
    const sitemap = await (await fetch(`${origin}/sitemap.xml`)).text();
    const locs = [...sitemap.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((x) => decode(x[1]));
    if (!locs.length) throw new Error("sitemap.xml has no <loc> entries");
    const pages = [];
    const failed = [];
    for (const url of locs) {
      const pathname = new URL(url).pathname;
      const slug = pathname.replace(/^\/+|\/+$/g, "") || "index";
      try {
        const res = await fetch(origin + pathname, { redirect: "manual" });
        if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
        const { title, md } = pageToMarkdown(await res.text());
        if (!md) throw new Error("empty <main>");
        pages.push({ url, slug, title, md });
      } catch (e) {
        failed.push(`${pathname}: ${e.message}`);
      }
    }
    if (failed.length) throw new Error(`could not convert ${failed.length} page(s):\n  ${failed.join("\n  ")}`);
    const date = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
    const { full, md } = buildFiles(pages, date);
    await writeFile(path.join(PUBLIC_DIR, "llms-full.txt"), full, "utf8");
    for (const [slug, body] of Object.entries(md)) {
      const file = path.join(PUBLIC_DIR, `${slug}.md`);
      await mkdir(path.dirname(file), { recursive: true });
      await writeFile(file, body, "utf8");
    }
    console.log(`generate-llm-files: wrote public/llms-full.txt (${Buffer.byteLength(full)} bytes) and ${pages.length} .md files`);
  } finally {
    server.kill();
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error("generate-llm-files failed:", e.message);
    process.exit(1);
  });
}
