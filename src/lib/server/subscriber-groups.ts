/** MailerLite group "Nyhetsbrev" (weekly "En dag mer"). */
const DEFAULT_NEWSLETTER_GROUP_ID = "204098412960810629";

function groupIdsFrom(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

function newsletterGroupIds(): string[] {
  const configured = groupIdsFrom(process.env.MAILERLITE_NEWSLETTER_GROUP_ID);
  return configured.length > 0 ? configured : [DEFAULT_NEWSLETTER_GROUP_ID];
}

/**
 * Existing guide or Hermes group, plus Nyhetsbrev.
 * Callers attach this list on the same upsert that sets status "unconfirmed".
 * MailerLite confirms the subscriber once; it does not send one email per group.
 */
export function subscriberGroupIds(source: string): string[] {
  const groupIds = new Set<string>();
  const isHermesLead =
    source === "hermes-start" ||
    source === "hermes-guide" ||
    source === "vad-ar-en-ai-agent" ||
    source.startsWith("article-agent-");

  const hermesGroupId = process.env.MAILERLITE_HERMES_GROUP_ID;
  if (isHermesLead && hermesGroupId) {
    groupIdsFrom(hermesGroupId).forEach((id) => groupIds.add(id));
  } else {
    groupIdsFrom(process.env.MAILERLITE_GROUP_ID).forEach((id) =>
      groupIds.add(id)
    );
  }

  newsletterGroupIds().forEach((id) => groupIds.add(id));
  return Array.from(groupIds);
}
