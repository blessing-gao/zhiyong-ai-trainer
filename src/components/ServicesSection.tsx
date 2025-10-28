import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import aiTalentCenter from "@/assets/ai-talent-center.png";
import createQuestionContent from "@/assets/create-question-content.png";
import createQuestionStyle from "@/assets/create-question-style.png";
import heroCharacter from "@/assets/hero-character.png";
const services = [{
  icon: "🎨",
  title: "现代网站设计",
  description: "运用前沿UI/UX设计原理，打造美观响应式界面，吸引用户并提升转化率。",
  color: "from-purple-500/10 to-pink-500/10"
}, {
  icon: "⚡",
  title: "快速开发交付",
  description: "采用最新技术栈构建高性能网站，为用户提供极致的访问体验。",
  color: "from-blue-500/10 to-cyan-500/10"
}, {
  icon: "📱",
  title: "移动优先策略",
  description: "全响应式设计，确保网站在手机、平板、电脑等所有设备上完美展现。",
  color: "from-green-500/10 to-emerald-500/10"
}, {
  icon: "🚀",
  title: "SEO搜索优化",
  description: "内置SEO最佳实践，提升网站搜索排名，精准吸引目标用户群体。",
  color: "from-orange-500/10 to-red-500/10"
}, {
  icon: "🔧",
  title: "定制化解决方案",
  description: "深度定制的网站解决方案，完美匹配您的业务需求和品牌形象。",
  color: "from-violet-500/10 to-purple-500/10"
}, {
  icon: "💎",
  title: "专业技术支持",
  description: "提供持续的运维服务和技术支持，确保网站稳定安全运行。",
  color: "from-indigo-500/10 to-blue-500/10"
}];
const carouselImages = [
  { src: aiTalentCenter, alt: "AI智能人才中心展示数智人才、模拟AI和培训课程" },
  { src: createQuestionContent, alt: "创建问题内容界面展示" },
  { src: createQuestionStyle, alt: "创建问题样式配置" },
  { src: heroCharacter, alt: "AI助手角色展示" }
];

const ServicesSection = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return <section id="services" className="py-20 relative overflow-hidden">
      {/* Blue bracket background decorations */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        
        <div className="blue-bracket-right top-20 right-10 animate-bracket-glow"></div>
        <div className="small-bracket-left bottom-32 left-16 animate-float-slow"></div>
        <div className="small-bracket-right top-40 left-8 rotate-45 animate-bracket-glow" style={{
        animationDelay: '1s'
      }}></div>
        <div className="blue-bracket-left bottom-10 right-20 -rotate-12 animate-bracket-glow" style={{
        animationDelay: '2s'
      }}></div>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left side - Image Carousel */}
          <div className="flex flex-col items-start animate-fade-in-up">
            <Carousel 
              setApi={setApi}
              className="w-full"
              opts={{
                loop: true,
              }}
            >
              <CarouselContent>
                {carouselImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-2xl opacity-20 scale-110"></div>
                      <img 
                        src={image.src} 
                        alt={image.alt} 
                        className="relative z-10 w-full h-auto rounded-2xl shadow-glow" 
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            
            {/* Progress Dots */}
            <div className="flex gap-2 mt-6">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === current 
                      ? "w-8 bg-primary" 
                      : "w-2 bg-primary/30 hover:bg-primary/50"
                  }`}
                  aria-label={`跳转到第${index + 1}张图片`}
                />
              ))}
            </div>
          </div>

          {/* Right side - Content */}
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground">智涌·人工智能中心</h2>
            <p className="text-2xl font-semibold text-primary">
              中国企业首选的数字经济人才服务提供商
            </p>
            <p className="text-lg text-muted-foreground">
              智涌智能人才中心是基于人工智能和大数据领域，为企业提供"懂业务、懂数据、懂AI"的复合型人才，同时提供数字人才全生命周期服务。
            </p>
          </div>
        </div>

        

        {/* Stats section */}
        
      </div>
    </section>;
};
export default ServicesSection;