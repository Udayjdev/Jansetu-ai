import { DEMO_ANALYSIS } from "../data";

export default function AnalysisResult({ result = DEMO_ANALYSIS }) {
  const rows = [
    ["Category", result.category],
    ["Severity", result.severity],
    ["Duplicate cluster", result.cluster],
    ["Estimated priority", `${result.priority}/100`],
  ];

  return (
    <div className="result">
      <b>AI analysis complete</b>

      <div style={{ marginTop: 12 }}>
        {rows.map(([label, value]) => (
          <div key={label} style={{ marginBottom: 4 }}>
            {label}: <b>{value}</b>
          </div>
        ))}
      </div>

      <span className="meta">
        Demo result — connect Gemini + Maps + database for live analysis.
      </span>
    </div>
  );
}
