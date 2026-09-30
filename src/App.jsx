import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MetricCards from "./components/MetricCards";
import PriorityMap from "./components/PriorityMap";
import RecommendedPriorities from "./components/RecommendedPriorities";
import CategoryChart from "./components/CategoryChart";
import ExplainableAI from "./components/ExplainableAI";
import AnalysisResult from "./components/AnalysisResult";
import ReportModal from "./components/ReportModal";
import runAnalysis from "./utils/analyze";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [issueText, setIssueText] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [lang, setLang] = useState("English");
  const [analysisResult, setAnalysisResult] = useState(null);

  const openModal = () => {
    setIsModalOpen(true);
    setShowResult(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setShowResult(false);
  };

 const analyzeIssue = () => {
  if (!issueText.trim()) {
    alert("Enter a civic issue first");
    return;
  }

  const result = runAnalysis(issueText);

  setAnalysisResult(result);
  setShowResult(true);
};

  return (
    <>
      <div className="app">
        <Sidebar />

       <main className="main">
  <Header
    onReportClick={openModal}
    lang={lang}
    onLangChange={setLang}
  />

  {showResult && analysisResult && (
    <AnalysisResult result={analysisResult} />
  )}

  <MetricCards />

  <div className="grid">
    <PriorityMap />
    <RecommendedPriorities />
  </div>

  <div className="bottom">
    <CategoryChart />
    <ExplainableAI />
  </div>
</main>
      </div>

      {isModalOpen && (
  <ReportModal
    issueText={issueText}
    onIssueChange={setIssueText}
    onAnalyze={analyzeIssue}
    onClose={closeModal}
    showResult={showResult}
    result={analysisResult}
  />
        
      )}
    </>
  );
}
