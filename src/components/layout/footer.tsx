import Link from "next/link";
import { siteConfig } from "@/lib/site";

const companyLinks = [
  { href: "/om-oss", label: "Om oss" },
  { href: "/faq", label: "FAQ" },
  { href: "/guider", label: "Alla guider" },
  {
    href: "/gratis-guide-hermes-agenter",
    label: "Starta Hermes gratis",
  },
];

const articleLinks = [
  { href: "/4-dagarsvecka-sverige", label: "4-dagarsvecka i Sverige" },
  { href: "/4-dagarsvecka-lonsamhet", label: "4-dagarsvecka & lönsamhet" },
  { href: "/100-80-100-modellen", label: "100-80-100-modellen" },
  { href: "/ai-automatisering-foretag", label: "AI-automatisering" },
  { href: "/ai-guide-ledningsgrupper", label: "AI-guide för ledningsgrupper" },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-brand-dark text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display text-lg font-semibold text-white">
              4 Days <span className="text-accent">AI</span>{" "}
              <span className="text-sm font-normal text-slate-400">AB</span>
            </p>
            <p className="mt-2 text-sm font-medium text-accent">
              {siteConfig.slogan}
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Vi hjälper kunskapsintensiva svenska företag att gå från 5 till 4
              dagars arbetsvecka med full lön – genom AI-automatisering och
              evidensbaserad metodik.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Företag
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Läs mer
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {articleLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Kontakt
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href={siteConfig.linkedin.joseph}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-accent"
                >
                  Joseph Tran · LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.linkedin.mikael}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-accent"
                >
                  Mikael Söderberg · LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="transition-colors hover:text-accent"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <Link
                  href="/integritetspolicy"
                  className="transition-colors hover:text-accent"
                >
                  Integritetspolicy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="transition-colors hover:text-accent"
                >
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-12 border-t border-slate-800 pt-8 text-center text-xs text-slate-500 md:text-left">
          © {new Date().getFullYear()} {siteConfig.legalName} –{" "}
          {siteConfig.slogan}
          <br className="sm:hidden" />
          <span className="sm:ml-1">
            Org.nr {siteConfig.orgNumber} · {siteConfig.address.street},{" "}
            {siteConfig.address.postalCode} {siteConfig.address.city}
          </span>
        </p>
      </div>
    </footer>
  );
}
