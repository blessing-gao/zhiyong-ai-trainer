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
  BookOpen,
  Trophy,
  RotateCcw
} from "lucide-react";
import Header from "@/components/Header";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate, useParams } from "react-router-dom";

const ChapterPractice = () => {
  const { applyRoleTheme } = useTheme();
  const navigate = useNavigate();
  const { chapterName } = useParams();
  const [isVertical, setIsVertical] = useState(() => {
    const saved = localStorage.getItem("navPosition");
    return saved === "vertical";
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30分钟倒计时

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

  const questions = [
    {
      id: 1,
      question: "什么是机器学习？",
      options: [
        "让计算机通过数据学习的技术",
        "让计算机变得更快的技术", 
        "让计算机存储更多数据的技术",
        "让计算机变得更便宜的技术"
      ],
      correct: 0,
      explanation: "机器学习是人工智能的一个分支，通过算法让计算机从数据中学习模式，无需明确编程。"
    },
    {
      id: 2,
      question: "深度学习中常用的激活函数是？",
      options: [
        "ReLU",
        "Sigmoid",
        "Tanh",
        "以上都是"
      ],
      correct: 3,
      explanation: "ReLU、Sigmoid、Tanh都是深度学习中常用的激活函数，各有不同的特点和适用场景。"
    },
    {
      id: 3,
      question: "生成式AI的主要特点是什么？",
      options: [
        "只能识别图像",
        "只能处理文本",
        "能够生成新的内容",
        "只能进行分类"
      ],
      correct: 2,
      explanation: "生成式AI的核心特点是能够生成新的内容，包括文本、图像、音频等多种形式。"
    },
    {
      id: 4,
      question: "Transformer架构的核心机制是？",
      options: [
        "卷积操作",
        "循环连接",
        "注意力机制",
        "池化操作"
      ],
      correct: 2,
      explanation: "Transformer架构的核心是自注意力机制，能够并行处理序列数据并捕获长距离依赖关系。"
    },
    {
      id: 5,
      question: "以下哪个不是生成式AI的应用？",
      options: [
        "ChatGPT对话",
        "图像识别",
        "DALL-E图像生成",
        "代码生成"
      ],
      correct: 1,
      explanation: "图像识别是判别式AI的应用，而ChatGPT、DALL-E、代码生成都是生成式AI的典型应用。"
    }
  ];

  const currentQuestionData = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

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
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // 练习完成
      navigate('/training/result', { 
        state: { 
          score, 
          total: questions.length, 
          chapterName,
          timeSpent: 30 * 60 - timeLeft
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
                <h1 className="text-2xl font-bold text-foreground">{chapterName} 练习</h1>
                <p className="text-muted-foreground">第 {currentQuestion + 1} 题，共 {questions.length} 题</p>
              </div>
              
              <div className="flex items-center gap-2 text-foreground">
                <Clock className="h-4 w-4" />
                <span className="font-mono">{formatTime(timeLeft)}</span>
              </div>
            </div>

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
                  <div className="bg-primary w-10 h-10 rounded-lg flex items-center justify-center">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground">题目 {currentQuestion + 1}</CardTitle>
                    <p className="text-sm text-muted-foreground">选择题</p>
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
                      <p className="text-sm text-muted-foreground">{currentQuestionData.explanation}</p>
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
                  {currentQuestion < questions.length - 1 ? '下一题' : '完成练习'}
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

export default ChapterPractice;
