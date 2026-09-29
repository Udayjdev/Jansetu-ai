export default function ExplainableAI() {
  return (
    <section className="section">
      <h2>Why is Ward 14 high priority?</h2>

      <div className="req">
        <p><b>AI explanation</b></p>
        <p>
          Priority increased because the system found 184 related citizen
          requests, repeated reports across 6 weeks, high rainfall exposure and
          an estimated 4,100 residents affected.
        </p>
        <p className="meta">Model confidence: 93% • Similar reports merged: 67</p>
      </div>

      <button
        className="btn secondary"
        style={{ marginTop: 10 }}
        onClick={() => alert("Demo: recommendation evidence opened")}
      >
        View evidence trail
      </button>
    </section>
  );
}
