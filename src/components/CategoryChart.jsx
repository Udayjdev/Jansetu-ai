import { CATEGORY_SHARE } from "../data";

export default function CategoryChart() {
  return (
    <section className="section">
      <h2>Citizen Issues by Category</h2>

      {CATEGORY_SHARE.map(({ name, percent }) => (
        <div key={name} className="barrow">
          <div className="barhead">
            <span>{name}</span>
            <b>{percent}%</b>
          </div>
          <div className="bar">
            <div className="fill" style={{ width: `${percent}%` }} />
          </div>
        </div>
      ))}
    </section>
  );
}
