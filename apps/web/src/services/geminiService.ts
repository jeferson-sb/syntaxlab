import { GoogleGenAI } from "@google/genai";
import { config } from "@/lib/config";

const ai = new GoogleGenAI({ apiKey: config.geminiAPIKey });

export async function* expandIdea(content: string) {
  try {
    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: `Continue this text with a natural completion (max 15 words). Return ONLY the continuation, do NOT repeat any of the original text.

Text: "${content} "

Continuation:`,
    });

    for await (const chunk of response) {
      yield chunk.text;
    }
  } catch (error) {
    console.error("Gemini Expansion Error:", error);
    return ["Could not expand idea at this time."];
  }
}
