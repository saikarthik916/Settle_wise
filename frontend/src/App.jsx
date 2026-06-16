// frontend/src/App.jsx

import { useState } from "react";
import { Header } from "./components/Header";
import { HomePage } from "./pages/HomePage";
import { PriceAnalysisPage } from "./pages/PriceAnalysisPage";
import { CrimeSafetyPage } from "./pages/CrimeSafetyPage";
import { LifestylePage } from "./pages/LifestylePage";
import { DataPage } from "./pages/DataPage";
import { AboutPage } from "./pages/AboutPage";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedAreaId, setSelectedAreaId] = useState(1);

  const handleNavigate = (page, areaId) => {
    setCurrentPage(page);
    if (areaId) {
      setSelectedAreaId(areaId);
    }
    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={handleNavigate} />;
      case "price":
        return <PriceAnalysisPage initialArea={selectedAreaId} />;
      case "crime":
        return <CrimeSafetyPage />;
      case "lifestyle":
        return <LifestylePage />;
      case "data":
        return <DataPage />;
      case "about":
        return <AboutPage />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background dark">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <main>{renderPage()}</main>
      <Toaster />
    </div>
  );
}
