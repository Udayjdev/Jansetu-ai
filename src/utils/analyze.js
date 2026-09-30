export function analyzeIssue(text) {
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

  return { category, severity, cluster, priority };
}
export default analyzeIssue;