import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Clock, 
  Target
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

const FormalExam = () => {
  const { applyRoleTheme } = useTheme();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: number | null }>({});
  const [timeLeft, setTimeLeft] = useState(100 * 60); // 100分钟倒计时
  const totalQuestions = 100; // 总题数

  // Apply theme based on user role
  useEffect(() => {
    applyRoleTheme();
  }, [applyRoleTheme]);

  // 倒计时
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 生成100道题目
  const generateQuestions = () => {
    const baseQuestions = [
      {
        question: "关于机器学习基础理论的问题1：以下哪个选法是正确的？",
        options: [
          "A. 监控A - 这是一个关于机器学习基础理论的正确描述",
          "B. 监控B - 这是一个关于机器学习基础理论的否正确描述",
          "C. 监控C - 这是一个关于机器学习基础理论的正确描述",
          "D. 监控D - 这是一个关于机器学习基础理论的否正确描述"
        ],
        correct: 0
      },
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
      }
    ];

    const allQuestions = [];
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
    setSelectedAnswer(answerIndex.toString());
    setAnswers({
      ...answers,
      [currentQuestion]: answerIndex
    });
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(answers[currentQuestion + 1]?.toString() || null);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setSelectedAnswer(answers[currentQuestion - 1]?.toString() || null);
    }
  };

  const handleQuestionClick = (index: number) => {
    setCurrentQuestion(index);
    setSelectedAnswer(answers[index]?.toString() || null);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="p-6">
        <div className="max-w-[1400px] mx-auto">
          {/* 半透明白色容器 */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
            
            {/* 头部信息 */}
            <div className="flex items-center justify-between mb-8">
              <Button 
                variant="outline" 
                onClick={() => navigate('/exam')}
                className="border-border text-foreground hover:bg-muted/50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回考试中心
              </Button>
              
              <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground">AI训练师AI证照职考试</h1>
                <p className="text-muted-foreground">卷第 {currentQuestion + 1}/{totalQuestions} 题</p>
              </div>
              
              <div className="flex items-center gap-2 text-foreground">
                <Clock className="h-4 w-4" />
                <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* 主体内容区 - 左右分栏 */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* 左侧答题卡 */}
              <div className="lg:col-span-1">
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-foreground text-center">答题卡</CardTitle>
                    <p className="text-sm text-muted-foreground text-center">已答题 {Object.keys(answers).length}/{totalQuestions}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-5 gap-2 max-h-[500px] overflow-y-auto">
                      {Array.from({ length: totalQuestions }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuestionClick(i)}
                          className={`
                            h-10 rounded-lg font-medium text-sm transition-all duration-200
                            ${currentQuestion === i 
                              ? 'bg-primary text-white ring-2 ring-primary ring-offset-2 ring-offset-white/10' 
                              : answers[i] !== undefined 
                              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                              : 'bg-white/10 text-foreground hover:bg-white/20'
                            }
                          `}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 右侧题目区 */}
              <div className="lg:col-span-3">
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="bg-primary w-12 h-12 rounded-full flex items-center justify-center">
                        <Target className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-foreground text-xl">题目 {currentQuestion + 1}</CardTitle>
                        <p className="text-sm text-muted-foreground">选择题</p>
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
                              selectedAnswer === index.toString()
                                ? 'bg-primary/20 border-primary shadow-md'
                                : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
                            }`}
                            onClick={() => handleAnswerSelect(index)}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                selectedAnswer === index.toString()
                                  ? 'border-primary bg-primary'
                                  : 'border-white/30'
                              }`}>
                                {selectedAnswer === index.toString() && (
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
                <div className="flex justify-between items-center mt-6">
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
                    disabled={currentQuestion === totalQuestions - 1}
                    className="bg-primary hover:bg-primary-dark text-white disabled:opacity-50"
                  >
                    下一题
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* 考试提醒 */}
          <div className="fixed bottom-8 right-8 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 shadow-lg max-w-xs">
            <h4 className="font-semibold text-yellow-800 mb-2">考试提醒</h4>
            <p className="text-sm text-yellow-700">
              记住考试题目！请仔细阅读每道题目。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormalExam;

