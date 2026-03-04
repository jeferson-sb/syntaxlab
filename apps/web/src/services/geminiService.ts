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

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No response body");
    }

    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      yield decoder.decode(value, { stream: true });
    }
  } catch (error) {
    console.error("AI Expansion Error:", error);
    yield "Could not expand idea at this time.";
  }
}
