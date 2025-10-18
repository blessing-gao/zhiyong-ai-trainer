import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  CheckCircle,
  Lock,
  Lightbulb,
  Target
} from "lucide-react";
import Header from "@/components/Header";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

interface KnowledgePoint {
  id: number;
  name: string;
  description: string;
  questions: number;
  completed: number;
  locked: boolean;
}

interface Chapter {
  id: number;
  name: string;
  progress: number;
  points: KnowledgePoint[];
}

const KnowledgeExplore = () => {
  const { applyRoleTheme } = useTheme();
  const navigate = useNavigate();
  const [isVertical, setIsVertical] = useState(() => {
    const saved = localStorage.getItem("navPosition");
    return saved === "vertical";
  });
  const [selectedChapter, setSelectedChapter] = useState(0);
  const [selectedPoint, setSelectedPoint] = useState<KnowledgePoint | null>(null);

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

  // 知识体系数据
  const chapters: Chapter[] = [
    {
      id: 1,
      name: "AI基础理论",
      progress: 65,
      points: [
        { id: 1, name: "机器学习基础", description: "了解机器学习的基本概念和原理", questions: 15, completed: 10, locked: false },
        { id: 2, name: "深度学习入门", description: "神经网络和深度学习的基础知识", questions: 20, completed: 12, locked: false },
        { id: 3, name: "数据预处理", description: "数据清洗和特征工程", questions: 12, completed: 8, locked: false },
        { id: 4, name: "模型评估", description: "模型性能评估方法", questions: 18, completed: 0, locked: true }
      ]
    },
    {
      id: 2,
      name: "自然语言处理",
      progress: 40,
      points: [
        { id: 5, name: "文本处理基础", description: "分词、词性标注等基础技术", questions: 16, completed: 6, locked: false },
        { id: 6, name: "词向量表示", description: "Word2Vec、GloVe等词向量方法", questions: 14, completed: 0, locked: false },
        { id: 7, name: "序列模型", description: "RNN、LSTM、Transformer等", questions: 22, completed: 0, locked: true },
        { id: 8, name: "应用实践", description: "情感分析、机器翻译等应用", questions: 20, completed: 0, locked: true }
      ]
    },
    {
      id: 3,
      name: "计算机视觉",
      progress: 25,
      points: [
        { id: 9, name: "图像基础", description: "图像处理和特征提取", questions: 18, completed: 4, locked: false },
        { id: 10, name: "卷积神经网络", description: "CNN架构和应用", questions: 20, completed: 0, locked: false },
        { id: 11, name: "目标检测", description: "YOLO、R-CNN等检测方法", questions: 16, completed: 0, locked: true },
        { id: 12, name: "图像分割", description: "语义分割和实例分割", questions: 14, completed: 0, locked: true }
      ]
    }
  ];

  const currentChapter = chapters[selectedChapter];

  const handlePracticeTopic = (point: KnowledgePoint) => {
    if (!point.locked) {
      setSelectedPoint(point);
      // 可以在这里导航到练习页面
      navigate(`/training/chapter/${point.name}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      <Header />

      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-20 -left-60 w-[768px] h-[768px] rounded-full animate-float" style={{
          background: 'radial-gradient(circle, hsl(var(--accent) / 0.6) 0%, transparent 70%)'
        }}></div>
        <div className="absolute bottom-20 -right-50 w-[640px] h-[640px] rounded-full animate-float-slow" style={{
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.6) 0%, transparent 70%)'
        }}></div>
      </div>

      <div className={`pt-20 p-6 transition-all duration-300 relative z-10 ${isVertical ? "ml-44" : ""}`}>
        <div className="max-w-7xl mx-auto">
          {/* 返回按钮 */}
          <Button
            variant="outline"
            onClick={() => navigate('/training')}
            className="mb-8 border-white/20 text-foreground hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回训练中心
          </Button>

          {/* 页面标题 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-3">知识探索</h1>
            <p className="text-xl text-muted-foreground">
              系统化学习AI知识体系，掌握核心概念和技能
            </p>
          </div>

          {/* 主体内容 - 左右分栏 */}
          <div className="grid md:grid-cols-4 gap-6">
            {/* 左侧：知识体系导航 */}
            <div className="md:col-span-1">
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm sticky top-24">
                <CardHeader>
                  <CardTitle className="text-foreground">知识体系</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {chapters.map((chapter, index) => (
                    <button
                      key={chapter.id}
                      onClick={() => setSelectedChapter(index)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                        selectedChapter === index
                          ? 'bg-primary text-white'
                          : 'bg-white/5 text-foreground hover:bg-white/10'
                      }`}
                    >
                      <div className="font-medium text-sm">{chapter.name}</div>
                      <div className="text-xs mt-1 opacity-75">
                        {chapter.points.filter(p => !p.locked).length}/{chapter.points.length} 知识点
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* 右侧：知识点详情 */}
            <div className="md:col-span-3">
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-foreground">{currentChapter.name}</CardTitle>
                      <CardDescription className="text-base mt-2">
                        学习进度：{currentChapter.progress}%
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">{currentChapter.progress}%</div>
                      <div className="text-sm text-muted-foreground">完成度</div>
                    </div>
                  </div>
                  <Progress value={currentChapter.progress} className="mt-4" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentChapter.points.map((point) => (
                      <div
                        key={point.id}
                        className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-foreground">{point.name}</h3>
                              {point.locked ? (
                                <Lock className="h-4 w-4 text-yellow-500" />
                              ) : (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{point.description}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-muted-foreground">
                                <Target className="h-4 w-4 inline mr-1" />
                                {point.questions} 道题目
                              </span>
                              <span className="text-muted-foreground">
                                <CheckCircle className="h-4 w-4 inline mr-1" />
                                已完成 {point.completed} 道
                              </span>
                            </div>
                          </div>
                          <Button
                            onClick={() => handlePracticeTopic(point)}
                            disabled={point.locked}
                            className={`ml-4 ${
                              point.locked
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-primary hover:bg-primary-dark'
                            }`}
                          >
                            {point.locked ? '已锁定' : '练习'}
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 学习建议 */}
          <div className="mt-8 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-6 w-6 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">学习建议</h3>
                <p className="text-sm text-muted-foreground">
                  建议按照章节顺序学习，每个知识点都包含详细的讲解和练习题。完成当前章节后，下一章节将自动解锁。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeExplore;

