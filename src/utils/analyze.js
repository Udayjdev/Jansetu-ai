// JanSetu AI - complaint classification (Groq LLM with local keyword fallback)

// ---- Fallback: keyword-based local classifier ----
function analyzeIssueLocally(text) {
  const t = text.toLowerCase();

  const categories = [
    { key: "Water & drainage", words: ["water", "drain", "sewage", "flood", "leak", "pipe", "paani", "nali"] },
    { key: "Road", words: ["road", "pothole", "street", "traffic", "bridge", "sadak", "gaddha"] },
    { key: "Electricity", words: ["light", "electric", "power", "streetlight", "wire", "bijli"] },
    { key: "Healthcare", words: ["hospital", "clinic", "doctor", "health", "medicine"] },
  ];

  let category = "General / Uncategorized";
  for (const c of categories) {
    if (c.words.some((w) => t.includes(w))) {
      category = c.key;
      break;
    }
  }

  const urgentWords = ["urgent", "danger", "collapse", "flood", "accident", "critical", "emergency"];
  const severity = urgentWords.some((w) => t.includes(w)) ? "High" : t.length > 80 ? "Medium" : "Low";

  const cluster = `${Math.max(3, text.length % 30)} similar reports nearby`;
  const base = severity === "High" ? 75 : severity === "Medium" ? 55 : 35;
  const priority = Math.min(99, base + (text.length % 20));

  return { category, severity, cluster, priority, source: "local" };
}

// ---- Real AI: calls Groq (openai/gpt-oss-20b), falls back to local on any failure ----
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "openai/gpt-oss-20b";

const CATEGORIES = [
  "Road",
  "Water & drainage",
  "Electricity",
  "Healthcare",
  "General / Uncategorized",
];
const SEVERITIES = ["Low", "Medium", "High"];

const SYSTEM_PROMPT = `You classify citizen civic complaints (English or Hindi) for an Indian city.
Return ONLY raw JSON, no markdown, no explanation, exactly in this shape:
{"category": "...", "severity": "...", "cluster": "...", "priority": 0}
Rules:
- category must be exactly one of: ${CATEGORIES.join(" | ")}
- severity must be exactly one of: Low | Medium | High
- cluster is a short string like "12 similar reports nearby"
- priority is an integer from 0 to 100 (higher = more urgent; safety/health risks score higher)`;

export async function analyzeIssue(text) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    console.warn("No VITE_GROQ_API_KEY found - using local fallback.");
    return analyzeIssueLocally(text);
  }

  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: text },
        ],
        temperature: 0.2,
        reasoning_effort: "low",
        max_completion_tokens: 1000,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      throw new Error(`Groq HTTP ${res.status}: ${await res.text()}`);
    }

    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content || "";
    const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());

    if (!CATEGORIES.includes(parsed.category)) throw new Error("Bad category");
    if (!SEVERITIES.includes(parsed.severity)) throw new Error("Bad severity");

    const result = {
      category: parsed.category,
      severity: parsed.severity,
      cluster: String(parsed.cluster || "Few similar reports nearby"),
      priority: Math.max(0, Math.min(100, Math.round(Number(parsed.priority) || 50))),
      source: "groq",
    };
    console.log("Groq result:", result);
    return result;
  } catch (err) {
    console.warn("Groq failed, using local fallback:", err.message);
    return analyzeIssueLocally(text);
  }
}

export default analyzeIssue;
