import { NAV_ITEMS } from "../data";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        Jan<span>Setu</span> AI
      </div>

      {NAV_ITEMS.map(({ icon, label, active }) => (
        <div key={label} className={active ? "nav active" : "nav"}>
          {icon} <b>{label}</b>
        </div>
      ))}
    </aside>
  );
}
