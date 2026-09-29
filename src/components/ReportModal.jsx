import { CATEGORY_OPTIONS } from "../data";
import AnalysisResult from "./AnalysisResult";

export default function ReportModal({
  issueText,
  onIssueChange,
  onAnalyze,
  onClose,
  showResult,
}) {
  return (
    <div className="overlay">
      <div className="modal">
        <button className="close" onClick={onClose}>×</button>

        <h2>Submit a Citizen Request</h2>
        <p className="muted">
          Prototype: voice/text → AI extraction → priority recommendation.
        </p>

        <textarea
          value={issueText}
          onChange={(e) => onIssueChange(e.target.value)}
          placeholder="Example: हमारे गांव की मुख्य सड़क बारिश में टूट गई है और पानी भर जाता है..."
        />

        <div className="row">
          <input placeholder="Location / Ward" defaultValue="Ward 14" />
          <select defaultValue={CATEGORY_OPTIONS[0]}>
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>

        <button
          className="btn primary"
          style={{ marginTop: 12, width: "100%" }}
          onClick={onAnalyze}
        >
          Analyze with AI
        </button>

        {showResult && <AnalysisResult />}
      </div>
    </div>
  );
}
