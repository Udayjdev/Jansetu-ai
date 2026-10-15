import { MAP_PINS, MAP_LEGEND } from "../data";
import { translations } from "../translations";
import FreePriorityMap from "./FreePriorityMap";

export default function PriorityMap({ language = "en" }) {
  const t = translations[language] ?? translations.en;

  return (
    <section className="section">
      <h2>{t.priorityMap}</h2>

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
