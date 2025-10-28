import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Clock,
  Target,
  CheckCircle,
  XCircle,
  RotateCcw
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

const AutoExam = () => {
  const { applyRoleTheme } = useTheme();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: number | null }>({});
  const [timeLeft, setTimeLeft] = useState(90 * 60); // 90分钟倒计时
  const [showResult, setShowResult] = useState(false);
  const totalQuestions = 100;

  // Apply theme based on user role
  useEffect(() => {
    applyRoleTheme();
  }, [applyRoleTheme]);

  // 倒计时
  useEffect(() => {
    // 如果已显示结果，不再运行倒计时
    if (showResult) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          setShowResult(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showResult]);

  // 生成100道题目
  const generateQuestions = (): Question[] => {
    const baseQuestions = [
      {
        question: "什么是机器学习？",
        options: [
          "A. 让计算机通过数据学习的技术",
          "B. 让计算机变得更快的技术",
          "C. 让计算机存储更多数据的技术",
          "D. 让计算机变得更便宜的技术"
        ],
        correct: 0
      },
      {
        question: "深度学习中常用的激活函数是？",
        options: [
          "A. ReLU",
          "B. Sigmoid",
          "C. Tanh",
          "D. 以上都是"
        ],
        correct: 3
      },
      {
        question: "神经网络的反向传播算法的主要作用是？",
        options: [
          "A. 计算梯度并更新权重",
          "B. 初始化网络权重",
          "C. 验证模型性能",
          "D. 数据预处理"
        ],
        correct: 0
      }
    ];

    const allQuestions: Question[] = [];
    for (let i = 0; i < totalQuestions; i++) {
      const base = baseQuestions[i % baseQuestions.length];
      allQuestions.push({
        id: i + 1,
        ...base
      });
    }
    return allQuestions;
  };

  const questions = generateQuestions();
  const currentQuestionData = questions[currentQuestion];

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setAnswers({
      ...answers,
      [currentQuestion]: answerIndex
    });
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(answers[currentQuestion + 1] ?? null);
    } else {
      setShowResult(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setSelectedAnswer(answers[currentQuestion - 1] ?? null);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correct) {
        correct++;
      }
    });
    return Math.round((correct / totalQuestions) * 100);
  };

  if (showResult) {
    const score = calculateScore();
    const correctCount = Object.keys(answers).reduce((count, key) => {
      return answers[parseInt(key)] === questions[parseInt(key)].correct ? count + 1 : count;
    }, 0);

    return (
      <div className="min-h-screen bg-gradient-hero p-6">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="outline"
            onClick={() => navigate('/training')}
            className="mb-8 border-white/20 text-foreground hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回训练中心
          </Button>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-foreground mb-4">考试完成</CardTitle>
              <div className="text-6xl font-bold text-primary mb-4">{score}分</div>
              <p className="text-xl text-muted-foreground">
                答对 {correctCount} / {totalQuestions} 道题目
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <Progress value={score} className="h-3" />
              
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-white/5 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-500">{correctCount}</div>
                  <div className="text-sm text-muted-foreground">正确</div>
                </div>
                <div className="p-4 bg-white/5 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-500">{totalQuestions - correctCount}</div>
                  <div className="text-sm text-muted-foreground">错误</div>
                </div>
                <div className="p-4 bg-white/5 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-500">{formatTime(120 * 60 - timeLeft)}</div>
                  <div className="text-sm text-muted-foreground">用时</div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => navigate('/training')}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white"
                >
                  返回训练中心
                </Button>
                <Button
                  onClick={() => {
                    setCurrentQuestion(0);
                    setSelectedAnswer(null);
                    setAnswers({});
                    setTimeLeft(120 * 60);
                    setShowResult(false);
                  }}
                  variant="outline"
                  className="flex-1 border-white/20 text-foreground hover:bg-white/10"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  重新考试
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero p-6">
      <div className="max-w-4xl mx-auto">
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
              <h1 className="text-2xl font-bold text-foreground">自动组卷考试</h1>
              {!showResult && (
                <p className="text-muted-foreground">第 {currentQuestion + 1}/{totalQuestions} 题</p>
              )}
            </div>
            
            {!showResult && (
              <div className="flex items-center gap-2 text-foreground">
                <Clock className="h-4 w-4" />
                <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>

          {/* 进度条 */}
          <Progress value={(currentQuestion + 1) / totalQuestions * 100} className="mb-8" />

          {/* 题目区 */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm mb-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary w-12 h-12 rounded-full flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-foreground text-xl">题目 {currentQuestion + 1}</CardTitle>
                  <p className="text-sm text-muted-foreground">单选题</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* 题目 */}
                <div className="text-lg text-foreground leading-relaxed font-medium p-4 bg-white/5 rounded-lg">
                  {currentQuestionData.question}
                </div>
                
                {/* 选项 */}
                <div className="space-y-3">
                  {currentQuestionData.options.map((option, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        selectedAnswer === index
                          ? 'bg-primary/20 border-primary shadow-md'
                          : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
                      }`}
                      onClick={() => handleAnswerSelect(index)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedAnswer === index
                            ? 'border-primary bg-primary'
                            : 'border-white/30'
                        }`}>
                          {selectedAnswer === index && (
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span className="text-foreground">{option}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 导航按钮 */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="border-border text-foreground hover:bg-muted/50 disabled:opacity-50"
            >
              上一题
            </Button>

            <Button
              onClick={handleNext}
              className="bg-primary hover:bg-primary-dark text-white"
            >
              {currentQuestion === totalQuestions - 1 ? '提交考试' : '下一题'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoExam;

