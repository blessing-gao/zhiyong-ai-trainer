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
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-50 to-pink-50">
      
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[10%] w-16 h-16 bg-blue-200/30 rounded-full floating-element"></div>
        <div className="absolute top-[30%] right-[15%] w-12 h-12 bg-green-300/30 rounded-full floating-element" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-40 left-[20%] w-20 h-20 bg-yellow-200/30 rounded-full floating-element" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-[60%] right-[25%] w-14 h-14 bg-orange-200/30 rounded-full floating-element" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 right-[10%] w-18 h-18 bg-pink-200/30 rounded-full floating-element" style={{animationDelay: '3s'}}></div>
      </div>

      {/* Main Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          
          {/* Left Content */}
          <div className="space-y-8">
            {/* Main Title */}
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Веб-Студия <span className="text-blue-600">Номер 1</span>
                <br />
                <span className="text-3xl text-gray-700 font-normal">В Беларуси В 2021 Году</span>
              </h1>
            </div>

            {/* Feature Cards */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Сайты под ключ</h3>
                  <p className="text-sm text-gray-600">Разработка современных веб-сайтов с нуля</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Cpu className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Продвижение сайтов</h3>
                  <p className="text-sm text-gray-600">SEO оптимизация и интернет-маркетинг</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Программное обеспечение</h3>
                  <p className="text-sm text-gray-600">Разработка кастомных приложений и систем</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - 3D Character */}
          <div className="relative flex justify-center">
            {/* Main 3D Character Container */}
            <div className="relative">
              {/* Background Shapes */}
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-yellow-300 rounded-full opacity-80"></div>
              <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-blue-400 rounded-full opacity-60"></div>
              <div className="absolute top-16 right-8 w-16 h-16 bg-pink-300 rounded-full opacity-70"></div>
              
              {/* 3D Character */}
              <div className="relative z-10 w-96 h-96 bg-gradient-to-br from-orange-300 to-yellow-400 rounded-3xl flex items-center justify-center text-8xl shadow-2xl">
                👨‍💻
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 right-4 bg-white rounded-2xl p-3 shadow-lg floating-element">
                <div className="flex items-center gap-2">
                  <div className="text-2xl">😊</div>
                </div>
              </div>
              
              <div className="absolute bottom-8 -left-6 bg-blue-500 text-white rounded-2xl p-3 shadow-lg floating-element" style={{animationDelay: '1s'}}>
                <div className="text-center">
                  <div className="text-lg font-bold">Более 5 лет</div>
                  <div className="text-xs">в деле</div>
                </div>
              </div>
              
              <div className="absolute top-1/2 -right-8 bg-white rounded-xl p-2 shadow-lg floating-element" style={{animationDelay: '2s'}}>
                <div className="text-2xl">💻</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Cards Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
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
      <div className="container mx-auto px-6 py-16">
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

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-12">
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
      </div>

      {/* Learning Process Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl p-12">
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
      </div>

      {/* Footer CTA */}
      <div className="container mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl text-white text-center p-12">
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
  );
};

export default Index;