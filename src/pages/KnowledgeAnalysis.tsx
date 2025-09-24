import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Brain, TrendingDown, TrendingUp, AlertTriangle, CheckCircle, Target, BookOpen, BarChart3 } from "lucide-react";

export const KnowledgeAnalysis = () => {
  const navigate = useNavigate();
  
  // Mock data for knowledge analysis
  const knowledgeAreas = [
    {
      id: 1,
      name: "人工智能概述",
      totalQuestions: 120,
      correctAnswers: 108,
      accuracy: 90,
      trend: "up",
      level: "excellent",
      weakPoints: ["AI伦理问题", "发展历史细节"],
      strongPoints: ["基本概念", "应用领域"],
      lastPractice: "2024-01-15"
    },
    {
      id: 2,
      name: "机器学习基础",
      totalQuestions: 200,
      correctAnswers: 140,
      accuracy: 70,
      trend: "down",
      level: "good",
      weakPoints: ["过拟合与欠拟合", "模型评估指标", "特征工程"],
      strongPoints: ["监督学习", "无监督学习"],
      lastPractice: "2024-01-14"
    },
    {
      id: 3,
      name: "深度学习原理",
      totalQuestions: 180,
      correctAnswers: 117,
      accuracy: 65,
      trend: "stable",
      level: "needs_improvement",
      weakPoints: ["反向传播算法", "CNN架构", "RNN原理", "优化算法"],
      strongPoints: ["神经网络基础", "激活函数"],
      lastPractice: "2024-01-13"
    },
    {
      id: 4,
      name: "生成式AI技术",
      totalQuestions: 150,
      correctAnswers: 82,
      accuracy: 55,
      trend: "down",
      level: "weak",
      weakPoints: ["Transformer架构", "GPT原理", "扩散模型", "提示工程"],
      strongPoints: ["生成式AI概念"],
      lastPractice: "2024-01-12"
    },
    {
      id: 5,
      name: "实际应用案例",
      totalQuestions: 100,
      correctAnswers: 85,
      accuracy: 85,
      trend: "up",
      level: "excellent",
      weakPoints: ["行业特定应用"],
      strongPoints: ["通用应用场景", "技术选型"],
      lastPractice: "2024-01-11"
    },
    {
      id: 6,
      name: "项目实践",
      totalQuestions: 80,
      correctAnswers: 56,
      accuracy: 70,
      trend: "stable",
      level: "good",
      weakPoints: ["项目管理", "团队协作"],
      strongPoints: ["技术实现", "问题解决"],
      lastPractice: "2024-01-10"
    }
  ];

  const getLevelBadge = (level: string) => {
    const levels = {
      excellent: { color: "bg-green-100 text-green-700 border-green-200", text: "优秀", icon: "🌟" },
      good: { color: "bg-blue-100 text-blue-700 border-blue-200", text: "良好", icon: "👍" },
      needs_improvement: { color: "bg-yellow-100 text-yellow-700 border-yellow-200", text: "需提升", icon: "⚠️" },
      weak: { color: "bg-red-100 text-red-700 border-red-200", text: "薄弱", icon: "🔴" }
    };
    
    const levelInfo = levels[level as keyof typeof levels];
    return (
      <Badge className={levelInfo.color}>
        {levelInfo.icon} {levelInfo.text}
      </Badge>
    );
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <BarChart3 className="h-4 w-4 text-gray-600" />;
    }
  };

  const getOverallStats = () => {
    const totalQuestions = knowledgeAreas.reduce((sum, area) => sum + area.totalQuestions, 0);
    const totalCorrect = knowledgeAreas.reduce((sum, area) => sum + area.correctAnswers, 0);
    const overallAccuracy = Math.round((totalCorrect / totalQuestions) * 100);
    
    const excellentAreas = knowledgeAreas.filter(area => area.level === "excellent").length;
    const weakAreas = knowledgeAreas.filter(area => area.level === "weak").length;
    const improvingAreas = knowledgeAreas.filter(area => area.trend === "up").length;
    
    return {
      totalQuestions,
      totalCorrect,
      overallAccuracy,
      excellentAreas,
      weakAreas,
      improvingAreas
    };
  };

  const stats = getOverallStats();

  const getRecommendations = () => {
    const weakAreas = knowledgeAreas.filter(area => area.level === "weak" || area.level === "needs_improvement");
    const decliningAreas = knowledgeAreas.filter(area => area.trend === "down");
    
    return {
      priority: weakAreas.slice(0, 2),
      declining: decliningAreas.slice(0, 2),
      suggestions: [
        "建议每天花费30-45分钟专注于薄弱知识点练习",
        "对于生成式AI技术，建议先从基础概念开始，循序渐进",
        "深度学习原理需要结合实际代码练习来加深理解",
        "定期回顾已掌握的知识点，防止遗忘"
      ]
    };
  };

  const recommendations = getRecommendations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="ghost" onClick={() => navigate("/training")} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回训练中心
            </Button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
              知识点分析
            </h1>
            <p className="text-xl text-muted-foreground mt-2">
              深入了解您的学习状况，精准定位提升方向
            </p>
          </div>
        </div>

        {/* Overall Statistics */}
        <div className="grid md:grid-cols-6 gap-4 mb-8">
          <Card className="shadow-soft">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.overallAccuracy}%</div>
                <div className="text-sm text-muted-foreground">整体准确率</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.excellentAreas}</div>
                <div className="text-sm text-muted-foreground">优秀领域</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.weakAreas}</div>
                <div className="text-sm text-muted-foreground">薄弱领域</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.improvingAreas}</div>
                <div className="text-sm text-muted-foreground">进步中领域</div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.totalQuestions}</div>
                <div className="text-sm text-muted-foreground">总练习题数</div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.totalCorrect}</div>
                <div className="text-sm text-muted-foreground">总正确数</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">知识点概览</TabsTrigger>
            <TabsTrigger value="weak-points">薄弱点分析</TabsTrigger>
            <TabsTrigger value="recommendations">学习建议</TabsTrigger>
          </TabsList>

          {/* Knowledge Overview */}
          <TabsContent value="overview">
            <div className="grid lg:grid-cols-2 gap-6">
              {knowledgeAreas.map((area) => (
                <Card key={area.id} className="shadow-medium hover:shadow-strong transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="gradient-primary w-12 h-12 rounded-lg flex items-center justify-center">
                          <Brain className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{area.name}</CardTitle>
                          <CardDescription>最近练习: {area.lastPractice}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(area.trend)}
                        {getLevelBadge(area.level)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">准确率</span>
                      <span className={`text-2xl font-bold ${
                        area.accuracy >= 80 ? 'text-green-600' :
                        area.accuracy >= 70 ? 'text-blue-600' :
                        area.accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {area.accuracy}%
                      </span>
                    </div>
                    <Progress value={area.accuracy} className="h-2" />
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">总题数: </span>
                        <span className="font-medium">{area.totalQuestions}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">正确数: </span>
                        <span className="font-medium">{area.correctAnswers}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-700">优势知识点</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {area.strongPoints.map((point, index) => (
                            <Badge key={index} className="bg-green-50 text-green-700 border-green-200 text-xs">
                              {point}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <span className="text-sm font-medium text-red-700">薄弱知识点</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {area.weakPoints.map((point, index) => (
                            <Badge key={index} className="bg-red-50 text-red-700 border-red-200 text-xs">
                              {point}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="w-full mt-4" 
                      variant={area.level === "weak" ? "default" : "outline"}
                      onClick={() => navigate(`/training/chapter/${area.name}`)}
                    >
                      <Target className="h-4 w-4 mr-2" />
                      {area.level === "weak" ? "重点练习" : "继续练习"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Weak Points Analysis */}
          <TabsContent value="weak-points">
            <div className="space-y-6">
              <Card className="shadow-medium">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="gradient-primary w-12 h-12 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle>薄弱知识点详细分析</CardTitle>
                      <CardDescription>需要重点关注和提升的知识领域</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {knowledgeAreas
                      .filter(area => area.level === "weak" || area.level === "needs_improvement")
                      .map((area) => (
                        <div key={area.id} className="p-6 border rounded-lg bg-gradient-to-r from-red-50 to-yellow-50">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">{area.name}</h3>
                            <div className="flex items-center gap-2">
                              {getLevelBadge(area.level)}
                              <span className="text-2xl font-bold text-red-600">{area.accuracy}%</span>
                            </div>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-red-700 mb-2">需要重点提升</h4>
                              <ul className="space-y-1">
                                {area.weakPoints.map((point, index) => (
                                  <li key={index} className="flex items-center gap-2 text-sm">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    {point}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-green-700 mb-2">已掌握知识点</h4>
                              <ul className="space-y-1">
                                {area.strongPoints.map((point, index) => (
                                  <li key={index} className="flex items-center gap-2 text-sm">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    {point}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">
                                错误题数: {area.totalQuestions - area.correctAnswers} / {area.totalQuestions}
                              </span>
                              <Button size="sm" onClick={() => navigate(`/training/chapter/${area.name}`)}>
                                <Target className="h-3 w-3 mr-1" />
                                开始练习
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Recommendations */}
          <TabsContent value="recommendations">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="shadow-medium">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="gradient-primary w-12 h-12 rounded-lg flex items-center justify-center">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle>优先提升建议</CardTitle>
                      <CardDescription>基于您的学习情况生成的个性化建议</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <h4 className="font-medium text-red-800 mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      紧急提升领域
                    </h4>
                    <div className="space-y-2">
                      {recommendations.priority.map((area, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-red-700">{area.name}</span>
                          <Badge className="bg-red-100 text-red-700 border-red-300 text-xs">
                            {area.accuracy}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-medium text-yellow-800 mb-3 flex items-center gap-2">
                      <TrendingDown className="h-4 w-4" />
                      需要关注的下降趋势
                    </h4>
                    <div className="space-y-2">
                      {recommendations.declining.map((area, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-yellow-700">{area.name}</span>
                          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300 text-xs">
                            {area.accuracy}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      学习策略建议
                    </h4>
                    <ul className="space-y-2">
                      {recommendations.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-medium">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="gradient-primary w-12 h-12 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle>学习进度规划</CardTitle>
                      <CardDescription>为您制定的30天提升计划</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-800 mb-2">第1-10天</h4>
                      <p className="text-sm text-green-700">
                        专注生成式AI技术基础概念，每天练习20题，重点理解Transformer和GPT原理
                      </p>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-800 mb-2">第11-20天</h4>
                      <p className="text-sm text-blue-700">
                        深入学习深度学习原理，结合代码实践，每天练习25题，强化反向传播算法理解
                      </p>
                    </div>
                    
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-medium text-purple-800 mb-2">第21-30天</h4>
                      <p className="text-sm text-purple-700">
                        综合复习，模拟考试练习，查漏补缺，每天练习30题，确保整体提升
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button className="w-full">
                      <Target className="h-4 w-4 mr-2" />
                      开始按计划学习
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};