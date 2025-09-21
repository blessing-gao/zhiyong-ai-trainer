import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Trophy, User, Brain, Cpu, Zap, Play, ArrowRight, Award, Target, Sparkles } from "lucide-react";
import newLogo from "@/assets/new-logo.png";
import oilanText from "@/assets/oilan-text.png";
import aiCourseHero from "@/assets/ai-course-hero.jpg";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BookOpen,
      title: "智能课程体系",
      description: "AI训练师专业认证课程",
      details: "系统性学习生成式AI技术",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Brain,
      title: "实战训练中心", 
      description: "海量题库智能练习",
      details: "巩固理论知识，提升实践能力",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Trophy,
      title: "权威认证考试",
      description: "行业标准认证体系",
      details: "获得专业AI训练师证书",
      color: "from-green-500 to-teal-500"
    }
  ];

  const stats = [
    { number: "10K+", label: "累计学员", icon: Users },
    { number: "95%", label: "通过率", icon: Award },
    { number: "500+", label: "企业合作", icon: Target },
    { number: "24/7", label: "在线支持", icon: Sparkles }
  ];

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 gradient-background">
        {/* Floating Shapes */}
        <div className="absolute top-20 left-[10%] w-24 h-24 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full opacity-20 floating-shape"></div>
        <div className="absolute top-[30%] right-[15%] w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-20 floating-shape" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-[25%] left-[20%] w-20 h-20 bg-gradient-to-br from-green-400 to-teal-400 rounded-full opacity-20 floating-shape" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-[40%] right-[25%] w-18 h-18 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full opacity-20 floating-shape" style={{animationDelay: '1s'}}></div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-[15%] right-[8%] w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-400 transform rotate-45 opacity-15 floating-shape" style={{animationDelay: '3s'}}></div>
        <div className="absolute bottom-[15%] left-[8%] w-14 h-14 bg-gradient-to-br from-pink-400 to-red-400 transform rotate-12 opacity-15 floating-shape" style={{animationDelay: '5s'}}></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <section className="px-6 pt-20 pb-12">
          <div className="modern-card p-12 mx-4 mb-16 relative overflow-hidden">
            
            {/* Content Grid */}
            <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
              
              {/* Left Content */}
              <div className="space-y-8">
                {/* Logo and Brand */}
                <div className="flex items-center gap-4 mb-8">
                  <img src={newLogo} alt="AI Logo" className="h-16 w-auto" />
                  <img src={oilanText} alt="Oilan.ai" className="h-10 w-auto" />
                </div>

                {/* Announcement Badge */}
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-blue-100 text-orange-800 px-6 py-3 rounded-full text-sm font-semibold border border-orange-200/50">
                  <Play className="h-4 w-4" />
                  AI训练师认证考试正在报名中
                </div>

                {/* Main Heading */}
                <div className="space-y-4">
                  <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
                    成为顶尖
                    <br />
                    <span className="bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                      AI训练师
                    </span>
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                    掌握生成式人工智能核心技术，获得行业权威认证，成为数字化时代的技术专家
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Button 
                    size="lg"
                    onClick={() => navigate('/courses')}
                    className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white px-8 py-4 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group"
                  >
                    开始学习之旅
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button 
                    variant="outline"
                    size="lg"
                    onClick={() => navigate('/login/exam')}
                    className="border-2 border-blue-200 hover:border-blue-300 text-blue-700 hover:bg-blue-50 px-8 py-4 text-lg rounded-2xl transition-all duration-300"
                  >
                    立即考试
                  </Button>
                </div>
              </div>

              {/* Right Content - Hero Image */}
              <div className="relative">
                <div className="relative z-10 modern-card p-8 border-0 bg-gradient-to-br from-blue-50 to-purple-50">
                  <img 
                    src={aiCourseHero} 
                    alt="AI Training" 
                    className="w-full h-80 object-cover rounded-2xl shadow-2xl"
                  />
                  
                  {/* Floating Stats */}
                  <div className="absolute -top-4 -right-4 modern-card p-4 bg-white/90">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-gray-700">实时在线</span>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-4 -left-4 modern-card p-4 bg-white/90">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">10K+</div>
                      <div className="text-xs text-gray-600">学员</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-6 mb-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mx-4">
            {stats.map((stat, index) => (
              <div key={index} className="modern-card p-6 text-center border-0">
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-blue-500" />
                <div className="text-3xl font-bold text-gray-800 mb-1">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              为什么选择我们？
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              专业的AI训练师培养平台，提供全方位的学习和认证服务
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mx-4">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="modern-card p-8 border-0 group cursor-pointer"
                onClick={() => navigate(index === 0 ? '/courses' : index === 1 ? '/training' : '/login/exam')}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} p-4 mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-lg text-gray-600 mb-2 text-center">
                  {feature.description}
                </p>
                <p className="text-sm text-gray-500 text-center">
                  {feature.details}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Process Section */}
        <section className="px-6 pb-16">
          <div className="modern-card p-12 mx-4 border-0">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                学习流程
              </h2>
              <p className="text-xl text-gray-600">
                简单四步，成为认证AI训练师
              </p>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              {['注册学习', '课程培训', '模拟练习', '认证考试'].map((step, index) => (
                <div key={index} className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{step}</h3>
                  {index < 3 && (
                    <ArrowRight className="hidden lg:block h-6 w-6 text-gray-400 absolute translate-x-20" />
                  )}
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button 
                size="lg"
                onClick={() => navigate('/courses')}
                className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white px-12 py-4 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                立即开始
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;