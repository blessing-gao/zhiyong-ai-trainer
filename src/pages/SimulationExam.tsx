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
  Brain,
  Trophy,
  AlertTriangle
} from "lucide-react";
import Header from "@/components/Header";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate, useParams } from "react-router-dom";

const SimulationExam = () => {
  const { applyRoleTheme } = useTheme();
  const navigate = useNavigate();
  const { examId } = useParams();
  const [isVertical, setIsVertical] = useState(() => {
    const saved = localStorage.getItem("navPosition");
    return saved === "vertical";
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120 * 60); // 120分钟倒计时
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleSubmitExam]);

  // 考试数据
  const examData = {
    'mock-1': {
      title: '模拟考试一',
      description: '基础知识综合测试',
      questions: 100,
      duration: 120,
      difficulty: '初级'
    },
    'mock-2': {
      title: '模拟考试二',
      description: '应用能力综合测试',
      questions: 120,
      duration: 150,
      difficulty: '中级'
    },
    'mock-3': {
      title: '模拟考试三',
      description: '高级实战综合测试',
      questions: 150,
      duration: 180,
      difficulty: '高级'
    }
  };

  const currentExam = examData[examId as keyof typeof examData] || examData['mock-1'];

  const questions = [
    {
      id: 1,
      question: "在机器学习中，以下哪个算法属于无监督学习？",
      options: [
        "线性回归",
        "K-means聚类",
        "决策树",
        "支持向量机"
      ],
      correct: 1,
      explanation: "K-means聚类是无监督学习算法，不需要标签数据就能将数据分组。"
    },
    {
      id: 2,
      question: "深度学习中，梯度消失问题主要出现在哪种网络中？",
      options: [
        "卷积神经网络",
        "循环神经网络",
        "全连接网络",
        "注意力网络"
      ],
      correct: 1,
      explanation: "梯度消失问题主要出现在循环神经网络中，因为梯度在时间步之间传播时会逐渐衰减。"
    },
    {
      id: 3,
      question: "Transformer架构中的自注意力机制的作用是？",
      options: [
        "减少计算复杂度",
        "捕获序列中的长距离依赖关系",
        "提高网络深度",
        "减少参数量"
      ],
      correct: 1,
      explanation: "自注意力机制能够同时关注序列中的所有位置，有效捕获长距离依赖关系。"
    },
    {
      id: 4,
      question: "生成式AI中，以下哪个不是常见的生成模型？",
      options: [
        "GAN (生成对抗网络)",
        "VAE (变分自编码器)",
        "CNN (卷积神经网络)",
        "GPT (生成预训练变换器)"
      ],
      correct: 2,
      explanation: "CNN是判别式模型，主要用于特征提取和分类，不是生成模型。"
    },
    {
      id: 5,
      question: "在自然语言处理中，BERT模型的主要创新是什么？",
      options: [
        "使用循环神经网络",
        "双向编码器表示",
        "注意力机制",
        "卷积操作"
      ],
      correct: 1,
      explanation: "BERT的核心创新是双向编码器表示，能够同时利用上下文的前向和后向信息。"
    }
  ];

  const currentQuestionData = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex.toString());
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerIndex.toString()
    }));
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
      setSelectedAnswer(answers[currentQuestion + 1] || null);
      setShowResult(false);
    } else {
      setShowConfirmDialog(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setSelectedAnswer(answers[currentQuestion - 1] || null);
      setShowResult(false);
    }
  };

  const handleSubmitExam = () => {
    const finalScore = Math.round((score / questions.length) * 100);
    navigate('/training/exam-result', { 
      state: { 
        score: finalScore,
        total: questions.length,
        examTitle: currentExam.title,
        timeSpent: currentExam.duration * 60 - timeLeft,
        answers: answers
      } 
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
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
                <h1 className="text-2xl font-bold text-foreground">{currentExam.title}</h1>
                <p className="text-muted-foreground">{currentExam.description}</p>
                <Badge className="mt-2 bg-primary text-white">
                  {currentExam.difficulty} · {currentExam.questions}题 · {currentExam.duration}分钟
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-foreground">
                <Clock className="h-4 w-4" />
                <span className="font-mono">{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* 进度条和统计 */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>考试进度</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-white/20" />
              
              <div className="flex justify-between items-center mt-4 text-sm">
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground">已答题: {getAnsweredCount()}/{questions.length}</span>
                  <span className="text-muted-foreground">正确率: {Math.round((score / (currentQuestion + 1)) * 100)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-primary" />
                  <span className="text-foreground font-medium">{currentExam.difficulty}</span>
                </div>
              </div>
            </div>

            {/* 题目卡片 */}
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm mb-6">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary w-10 h-10 rounded-lg flex items-center justify-center">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground">第 {currentQuestion + 1} 题</CardTitle>
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
                  {currentQuestion < questions.length - 1 ? '下一题' : '查看结果'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>

            {/* 确认提交对话框 */}
            {showConfirmDialog && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="bg-white/95 backdrop-blur-xl border-white/20 p-6 max-w-md mx-4">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-6 w-6 text-yellow-500" />
                      <CardTitle className="text-foreground">确认提交考试</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      您已完成所有题目，确定要提交考试吗？提交后将无法修改答案。
                    </p>
                    <div className="flex justify-between text-sm">
                      <span>已答题数:</span>
                      <span className="font-semibold">{getAnsweredCount()}/{questions.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>当前得分:</span>
                      <span className="font-semibold">{score}/{questions.length}</span>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <Button
                        variant="outline"
                        onClick={() => setShowConfirmDialog(false)}
                        className="flex-1"
                      >
                        继续答题
                      </Button>
                      <Button
                        onClick={handleSubmitExam}
                        className="flex-1 bg-primary hover:bg-primary-dark text-white"
                      >
                        提交考试
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationExam;
