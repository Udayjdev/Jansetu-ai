import { PRIORITIES } from "../data";

export default function RecommendedPriorities() {
  return (
    <section className="section">
      <h2>AI-Recommended Priorities</h2>

      <div className="requests">
        {PRIORITIES.map(({ title, score, tone, summary, meta }) => (
          <div key={title} className="req">
            <div className="reqtop">
              <b>{title}</b>
              <span className={`score ${tone}`}>{score}</span>
            </div>
            <p>{summary}</p>
            <div className="meta">{meta}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
