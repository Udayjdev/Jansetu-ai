export default function Header({ onReportClick }) {
  return (
    <div className=" w-full justify-between flex-wrap top">
      <div>
        <h1>Digital Governance Command Center</h1>
        <p>Turn citizen feedback into evidence-based development priorities.</p>
      </div>

      <div className="cta">
        <select className="lang" defaultValue="English">
          <option>English</option>
          <option>हिन्दी</option>
        </select>
        <button className=" btn primary" onClick={onReportClick}>
          ＋ Report issue
        </button>
      </div>
    </div>
  );
}
