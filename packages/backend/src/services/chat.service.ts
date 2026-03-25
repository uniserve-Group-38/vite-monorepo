import { Langbase } from "langbase";
import { OpenAI } from "openai";
import fs from "fs";
import path from "path";

// GitHub Models client — free tier, OpenAI-compatible endpoint for embeddings
const githubEmbeddingClient = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: process.env.GITHUB_TOKEN!,
});

// --- Pure helpers ---

function chunkFaq(text: string): string[] {
  return text
    .split(/\n\n+/)
    .map((c) => c.trim())
    .filter((c) => c.length > 30);
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] ** 2;
    normB += b[i] ** 2;
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function embed(texts: string[]): Promise<number[][]> {
  const res = await githubEmbeddingClient.embeddings.create({
    model: "text-embedding-3-small",
    input: texts,
  });
  return res.data.map((d) => d.embedding);
}

// --- In-process embedding cache (lives for the lifetime of the server process) ---
let cachedChunks: string[] | null = null;
let cachedEmbeddings: number[][] | null = null;

async function loadFaqEmbeddings() {
  if (cachedChunks && cachedEmbeddings) {
    return { chunks: cachedChunks, embeddings: cachedEmbeddings };
  }
  const faqPath = path.join(process.cwd(), "faq-knowledge-base.txt");
  const faqText = fs.readFileSync(faqPath, "utf-8");
  const chunks = chunkFaq(faqText);
  console.log(`[RAG] Embedding ${chunks.length} FAQ chunks via GitHub Models...`);
  const embeddings = await embed(chunks);
  cachedChunks = chunks;
  cachedEmbeddings = embeddings;
  console.log("[RAG] FAQ embeddings cached.");
  return { chunks, embeddings };
}

async function retrieveContext(query: string, topK = 4): Promise<string> {
  const { chunks, embeddings } = await loadFaqEmbeddings();
  const [queryEmbedding] = await embed([query]);
  return chunks
    .map((chunk, i) => ({ chunk, score: cosineSimilarity(queryEmbedding, embeddings[i]) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((r) => r.chunk)
    .join("\n\n");
}

// --- Service ---

export const chatService = {
  getAiReply: async (message: string): Promise<string> => {
    const contextText = await retrieveContext(message);

    const systemPrompt = `You are a friendly and professional AI support assistant for Uniserve, a university campus services platform.

RESPONSE FORMAT RULES:
- Use **bold** for key terms, service names, prices, and important info
- Use bullet points (-) for lists of features or options
- Use numbered lists (1. 2. 3.) for step-by-step instructions
- Keep replies concise — aim for 2-5 lines or a short list. Avoid walls of text
- End with a helpful follow-up offer when appropriate (e.g. "Would you like help with anything else?")
- Do NOT use headers (##). Speak naturally and conversationally

KNOWLEDGE BASE (answer from this first):
${contextText || "No relevant context found."}`;

    const langbase = new Langbase({ apiKey: process.env.LANGBASE_API_KEY! });
    const pipeName = process.env.LANGBASE_PIPE_NAME || "ai-support-agent";

    const { completion } = await langbase.pipes.run({
      stream: false,
      name: pipeName,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    return completion;
  },
};
