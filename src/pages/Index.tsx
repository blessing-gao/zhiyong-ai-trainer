import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Trophy, User, Brain, Cpu, Zap } from "lucide-react";
import newLogo from "@/assets/new-logo.png";
import aiCourseHero from "@/assets/ai-course-hero.jpg";

const Index = () => {
  const navigate = useNavigate();

  const cards = [
    {
      icon: BookOpen,
      title: "课程中心",
      description: "系统性学习生成式人工智能技术",
      path: "/courses",
      color: "text-blue-600"
    },
    {
      icon: Brain,
      title: "训练中心", 
      description: "通过练习题巩固AI训练师知识",
      path: "/training",
      color: "text-purple-600"
    },
    {
      icon: Trophy,
      title: "考试中心",
      description: "参加正式的AI训练师认证考试",
      path: "/login/exam",
      color: "text-green-600"
    },
    {
      icon: User,
      title: "个人中心",
      description: "查看学习进度和成绩记录",
      path: "/profile",
      color: "text-orange-600"
    }
  ];

  return (
    <div className="min-h-screen gradient-background">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400 rounded-full opacity-20 floating-element"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-orange-400 rounded-full opacity-20 floating-element" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-400 rounded-full opacity-20 floating-element" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-40 right-1/3 w-14 h-14 bg-green-400 rounded-full opacity-20 floating-element" style={{animationDelay: '1s'}}></div>
      </div>

      <main className="container mx-auto px-4 py-12 relative">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <div className="glassmorphism rounded-3xl p-12 mb-8 relative overflow-hidden">
            <div className="absolute inset-0 gradient-hero opacity-10"></div>
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <img src={newLogo} alt="AI Logo" className="h-24 w-auto floating-element" />
              </div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Zap className="h-4 w-4" />
                最新公告：AI训练师认证考试现已开放报名
              </div>
              <h1 className="text-5xl font-bold text-foreground mb-6 leading-tight">
                开启您的
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI训练师
                </span>
                学习之旅
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                掌握生成式人工智能核心技术，成为数字化转型的领军人才
              </p>
              <Button 
                size="lg"
                onClick={() => navigate('/courses')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                立即开始学习
              </Button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                关于智涌·人工智能中心
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                智涌·人工智能中心是专业的数字经济人才服务提供商，致力于培养高质量的AI训练师人才。
                我们提供系统性的课程体系、实战化的训练环境，助力学员掌握前沿的人工智能技术。
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium">专业师资团队</span>
                </div>
                <div className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium">前沿技术内容</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="glassmorphism rounded-2xl p-8 relative overflow-hidden">
                <img 
                  src={aiCourseHero} 
                  alt="AI Course" 
                  className="w-full h-64 object-cover rounded-xl shadow-lg"
                />
                <div className="absolute top-4 right-4">
                  <img src={newLogo} alt="Logo" className="h-12 w-auto opacity-80" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            学习服务平台
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, index) => (
              <Card 
                key={index}
                className="glassmorphism hover:shadow-xl transition-all duration-300 cursor-pointer border-0 hover:scale-105"
                onClick={() => navigate(card.path)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                    <card.icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                  <CardTitle className="text-lg font-semibold">{card.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <CardDescription className="text-sm leading-relaxed">
                    {card.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Success Cases Section */}
        <section className="text-center">
          <div className="glassmorphism rounded-3xl p-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              成功案例展示
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              我们已成功为政府机构、大型企业等提供专业的AI训练师培养服务，
              培训学员超过10000人次，获得业界广泛认可。
            </p>
            <div className="flex justify-center items-center gap-8 flex-wrap">
              <div className="flex items-center gap-2 text-blue-600 font-semibold">
                <Brain className="h-5 w-5" />
                <span>政府合作</span>
              </div>
              <div className="flex items-center gap-2 text-purple-600 font-semibold">
                <Users className="h-5 w-5" />
                <span>企业培训</span>
              </div>
              <div className="flex items-center gap-2 text-green-600 font-semibold">
                <Trophy className="h-5 w-5" />
                <span>认证考试</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;