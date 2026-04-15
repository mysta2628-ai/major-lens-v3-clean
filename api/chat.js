// Vercel serverless function — proxies to Groq API
// Keeps the API key server-side (never exposed to the browser)

export const config = { runtime: "edge" };

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL    = "llama-3.3-70b-versatile";

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API key not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // messages: [{ role: "user"|"model", text: "..." }]
  // Convert "model" → "assistant" for OpenAI-compatible format
  const messages = body.messages.map((m) => ({
    role: m.role === "model" ? "assistant" : m.role,
    content: m.text,
  }));

  const groqRes = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!groqRes.ok) {
    const err = await groqRes.text();
    return new Response(JSON.stringify({ error: err }), {
      status: groqRes.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  const data = await groqRes.json();
  const text = data?.choices?.[0]?.message?.content ?? "";

  return new Response(JSON.stringify({ text }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
