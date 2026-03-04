import { config } from "@/lib/config";

export async function* expandIdea(content: string) {
  try {
    const response = await fetch(`${config.backendUrl}/api/ai/expand`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("No response body");
    }

    const stream = response.body?.pipeThrough(new TextDecoderStream());

    for await (const chunk of stream) {
      yield chunk;
    }
  } catch (error) {
    console.error("AI Expansion Error:", error);
    yield "Could not expand idea at this time.";
  }
}
