import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, BookOpen, Target, Award, Users, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import aiCourseHero from "@/assets/ai-course-hero.jpg";

export const Home = () => {
  const navigate = useNavigate();

  const cards = [
    {
      icon: BookOpen,
      title: "认证与培训",
      description: "了解我们的认证与培训",
      path: "/courses",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Award,
      title: "权威认证",
      description: "获得权威人工智能训练师证书",
      path: "/login/exam",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Target,
      title: "模拟考试",
      description: "题目练习、模拟考试，全方位提升应试能力",
      path: "/training",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Users,
      title: "个人中心",
      description: "管理个人信息，查看学习进度和考试成绩",
      path: "/profile",
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Main Hero Section with Dark Blue Background */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzMzMiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI0Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="container mx-auto px-6 py-24 relative">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              2025年7月人工智能训练师
              <br />
              职业技能等级认定考场安排
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl">
              智涌智能科技有限公司于2025年7月举行职业技能等级认定，现将考场安排有关事宜进行公告
            </p>
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium"
              onClick={() => navigate('/courses')}
            >
              了解详情 
              <span className="ml-2">→</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Organization Section */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                智涌·人工智能中心
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                中国企业首选的数字经济人才服务提供商
              </p>
              <p className="text-gray-600 leading-relaxed">
                智涌智能人才中心是基于人工智能和大数据领域，为企业提供"懂业务、懂数据、懂AI"的复合型人才，同时提供数字人才全生命周期服务。
              </p>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">数智人才</div>
                    <div className="flex space-x-4 text-blue-500">
                      <span className="block w-8 h-8 bg-blue-400 rounded"></span>
                      <span className="block w-8 h-8 bg-blue-500 rounded"></span>
                      <span className="block w-8 h-8 bg-blue-600 rounded"></span>
                    </div>
                  </div>
                </div>
                {/* Floating buttons */}
                <Button className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-2">
                  培训课程
                </Button>
                <Button className="absolute bottom-16 left-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-2">
                  模拟AI
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
            了解我们的认证与培训
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {cards.map((card, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg overflow-hidden"
                onClick={() => navigate(card.path)}
              >
                <div className={`h-40 bg-gradient-to-br ${card.color} relative`}>
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <card.icon className="h-8 w-8 mb-2" />
                    <h3 className="text-lg font-bold">{card.title}</h3>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-gray-600 text-sm">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Cases Section */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 text-gray-900">
            了解我们的成功案例
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 text-blue-600">社会责任（集团公益）</h3>
              <p className="text-gray-600">致力于推动AI教育普及，培养更多数字化人才</p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 text-green-600">政府（香港VTC职业训练局）</h3>
              <p className="text-gray-600">与政府机构合作，提供权威认证培训服务</p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 text-purple-600">企业培训合作</h3>
              <p className="text-gray-600">为企业提供定制化AI人才培养解决方案</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};