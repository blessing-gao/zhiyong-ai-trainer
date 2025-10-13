import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import ProcessSection from "@/components/ProcessSection";
import Footer from "@/components/Footer";
import { useTheme } from "@/contexts/ThemeContext";

const Index = () => {
  const { resetToLightTheme } = useTheme();
  const [isVertical, setIsVertical] = useState(() => {
    const saved = localStorage.getItem("navPosition");
    return saved === "vertical";
  });

  // Always show light theme on homepage
  useEffect(() => {
    resetToLightTheme();
  }, [resetToLightTheme]);

  useEffect(() => {
    const handleNavChange = (e: CustomEvent) => {
      setIsVertical(e.detail === "vertical");
    };

    window.addEventListener("navPositionChange", handleNavChange as EventListener);
    return () => {
      window.removeEventListener("navPositionChange", handleNavChange as EventListener);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main className={`transition-all duration-300 ${isVertical ? "ml-44" : ""}`}>
        <HeroSection />
        <ServicesSection />
        <ProcessSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
