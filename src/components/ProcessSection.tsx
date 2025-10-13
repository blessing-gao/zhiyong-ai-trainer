import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";

const certificationModules = [{
  icon: "📚",
  title: "认证与培训",
  description: "了解我们的认证与培训体系，获得专业的AI训练师培训课程"
}, {
  icon: "🏆",
  title: "权威认证",
  description: "获得权威人工智能训练师认证书，提升职业竞争力"
}, {
  icon: "🎯",
  title: "模拟考试",
  description: "题目练习、模拟考试，全方位提升应试能力"
}, {
  icon: "👤",
  title: "个人中心",
  description: "管理个人信息，查看学习进度和考试成绩"
}];

const ProcessSection = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    
    setCurrent(api.selectedScrollSnap());
    
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return <section className="py-20 relative overflow-hidden">
      {/* Blue bracket background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="small-bracket-left top-16 left-8 animate-float"></div>
        <div className="blue-bracket-right bottom-20 right-12 animate-bracket-glow"></div>
        <div className="small-bracket-right top-60 right-32 rotate-45 animate-bracket-glow" style={{
        animationDelay: '1.5s'
      }}></div>
        <div className="blue-bracket-left top-80 left-20 -rotate-12 animate-bracket-glow" style={{
        animationDelay: '0.5s'
      }}></div>
      </div>

      <div className="container mx-auto px-6">
        {/* Left-Right Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-7xl mx-auto">
          {/* Left: Title Section */}
          <div className="lg:col-span-4">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">了解我们</h2>
          </div>

          {/* Right: Carousel Card Layout */}
          <div className="lg:col-span-8">
          <Carousel 
            setApi={setApi}
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {certificationModules.map((module, index) => {
                const isCurrent = index === current;
                const opacity = isCurrent ? 1 : 0.6;
                const scale = isCurrent ? 1 : 0.9;
                
                return (
                  <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <div 
                      className="transition-all duration-500 ease-out cursor-pointer"
                      style={{ 
                        opacity,
                        transform: `scale(${scale})`
                      }}
                      onClick={() => api?.scrollTo(index)}
                    >
                      {/* Main Card */}
                      <div className="rounded-3xl p-8 shadow-xl border border-white/20 backdrop-blur-sm min-h-[420px] flex flex-col relative overflow-hidden"
                        style={{
                          background: isCurrent 
                            ? 'linear-gradient(135deg, hsl(220 90% 50%) 0%, hsl(180 80% 50%) 100%)'
                            : 'linear-gradient(135deg, hsl(220 20% 90%) 0%, hsl(220 15% 95%) 100%)',
                        }}
                      >
                        {/* Decorative gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                        
                        {/* Content */}
                        <div className="flex-1 flex flex-col relative z-10 pt-4">
                          <h3 className="text-2xl font-bold mb-4"
                            style={{ color: isCurrent ? 'white' : 'hsl(220 30% 30%)' }}
                          >
                            {module.title}
                          </h3>
                          <p className="text-base leading-relaxed mb-8 flex-1"
                            style={{ color: isCurrent ? 'rgba(255, 255, 255, 0.9)' : 'hsl(220 20% 40%)' }}
                          >
                            {module.description}
                          </p>
                          
                          {/* Action Button */}
                          <button 
                            className="w-full py-4 px-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
                            style={{
                              background: 'rgba(255, 255, 255, 0.2)',
                              color: 'white',
                              border: '1px solid rgba(255, 255, 255, 0.3)',
                            }}
                          >
                            深入了解 →
                          </button>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            
            {/* Navigation Dots */}
            <div className="flex justify-center gap-3 mt-8">
              {certificationModules.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    api?.scrollTo(index);
                  }}
                  className={`h-3 rounded-full transition-all duration-300 hover:scale-110 ${
                    index === current 
                      ? 'w-10 bg-primary' 
                      : 'w-3 bg-primary/30'
                  }`}
                  aria-label={`跳转到第 ${index + 1} 张卡片`}
                />
              ))}
            </div>
          </Carousel>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20">
          <div className="bg-gradient-card rounded-3xl p-12 border border-border/50 shadow-glow">
            <h3 className="text-3xl font-bold text-foreground mb-4 text-left">了解我们的成功案例</h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl text-left">
              加入我们的认证培训体系，获得权威认证，提升专业技能，成为AI领域的专家人才。
            </p>
            
            {/* Partnership & Social Responsibility Section - inline with CTA */}
            <div className="mb-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {/* 社会责任 */}
                <div className="rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-blue-200/30">
                  {/* Top section with gradient */}
                  <div className="p-6 backdrop-blur-sm relative"
                    style={{
                      background: 'linear-gradient(135deg, hsl(210 100% 92%) 0%, hsl(200 100% 85%) 100%)'
                    }}
                  >
                    <h4 className="text-xl font-bold text-left" style={{ color: 'hsl(220 70% 35%)' }}>社会责任（集团公益）</h4>
                  </div>
                  {/* Bottom section with frosted glass effect */}
                  <div className="p-6 bg-white/80 backdrop-blur-md">
                    <p className="text-sm leading-relaxed text-left" style={{ color: 'hsl(220 40% 45%)' }}>
                      致力于推动AI教育普及，培养更多数字化人才
                    </p>
                  </div>
                </div>

                {/* 政府合作 */}
                <div className="rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-blue-200/30">
                  {/* Top section with gradient */}
                  <div className="p-6 backdrop-blur-sm relative"
                    style={{
                      background: 'linear-gradient(135deg, hsl(200 100% 88%) 0%, hsl(190 100% 80%) 100%)'
                    }}
                  >
                    <h4 className="text-xl font-bold text-left" style={{ color: 'hsl(220 70% 35%)' }}>政府（香港VTC职业训练局）</h4>
                  </div>
                  {/* Bottom section with frosted glass effect */}
                  <div className="p-6 bg-white/80 backdrop-blur-md">
                    <p className="text-sm leading-relaxed text-left" style={{ color: 'hsl(220 40% 45%)' }}>
                      与政府机构合作，提供权威认证培训服务
                    </p>
                  </div>
                </div>

                {/* 企业培训 */}
                <div className="rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-blue-200/30">
                  {/* Top section with gradient */}
                  <div className="p-6 backdrop-blur-sm relative"
                    style={{
                      background: 'linear-gradient(135deg, hsl(220 100% 90%) 0%, hsl(230 100% 82%) 100%)'
                    }}
                  >
                    <h4 className="text-xl font-bold text-left" style={{ color: 'hsl(220 70% 35%)' }}>企业培训合作</h4>
                  </div>
                  {/* Bottom section with frosted glass effect */}
                  <div className="p-6 bg-white/80 backdrop-blur-md">
                    <p className="text-sm leading-relaxed text-left" style={{ color: 'hsl(220 40% 45%)' }}>
                      为企业提供定制化AI人才培养解决方案
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-left">
              <button className="bg-accent hover:bg-accent-hover text-accent-foreground font-semibold px-8 py-4 rounded-xl shadow-glow transition-bounce">
                了解详情
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>;
};
export default ProcessSection;