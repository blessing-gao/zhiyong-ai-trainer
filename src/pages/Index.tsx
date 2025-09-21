import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Trophy, User, Brain, Cpu, Zap, Play, ArrowRight, Award, Target, Sparkles, CheckCircle, Star, Clock } from "lucide-react";
import newLogo from "@/assets/new-logo.png";
import oilanText from "@/assets/oilan-text.png";
import aiCourseHero from "@/assets/ai-course-hero.jpg";

const Index = () => {
  const navigate = useNavigate();

  const mainFeatures = [
    {
      icon: Brain,
      title: "智能课程体系",
      description: "专业的AI训练师认证课程，涵盖生成式AI核心技术"
    },
    {
      icon: Target,
      title: "实战项目训练",
      description: "真实项目场景训练，提升实际应用能力"
    },
    {
      icon: Award,
      title: "权威认证考试",
      description: "获得行业认可的AI训练师专业资格证书"
    }
  ];

  const serviceCards = [
    {
      icon: BookOpen,
      title: "课程中心",
      description: "系统性学习AI技术",
      path: "/courses",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Cpu,
      title: "训练中心",
      description: "智能题库练习",
      path: "/training", 
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Trophy,
      title: "考试中心",
      description: "专业认证考试",
      path: "/login/exam",
      color: "from-green-500 to-green-600"
    }
  ];

  const advantages = [
    {
      icon: Users,
      title: "专业师资团队",
      description: "由行业专家和资深AI工程师组成的教学团队",
      image: "👨‍🏫"
    },
    {
      icon: Sparkles,
      title: "前沿技术内容",
      description: "紧跟AI技术发展，及时更新课程内容",
      image: "🚀"
    },
    {
      icon: CheckCircle,
      title: "个性化学习路径",
      description: "根据学员基础制定专属学习计划",
      image: "🎯"
    }
  ];

  const processSteps = [
    { title: "注册账号", color: "bg-pink-500" },
    { title: "选择课程", color: "bg-orange-500" },
    { title: "完成学习", color: "bg-purple-500" },
    { title: "参加考试", color: "bg-blue-500" },
    { title: "获得认证", color: "bg-green-500" }
  ];

  return (
    <div className="min-h-screen overflow-hidden relative" style={{background: 'linear-gradient(135deg, #FF8A3D 0%, #FFB347 50%, #FFA500 100%)'}}>
      
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[5%] w-20 h-20 bg-white/20 rounded-full floating-element"></div>
        <div className="absolute top-[60%] left-[3%] w-16 h-16 bg-white/15 rounded-full floating-element" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 right-[8%] w-24 h-24 bg-white/10 rounded-full floating-element" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-[40%] right-[5%] w-14 h-14 bg-white/20 rounded-full floating-element" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Hero Section */}
          <div className="relative overflow-hidden" style={{background: 'linear-gradient(135deg, #E8F4FD 0%, #F3E8FF 50%, #FFF7ED 100%)'}}>
            
            {/* Floating Decorative Elements */}
            <div className="absolute top-10 right-20 w-12 h-12 bg-blue-200 rounded-full opacity-60 floating-element"></div>
            <div className="absolute top-32 right-32 w-8 h-8 bg-purple-200 rounded-full opacity-50 floating-element" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-20 left-16 w-16 h-16 bg-orange-200 rounded-full opacity-40 floating-element" style={{animationDelay: '2s'}}></div>
            <div className="absolute bottom-32 left-32 w-6 h-6 bg-green-200 rounded-full opacity-60 floating-element" style={{animationDelay: '3s'}}></div>
            <div className="absolute top-20 left-20 w-10 h-10 bg-yellow-200 rounded-full opacity-50 floating-element" style={{animationDelay: '4s'}}></div>

            <div className="grid lg:grid-cols-2 gap-12 items-center p-12">
              
              {/* Left Content */}
              <div className="space-y-8">
                {/* Logo and Brand */}
                <div className="flex items-center gap-4">
                  <img src={newLogo} alt="AI Logo" className="h-12 w-auto" />
                  <img src={oilanText} alt="Oilan.ai" className="h-8 w-auto" />
                </div>

                {/* Main Title */}
                <div className="space-y-4">
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
                    <span className="text-blue-600">AI训练师</span> 第一平台
                    <br />
                    <span className="text-2xl text-gray-600 font-normal">专业认证 · 权威培训</span>
                  </h1>
                </div>

                {/* Feature List */}
                <div className="space-y-4">
                  {mainFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-white/50 rounded-2xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mt-1">
                        <feature.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">{feature.title}</h3>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-4">
                  <Button 
                    onClick={() => navigate('/courses')}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    开始学习
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/login/exam')}
                    className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-2xl transition-all duration-300"
                  >
                    参加考试
                  </Button>
                </div>
              </div>

              {/* Right Content - Hero Visual */}
              <div className="relative">
                <div className="relative z-10 text-center">
                  {/* 3D Character Placeholder */}
                  <div className="w-80 h-80 mx-auto mb-6 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-3xl flex items-center justify-center text-8xl shadow-2xl">
                    🤖
                  </div>
                  
                  {/* Floating Stats */}
                  <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold">10K+ 学员在线</span>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">95%</div>
                      <div className="text-xs text-gray-600">通过率</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Service Cards Section */}
          <div className="p-12 bg-gray-50">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {serviceCards.map((card, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-2"
                  onClick={() => navigate(card.path)}
                >
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <card.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{card.title}</h3>
                  <p className="text-gray-600 text-sm">{card.description}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button 
                onClick={() => navigate('/courses')}
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                查看所有服务
              </Button>
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className="p-12">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              为什么选择我们？
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {advantages.map((advantage, index) => (
                <div key={index} className="text-center group">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {advantage.image}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{advantage.title}</h3>
                  <p className="text-gray-600">{advantage.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section with 3D Character */}
          <div className="p-12 bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  创建专属学习计划
                  <br />
                  <span className="text-orange-500">仅需5天！</span>
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  如果你想快速掌握AI技术，我们提供最优质的培训方案。
                  从基础理论到实践应用，全方位提升你的AI技能。
                </p>
                <Button 
                  onClick={() => navigate('/courses')}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  制定学习计划
                </Button>
              </div>
              
              <div className="relative">
                <div className="flex items-center justify-center">
                  <div className="text-6xl">🧠</div>
                  <div className="text-4xl mx-4">+</div>
                  <div className="text-6xl">💻</div>
                  <div className="text-4xl mx-4">+</div>
                  <div className="text-6xl">🎓</div>
                </div>
                <div className="text-center mt-4">
                  <span className="text-lg font-semibold text-gray-700">理论 + 实践 + 认证</span>
                </div>
              </div>
            </div>
          </div>

          {/* Learning Process Section */}
          <div className="p-12 bg-white">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              学习流程
            </h2>
            
            <div className="relative">
              <div className="flex justify-between items-center mb-8">
                {processSteps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className={`w-12 h-12 ${step.color} rounded-full flex items-center justify-center text-white font-bold text-lg mb-2`}>
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{step.title}</span>
                  </div>
                ))}
              </div>
              
              {/* Progress Bar */}
              <div className="relative h-2 bg-gray-200 rounded-full mx-6">
                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-500 via-orange-500 via-purple-500 via-blue-500 to-green-500 rounded-full" style={{width: '100%'}}></div>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="p-12 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">🙏 感谢您的关注！</h2>
            <p className="text-xl mb-8">开始您的AI学习之旅</p>
            <Button 
              onClick={() => navigate('/courses')}
              className="bg-white text-orange-500 hover:bg-gray-100 px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
            >
              立即开始学习
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;