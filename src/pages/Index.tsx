import { useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import ProcessSection from "@/components/ProcessSection";
import Footer from "@/components/Footer";
import { useTheme } from "@/contexts/ThemeContext";

const Index = () => {
  const { resetToLightTheme } = useTheme();

  // Always show light theme on homepage
  useEffect(() => {
    resetToLightTheme();
  }, [resetToLightTheme]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="transition-all duration-300">
        <HeroSection />
        <ServicesSection />
        <ProcessSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
