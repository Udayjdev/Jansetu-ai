import { CATEGORY_OPTIONS } from "../data";
import AnalysisResult from "./AnalysisResult";
import VoiceAssistant from "./VoiceAssistant";
 import ComplaintInput from "./ComplaintInput";
export default function ReportModal({
issueText,
setIssueText,
onIssueChange,
onAnalyze,
isAnalyzing,
onClose,
showResult,
result,
}) {
  return (
    <div className="modal-overlay" style={{ zIndex: 9999}}>
      <div className="modal">
        <button className="close" onClick={onClose}>
          (x)
        </button>

        <h2>Submit a Citizen Request</h2>
        <p className="muted">
          Prototype: voice/text → AI extraction → priority recommendation.
        </p>
          <div>
            <ComplaintInput
            issueText={issueText}
            setIssueText={setIssueText}
            />

        {/* <button
  type="button"
  onClick={() => {
    setIssueText("Testing voice-to-text connection");
  }}
  className="rounded-lg bg-green-600 px-4 py-2 text-white"
>
  Test Text Connection
  */}

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
          disabled={isAnalyzing}
        >
          {isAnalyzing ? "Analyzing..." : "Analyze with AI"}
        </button>

        {showResult && <AnalysisResult result={result} />}
      </div>
      </div>
    </div>
  );
}
