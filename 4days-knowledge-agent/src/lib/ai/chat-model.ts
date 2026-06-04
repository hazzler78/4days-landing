import { openai } from "@ai-sdk/openai";
import { xai } from "@ai-sdk/xai";
import type { LanguageModel } from "ai";

export type ChatProvider = "xai" | "openai";

/** Returnerar aktiv chat-modell baserat på CHAT_PROVIDER i miljövariabler. */
export function getChatModel(): LanguageModel {
  const provider = (process.env.CHAT_PROVIDER ?? "xai") as ChatProvider;

  switch (provider) {
    case "openai":
      return openai("gpt-4o-mini");
    case "xai":
    default:
      return xai("grok-3-mini");
  }
}

export function getChatProviderLabel(): string {
  const provider = process.env.CHAT_PROVIDER ?? "xai";
  return provider === "openai" ? "OpenAI GPT-4o-mini" : "Grok (xAI)";
}

/** Översätter API-fel till användarvänliga svenska meddelanden. */
export function formatChatError(error: unknown): string {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "Okänt fel";

  if (
    message.includes("spending limit") ||
    message.includes("available credits") ||
    message.includes("does not have permission")
  ) {
    return (
      "xAI-kontot har slut på credits eller nått månadslimit. " +
      "Lägg till credits på console.x.ai, eller sätt CHAT_PROVIDER=openai i .env.local " +
      "för att använda OpenAI istället."
    );
  }

  if (message.includes("Incorrect API key") || message.includes("invalid_api_key")) {
    return "Ogiltig API-nyckel. Kontrollera XAI_API_KEY eller OPENAI_API_KEY i .env.local.";
  }

  if (message.includes("rate limit") || message.includes("Rate limit")) {
    return "API rate limit nådd. Vänta en stund och försök igen.";
  }

  return `Kunde inte generera svar: ${message}`;
}
