import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Target,
  RotateCcw,
  BookOpen,
  Trophy,
  AlertCircle
} from "lucide-react";
import Header from "@/components/Header";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

const WrongQuestionsPractice = () => {
  const { applyRoleTheme } = useTheme();
  const navigate = useNavigate();
  const [isVertical, setIsVertical] = useState(() => {
    const saved = localStorage.getItem("navPosition");
    return saved === "vertical";
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60分钟倒计时
  const [practiceMode, setPracticeMode] = useState<'review' | 'practice'>('review');

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

  // 倒计时
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 错题数据
  const wrongQuestions = [
    {
      id: 1,
      question: "以下哪个不是机器学习中的监督学习算法？",
      options: [
        "线性回归",
        "K-means聚类",
        "决策树",
        "支持向量机"
      ],
      correct: 1,
      explanation: "K-means聚类是无监督学习算法，不需要标签数据。监督学习需要输入-输出对来训练模型。",
      category: "机器学习算法",
      difficulty: "中等",
      wrongCount: 3,
      lastWrong: "2024-01-15"
    },
    {
      id: 2,
      question: "深度学习中，以下哪个不是解决梯度消失问题的方法？",
      options: [
        "使用ReLU激活函数",
        "使用LSTM网络",
        "增加网络层数",
        "使用残差连接"
      ],
      correct: 2,
      explanation: "增加网络层数会加剧梯度消失问题。ReLU、LSTM、残差连接都是解决梯度消失的有效方法。",
      category: "深度学习原理",
      difficulty: "困难",
      wrongCount: 5,
      lastWrong: "2024-01-14"
    },
    {
      id: 3,
      question: "在生成式AI中，以下哪个不是GAN的组成部分？",
      options: [
        "生成器",
        "判别器",
        "编码器",
        "损失函数"
      ],
      correct: 2,
      explanation: "GAN由生成器和判别器组成，通过对抗训练学习数据分布。编码器是VAE等模型的组件。",
      category: "生成式AI应用",
      difficulty: "中等",
      wrongCount: 2,
      lastWrong: "2024-01-13"
    },
    {
      id: 4,
      question: "以下哪个不是数据预处理中常用的方法？",
      options: [
        "标准化",
        "归一化",
        "增加网络深度",
        "特征选择"
      ],
      correct: 2,
      explanation: "增加网络深度是模型结构调整，不是数据预处理方法。标准化、归一化、特征选择都是常用的数据预处理技术。",
      category: "数据处理方法",
      difficulty: "简单",
      wrongCount: 1,
      lastWrong: "2024-01-12"
    },
    {
      id: 5,
      question: "以下哪个不是模型评估的常用指标？",
      options: [
        "准确率",
        "精确率",
        "增加训练数据",
        "F1分数"
      ],
      correct: 2,
      explanation: "增加训练数据是提升模型性能的方法，不是评估指标。准确率、精确率、F1分数都是常用的模型评估指标。",
      category: "模型评估指标",
      difficulty: "简单",
      wrongCount: 2,
      lastWrong: "2024-01-11"
    }
  ];

  const currentQuestionData = wrongQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / wrongQuestions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex.toString());
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    setShowResult(true);
    const correct = selectedAnswer === currentQuestionData.correct.toString();
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < wrongQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // 练习完成
      navigate('/training/wrong-result', { 
        state: { 
          score, 
          total: wrongQuestions.length, 
          timeSpent: 60 * 60 - timeLeft
        } 
      });
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <div className={`pt-20 p-6 transition-all duration-300 ${isVertical ? "ml-44" : ""}`}>
        <div className="max-w-4xl mx-auto">
          {/* 半透明白色容器 */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
            
            {/* 头部信息 */}
            <div className="flex items-center justify-between mb-8">
              <Button 
                variant="outline" 
                onClick={() => navigate('/training')}
                className="border-border text-foreground hover:bg-muted/50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回训练中心
              </Button>
              
              <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground">错题练习</h1>
                <p className="text-muted-foreground">针对性练习，巩固薄弱知识点</p>
                <div className="flex justify-center gap-2 mt-2">
                  <Badge className="bg-red-100 text-red-700 border-red-200">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    错题 {currentQuestion + 1}/{wrongQuestions.length}
                  </Badge>
                  <Badge className="bg-primary text-white">
                    {currentQuestionData.category}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-foreground">
                <Clock className="h-4 w-4" />
                <span className="font-mono">{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* 错题统计信息 */}
            <Card className="bg-white/5 border-white/20 backdrop-blur-sm mb-6">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-red-600">{currentQuestionData.wrongCount}</div>
                    <div className="text-xs text-muted-foreground">错误次数</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{currentQuestionData.difficulty}</div>
                    <div className="text-xs text-muted-foreground">难度等级</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{currentQuestionData.category}</div>
                    <div className="text-xs text-muted-foreground">知识点</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{currentQuestionData.lastWrong}</div>
                    <div className="text-xs text-muted-foreground">上次错误</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 进度条 */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>练习进度</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-white/20" />
            </div>

            {/* 题目卡片 */}
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm mb-6">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-red-500 w-10 h-10 rounded-lg flex items-center justify-center">
                    <RotateCcw className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground">错题 {currentQuestion + 1}</CardTitle>
                    <p className="text-sm text-muted-foreground">选择题 · 已错误 {currentQuestionData.wrongCount} 次</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-lg text-foreground leading-relaxed">
                    {currentQuestionData.question}
                  </div>
                  
                  <div className="space-y-3">
                    {currentQuestionData.options.map((option, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                          selectedAnswer === index.toString()
                            ? showResult
                              ? isCorrect && selectedAnswer === currentQuestionData.correct.toString()
                                ? 'bg-green-100 border-green-500 text-green-700'
                                : selectedAnswer === currentQuestionData.correct.toString()
                                ? 'bg-green-100 border-green-500 text-green-700'
                                : 'bg-red-100 border-red-500 text-red-700'
                              : 'bg-primary/20 border-primary text-primary'
                            : showResult && index === currentQuestionData.correct
                            ? 'bg-green-100 border-green-500 text-green-700'
                            : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
                        }`}
                        onClick={() => handleAnswerSelect(index)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selectedAnswer === index.toString()
                              ? showResult
                                ? isCorrect && selectedAnswer === currentQuestionData.correct.toString()
                                  ? 'border-green-500 bg-green-500'
                                  : selectedAnswer === currentQuestionData.correct.toString()
                                  ? 'border-green-500 bg-green-500'
                                  : 'border-red-500 bg-red-500'
                                : 'border-primary bg-primary'
                              : showResult && index === currentQuestionData.correct
                              ? 'border-green-500 bg-green-500'
                              : 'border-white/30'
                          }`}>
                            {selectedAnswer === index.toString() && (
                              <CheckCircle className="h-4 w-4 text-white" />
                            )}
                            {showResult && index === currentQuestionData.correct && selectedAnswer !== index.toString() && (
                              <CheckCircle className="h-4 w-4 text-white" />
                            )}
                          </div>
                          <span className="font-medium">{String.fromCharCode(65 + index)}. {option}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {showResult && (
                    <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/20">
                      <div className="flex items-center gap-2 mb-2">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <span className={`font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                          {isCorrect ? '回答正确！' : '回答错误'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{currentQuestionData.explanation}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>知识点: {currentQuestionData.category}</span>
                        <span>难度: {currentQuestionData.difficulty}</span>
                        <span>错误次数: {currentQuestionData.wrongCount}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 操作按钮 */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="border-border text-foreground hover:bg-muted/50 disabled:opacity-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                上一题
              </Button>

              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  得分: <span className="font-semibold text-foreground">{score}/{currentQuestion + 1}</span>
                </div>
                <Badge variant="outline" className="border-white/20 text-foreground">
                  <Trophy className="h-3 w-3 mr-1" />
                  {Math.round((score / (currentQuestion + 1)) * 100)}%
                </Badge>
              </div>

              {!showResult ? (
                <Button
                  onClick={handleSubmit}
                  disabled={selectedAnswer === null}
                  className="bg-primary hover:bg-primary-dark text-white disabled:opacity-50"
                >
                  提交答案
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="bg-primary hover:bg-primary-dark text-white"
                >
                  {currentQuestion < wrongQuestions.length - 1 ? '下一题' : '完成练习'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WrongQuestionsPractice;
