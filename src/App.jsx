import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MetricCards from "./components/MetricCards";
import PriorityMap from "./components/PriorityMap";
import RecommendedPriorities from "./components/RecommendedPriorities";
import CategoryChart from "./components/CategoryChart";
import ExplainableAI from "./components/ExplainableAI";
import ReportModal from "./components/ReportModal";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [issueText, setIssueText] = useState("");
  const [showResult, setShowResult] = useState(false);

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
      alert("Enter a citizen request first.");
      return;
    }
    // TODO: call the FastAPI + Gemini endpoint here and store its response
    setShowResult(true);
  };

  return (
    <>
      <div className="app">
        <Sidebar />

        <main className="main">
          <Header onReportClick={openModal} />
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
        />
      )}
    </>
  );
}
