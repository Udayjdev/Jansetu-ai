import { METRICS } from "../data";
import { translations } from "../translations";

export default function MetricCards({ language = "en" }) {
  const t = translations[language] ?? translations.en;

  const labels = {
    "Citizen requests": t.citizenRequests,
    "AI-identified hotspots": t.hotspots,
    "Requests resolved": t.resolved,
    "Data confidence": t.confidence,
  };

  return (
    <div className="cards">
      {METRICS.map(({ label, value, note, tone }) => (
        <div key={label} className="card">
          <div className="muted">
            {labels[label] ?? label}
          </div>

          <div className="metric">{value}</div>

          <div className={tone}>{note}</div>
        </div>
      ))}
    </div>
  );
}