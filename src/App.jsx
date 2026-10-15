import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import FreePriorityMap from "./components/FreePriorityMap";
import PriorityMap from "./components/PriorityMap";
import RecommendedPriorities from "./components/RecommendedPriorities";
import CategoryChart from "./components/CategoryChart";
import ExplainableAI from "./components/ExplainableAI";
import AnalysisResult from "./components/AnalysisResult";
import ReportModal from "./components/ReportModal";
import analyzeIssueText from "./utils/analyze";
import { translations } from "./translations";
import MetricCards from "./components/MetricCards";
import CitizenRequests from "./components/CitizenRequests";
import ProjectsPage from "./components/ProjectsPage";
import AIInsightsPage from "./components/AIInsightsPage";
import SettingsPage from "./components/SettingsPage";
export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [issueText, setIssueText] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
 const [isAnalyzing, setIsAnalyzing] = useState(false);
 const [activePage, setActivePage] = useState("dashboard");

const [lang, setLang] = useState("English");

const language = lang === "Hindi" ? "hi" : "en";
const t = translations[language] ?? translations.en;
  const openModal = () => {
    setIsModalOpen(true);
    setShowResult(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setShowResult(false);
  };

 const analyzeIssue = async () => {
  if (!issueText.trim()) {
    alert("Enter a civic issue first");
    return;
  }

  setIsAnalyzing(true);
  try {
    const result = await analyzeIssueText(issueText);
    setAnalysisResult(result);
    setShowResult(true);
  } finally {
    setIsAnalyzing(false);
  }
};

  return (
    <>
      <div className="app">
      <Sidebar
  activePage={activePage}
  onNavigate={setActivePage}
  language={language}
/>

       <main className="main">
  <Header
    onReportClick={openModal}
    lang={lang}
    onLangChange={setLang}
  />

{activePage === "requests" ? (
  <CitizenRequests />
) : activePage === "projects" ? (
  <ProjectsPage />
   ) : activePage === "insights" ? (
  <AIInsightsPage />
) : activePage === "settings" ? (
  <SettingsPage
    lang={lang}
    onLangChange={setLang}
  />
) : activePage === "dashboard" ? (
  <>
    <MetricCards language={language} />

    <div className="grid">
      <FreePriorityMap />
      <RecommendedPriorities />
    </div>

    <div className="bottom">
      <CategoryChart />
      <ExplainableAI />
    </div>
    </>
) : (

  <FreePriorityMap/>
)};
</main>
      </div>

      {isModalOpen && (
  <ReportModal
    issueText={issueText}
    setIssueText={setIssueText}
    onIssueChange={setIssueText}
    onAnalyze={analyzeIssue}
    isAnalyzing={isAnalyzing}
    onClose={closeModal}
    showResult={showResult}
    result={analysisResult}
  />
        
      )}
    </>
  );
}
