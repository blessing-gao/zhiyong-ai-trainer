import { Button } from "@/components/ui/button";
import heroCharacter from "@/assets/hero-character.png";
import { ChevronDown } from "lucide-react";
const HeroSection = () => {
  return <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Blue bracket background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large brackets */}
        <div className="blue-bracket-left top-20 left-10 animate-bracket-glow"></div>
        <div className="blue-bracket-right top-32 right-16 animate-bracket-glow" style={{
        animationDelay: '1s'
      }}></div>
        <div className="blue-bracket-left bottom-40 left-20 rotate-12 animate-bracket-glow" style={{
        animationDelay: '2s'
      }}></div>
        <div className="blue-bracket-right bottom-20 right-10 -rotate-12 animate-bracket-glow" style={{
        animationDelay: '0.5s'
      }}></div>
        
        {/* Small brackets */}
        <div className="small-bracket-left top-40 right-32 animate-float"></div>
        <div className="small-bracket-right bottom-60 left-32 animate-float-slow"></div>
        <div className="small-bracket-left top-60 left-40 rotate-45 animate-bracket-glow" style={{
        animationDelay: '1.5s'
      }}></div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight font-hanyi-zongyi">
                从洞察到实践，智涌助您领跑{" "}
                
              </h1>
              <p className="text-xl text-gray-600 max-w-lg">从洞察到实践，用智能科技引领未来</p>
            </div>

            {/* Feature highlights */}
            

            {/* Stats */}
            
          </div>

          {/* Right side - Hero Image */}
          <div className="relative flex justify-center">
            <div className="relative">
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-gradient-primary rounded-full blur-3xl opacity-20 scale-110"></div>
              
              {/* Hero character */}
              <img src={heroCharacter} alt="3D Character representing our web development team" className="relative z-10 w-full max-w-md h-auto animate-float" />
              
              {/* Floating elements around character */}
              <div className="absolute top-10 -right-4 w-12 h-12 bg-white/30 rounded-xl animate-float-slow"></div>
              <div className="absolute bottom-16 -left-6 w-8 h-8 bg-white/40 rounded-lg animate-float"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
        <div className="flex flex-col items-center gap-2">
          <ChevronDown className="w-6 h-6 text-primary animate-pulse" />
        </div>
      </div>
    </section>;
};
export default HeroSection;