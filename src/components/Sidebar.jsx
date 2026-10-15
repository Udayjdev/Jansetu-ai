import { NAV_ITEMS } from "../data";

export default function Sidebar({ onNavigate, activePage = "dashboard" }) {
  const pageIds = [
    "dashboard",
    "requests",
    "priority",
    "projects",
    "insights",
    "settings",
  ];

  return (
    <aside className="sidebar">
      <div className="logo">
        Jan<span>Setu</span> AI
      </div>

      {NAV_ITEMS.map(({ icon, label }, index) => {
        const pageId = pageIds[index];

        return (
          <button
            key={pageId}
            type="button"
            onClick={() => onNavigate(pageId)}
            className={`nav ${activePage === pageId ? "active" : ""}`}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              cursor: "pointer",
              background: "transparent",
              border: "none",
            }}
          >
            {icon} <b>{label}</b>
          </button>
        );
      })}
    </aside>
  );
}