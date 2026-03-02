import { GoogleGenAI } from "@google/genai";
import { config } from "@/lib/config";

const ai = new GoogleGenAI({ apiKey: config.geminiAPIKey });

export async function* expandIdea(content: string) {
  try {
    const response = await ai.models.generateContentStream({
      model: "gemini-3-flash-preview",
      contents: `
      Based on this draft idea: "${content}",
      complete the author idea with max of 15 words and return it as string`,
    });

    for await (const chunk of response) {
      yield chunk.text;
    }
  } catch (error) {
    console.error("Gemini Expansion Error:", error);
    return ["Could not expand idea at this time."];
  }
}
