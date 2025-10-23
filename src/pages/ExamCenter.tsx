import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, FileText, FlaskConical, Clock, User, Calendar, Shield, CircleAlert as AlertCircle, Award, BookOpen, Trophy, Target } from "lucide-react";
import Header from "@/components/Header";
import BackgroundCircles from "@/components/BackgroundCircles";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

const ExamCenter = () => {
  const { applyRoleTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isVertical, setIsVertical] = useState(() => {
    const saved = localStorage.getItem("navPosition");
    return saved === "vertical";
  });
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Apply theme based on user role
  useEffect(() => {
    applyRoleTheme();
  }, [applyRoleTheme]);

  useEffect(() => {
    const handleNavChange = (e: CustomEvent) => {
      setIsVertical(e.detail === "vertical");
    };

    window.addEventListener("navPositionChange", handleNavChange as EventListener);
    return () => {
      window.removeEventListener("navPositionChange", handleNavChange as EventListener);
    };
  }, []);

  // 打开新窗口进入考试登录系统
  const handleExamSystem = () => {
    // 在新窗口中打开考试登录页面
    const examLoginUrl = `${window.location.origin}/exam/login`;
    window.open(examLoginUrl, 'examWindow', 'width=800,height=900,resizable=yes,scrollbars=yes');
  };

  // 获取卡片宽度
  const getCardWidth = (card: any) => {
    if (card.type === "exam") {
      return card.id === "practical" ? 400 : 320;
    } else if (card.type === "info") {
      return 320;
    } else if (card.type === "security") {
      return 480;
    }
    return 320;
  };

  // 滚动到指定卡片
  const scrollToCard = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const containerWidth = container.clientWidth;
      const gap = 16; // gap-4 = 16px
      
      // 计算到目标卡片为止的累计宽度
      let cardLeft = 0;
      for (let i = 0; i < index; i++) {
        const cardWidth = getCardWidth(allCards[i]);
        cardLeft += cardWidth + gap;
      }
      
      // 获取目标卡片的宽度
      const targetCardWidth = getCardWidth(allCards[index]);
      const cardCenter = cardLeft + (targetCardWidth / 2);
      const containerCenter = containerWidth / 2;
      const scrollLeft = cardCenter - containerCenter;
      
      container.scrollTo({
        left: Math.max(0, scrollLeft),
        behavior: 'smooth'
      });
      setActiveCardIndex(index);
    }
  };

  // 监听滚动事件，更新活动卡片索引
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const containerWidth = container.clientWidth;
      const scrollLeft = container.scrollLeft;
      const containerCenter = containerWidth / 2;
      const gap = 16;
      
      // 计算当前滚动位置对应的卡片索引
      const targetPosition = scrollLeft + containerCenter;
      let currentPosition = 0;
      let newIndex = 0;
      
      for (let i = 0; i < allCards.length; i++) {
        const cardWidth = getCardWidth(allCards[i]);
        const cardCenter = currentPosition + (cardWidth / 2);
        
        if (targetPosition >= currentPosition && targetPosition < currentPosition + cardWidth) {
          newIndex = i;
          break;
        }
        
        currentPosition += cardWidth + gap;
        newIndex = i; // 如果到达最后一张卡片
      }
      
      if (newIndex !== activeCardIndex && newIndex >= 0 && newIndex < allCards.length) {
        setActiveCardIndex(newIndex);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [activeCardIndex]);

  // 考试信息数据
  const examInfo = {
    title: "AI训练师认证考试",
    description: "通过权威认证，证明您的AI技能水平",
    examTypes: [
      {
        id: "theory",
        name: "理论考试",
        description: "AI基础理论知识测试",
        duration: "120min",
        questions: "100题",
        icon: FileText,
        bgColor: "#A2EBFF"
      },
      {
        id: "practical", 
        name: "实践考试",
        description: "AI实际操作技能测试",
        duration: "90min",
        questions: "5个项目",
        icon: FlaskConical,
        bgColor: "#79E3DA"
      }
    ],
    requirements: [
      "完成所有课程学习",
      "通过模拟考试练习",
      "具备基础编程能力",
      "了解AI基本概念"
    ],
    benefits: [
      "获得权威认证证书",
      "提升职业竞争力",
      "证明专业技能水平",
      "拓展职业发展机会"
    ]
  };

  // 所有卡片数据
  const allCards = [
    {
      id: "theory",
      type: "exam",
      title: "理论考试",
      subtitle: "AI基础理论知识测试",
      duration: "120min",
      questions: "100题",
      icon: FileText,
      bgColor: "#A2EBFF"
    },
    {
      id: "practical",
      type: "exam", 
      title: "实践考试",
      subtitle: "AI实际操作技能测试",
      duration: "90min",
      questions: "5个项目",
      icon: FlaskConical,
      bgColor: "#79E3DA"
    },
    {
      id: "requirements",
      type: "info",
      title: "考试要求",
      icon: BookOpen,
      bgColor: "#97CAFF",
      items: examInfo.requirements
    },
    {
      id: "benefits",
      type: "info",
      title: "认证收益",
      icon: Trophy,
      bgColor: "#67B3FF",
      items: examInfo.benefits
    },
    {
      id: "security",
      type: "security",
      title: "考试安全说明",
      icon: Shield,
      bgColor: "#A2EBFF",
      sections: [
        {
          title: "为什么使用独立考试系统？",
          items: [
            "防止考试期间查看课程资料",
            "避免访问训练记录作弊",
            "确保考试环境纯净安全",
            "保障考试结果公平公正"
          ]
        },
        {
          title: "考试注意事项",
          items: [
            "考试将在新窗口中进行",
            "考试期间请勿关闭窗口",
            "确保网络连接稳定",
            "严格遵守考试纪律"
          ]
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      <Header />
      
      {/* 蓝色渐变圆形背景元素 */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-20 -left-60 w-[768px] h-[768px] rounded-full animate-float" style={{
          background: 'radial-gradient(circle, hsl(var(--accent) / 0.6) 0%, transparent 70%)'
        }}></div>
        <div className="absolute bottom-80 -right-100 w-[640px] h-[640px] rounded-full animate-float-slow" style={{
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.6) 0%, transparent 70%)'
        }}></div>
        <div className="absolute bottom-100 -right-60 w-[800px] h-[800px] rounded-full animate-float" style={{
          background: 'radial-gradient(circle, hsl(var(--accent) / 0.5) 0%, transparent 70%)',
          animationDelay: '1s'
        }}></div>
      </div>
      
      <div className={`pt-20 p-6 transition-all duration-300 relative z-10 ${isVertical ? "ml-44" : ""}`}>
        <div className="max-w-7xl mx-auto">
          {/* 主题部分 - 在上边 */}
          <div className="mb-8">
            <div className="rounded-2xl p-8 max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
                {examInfo.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                {examInfo.description}
              </p>
                <Button 
                  onClick={handleExamSystem}
                  size="lg"
                  className="text-lg px-10 py-7 rounded-full border-2 transition-all duration-300 font-semibold"
                  style={{
                    backgroundColor: 'white',
                    borderColor: '#67B3FF',
                    color: '#67B3FF'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#67B3FF';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.borderColor = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.color = '#67B3FF';
                    e.currentTarget.style.borderColor = '#67B3FF';
                  }}
                >
                  进入考试系统 →
                </Button>
            </div>
          </div>

          {/* 主要内容区域 - 卡片 */}
          <div className="relative">
            {/* 横向滚动卡片容器 */}
            <div className="relative overflow-hidden max-w-4xl mt-4 ml-48">
              <div ref={scrollContainerRef} className="overflow-x-auto pb-4 scrollbar-hide" style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}>
                <style>{`
                  .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                <div className="flex gap-4 min-w-max">
                  {/* 第一组卡片 */}
                  {allCards.map((card, index) => {
                    const IconComponent = card.icon;
                    const isActive = activeCardIndex === index;
                    
                    if (card.type === "exam") {
                      return (
                        <div 
                          key={card.id}
                          className={`${card.id === "practical" ? "w-[400px]" : "w-[320px]"} rounded-2xl p-6 flex-shrink-0 backdrop-blur-sm border border-white/20 relative transition-all duration-300 cursor-pointer hover:scale-105`}
                          style={{
                            background: isActive ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.1)'
                          }}
                          onClick={() => scrollToCard(index)}
                        >
                          <div className="text-center mb-4">
                            <h3 className="text-2xl font-bold text-gray-700 mb-2">{card.title}</h3>
                            <p className="text-sm text-gray-600">{card.subtitle}</p>
                          </div>
                          <div className="flex justify-center gap-8 py-4">
                            <div className="text-center">
                              <div className="text-3xl font-bold text-gray-700 mb-1">{card.duration}</div>
                              <div className="text-sm text-gray-500">考试时长</div>
                            </div>
                            <div className="w-px bg-gray-300"></div>
                            <div className="text-center">
                              <div className="text-3xl font-bold text-gray-700 mb-1">{card.questions}</div>
                              <div className="text-sm text-gray-500">题目数量</div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    
                    if (card.type === "info") {
                      return (
                        <div 
                          key={card.id}
                          className="w-[320px] rounded-2xl p-6 flex-shrink-0 backdrop-blur-sm border border-white/20 relative transition-all duration-300 cursor-pointer hover:scale-105"
                          style={{
                            background: isActive ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.1)'
                          }}
                          onClick={() => scrollToCard(index)}
                        >
                          <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-gray-200">
                              <IconComponent className="h-6 w-6 text-gray-700" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-700">{card.title}</h3>
                          </div>
                          <ul className="space-y-3">
                            {card.items?.map((item: string, index: number) => (
                              <li key={index} className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-2 flex-shrink-0" />
                                <span className="text-sm text-gray-600">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    }
                    
                    if (card.type === "security") {
                      return (
                        <div 
                          key={card.id}
                          className="w-[480px] rounded-2xl p-6 flex-shrink-0 backdrop-blur-sm border border-white/20 relative transition-all duration-300 cursor-pointer hover:scale-105"
                          style={{
                            background: isActive ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.1)'
                          }}
                          onClick={() => scrollToCard(index)}
                        >
                          <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-gray-200">
                              <IconComponent className="h-6 w-6 text-gray-700" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-700">{card.title}</h3>
                          </div>
                          <div className="grid grid-cols-2 gap-6">
                            {card.sections?.map((section: any, idx: number) => (
                              <div key={idx}>
                                <h4 className="font-semibold text-gray-700 mb-3 text-sm">{section.title}</h4>
                                <ul className="space-y-2">
                                  {section.items.map((item: string, itemIdx: number) => (
                                    <li key={itemIdx} className="text-xs text-gray-600">
                                      • {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    
                    return null;
                  })}
                  
                </div>
              </div>
              
              {/* 导航点 */}
              <div className="flex justify-center gap-3 mt-6">
                {allCards.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToCard(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 cursor-pointer ${
                      activeCardIndex === index 
                        ? 'scale-110' 
                        : 'bg-white/40 hover:bg-white/60'
                    }`}
                    style={activeCardIndex === index ? { backgroundColor: '#67B3FF' } : undefined}
                    aria-label={`跳转到卡片 ${index + 1}`}
                  />
                ))}
              </div>
              
            </div>
          </div>

          {/* 底部联系信息 */}
          <div className="mt-16 text-center text-sm text-muted-foreground">
            <p className="font-medium mb-2 text-foreground">技术支持</p>
            <p>如遇技术问题，请联系：support@example.com 或拨打 400-123-4567</p>
            <p className="mt-2">考试时间：周一至周五 9:00-17:00</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamCenter;