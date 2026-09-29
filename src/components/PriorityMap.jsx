import { MAP_PINS, MAP_LEGEND } from "../data";

export default function PriorityMap() {
  return (
    <section className="section">
      <h2>AI Priority Map</h2>

      <div className="map">
        {MAP_PINS.map(({ position, level }) => (
          <i key={position} className={`pin ${level} ${position}`} />
        ))}
      </div>

      <div className="legend">
        {MAP_LEGEND.map(({ label, dot }) => (
          <span key={label}>
            <i className={`dot ${dot}`} />
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}
