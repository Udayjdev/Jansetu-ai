import { METRICS } from "../data";

export default function MetricCards() {
  return (
    <div className="cards">
      {METRICS.map(({ label, value, note, tone }) => (
        <div key={label} className="card">
          <div className="muted">{label}</div>
          <div className="metric">{value}</div>
          <div className={tone}>{note}</div>
        </div>
      ))}
    </div>
  );
}
