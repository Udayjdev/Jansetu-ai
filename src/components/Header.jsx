const TEXT = {
  English: {
    title: "Digital Governance Command Center",
    subtitle: "Turn citizen feedback into evidence-based development priorities.",
    report: "＋ Report issue",
  },
  हिन्दी: {
    title: "डिजिटल गवर्नेंस कमांड सेंटर",
    subtitle: "नागरिकों की शिकायतों को प्राथमिकता-आधारित विकास कार्यों में बदलें।",
    report: "＋ समस्या दर्ज करें",
  },
};

export default function Header({ onReportClick, lang, onLangChange }) {
  const t = TEXT[lang];

  return (
    <div className="top">
      <div>
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </div>

      <div className="cta">
        <select
          className="lang"
          value={lang}
          onChange={(e) => onLangChange(e.target.value)}
        >
          <option>English</option>
          <option>हिन्दी</option>
        </select>
        <button className="btn primary" onClick={onReportClick}>
          {t.report}
        </button>
      </div>
    </div>
  );
}
