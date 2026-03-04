import { Elysia, t } from "elysia";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const aiController = new Elysia({ prefix: "/ai" }).post(
  "/expand",
  async function* ({ body }) {
    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: `Continue this text with a natural completion (max 15 words). Return ONLY the continuation, do NOT repeat any of the original text.

Text: "${body.content} "

Continuation:`,
    });

    for await (const chunk of response) {
      yield chunk.text;
    }
  },
  {
    body: t.Object({
      content: t.String(),
    }),
  },
);
