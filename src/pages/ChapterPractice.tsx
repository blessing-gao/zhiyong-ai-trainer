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
  RotateCcw,
  Loader2
} from "lucide-react";
import Header from "@/components/Header";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate, useParams, useLocation } from "react-router-dom";

interface Question {
  id: string | number;
  type: string;
  stem: string;
  options: string | null;
  answer: string;
  difficulty: string;
  level: string;
  analysis: string | null;
  status: number;
  create_time: string | null;
  update_time: string | null;
  create_by: string | null;
  update_by: string | null;
}

const ChapterPractice = () => {
  const { applyRoleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { chapterName } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: string | null }>({});
  const [timeLeft, setTimeLeft] = useState(90 * 60); // 90分钟倒计时
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [secondLevelTagId, setSecondLevelTagId] = useState<number | null>(null);

  // Apply theme based on user role
  useEffect(() => {
    applyRoleTheme();
  }, [applyRoleTheme]);

  // 加载题目数据
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);

        // 优先从路由状态获取题目数据
        if (location.state?.questions && location.state?.secondLevelTagId) {
          setQuestions(location.state.questions);
          setSecondLevelTagId(location.state.secondLevelTagId);
        } else if (secondLevelTagId) {
          // 从 localStorage 获取缓存的题目数据
          const cachedQuestions = localStorage.getItem(`questions_${secondLevelTagId}`);
          if (cachedQuestions) {
            setQuestions(JSON.parse(cachedQuestions));
          }
        }
      } catch (error) {
        console.error("Failed to load questions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [location.state, secondLevelTagId]);

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

  // 解析题目选项
  const parseOptions = (question: Question): string[] => {
    if (question.type === 'judge') {
      // 判断题只有两个选项
      return ['正确', '错误'];
    }

    // 对于其他题型，尝试解析 options 字段
    if (question.options) {
      try {
        const parsed = JSON.parse(question.options);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse options:', e);
      }
    }

    // 默认返回空数组
    return [];
  };

  const totalQuestions = questions.length;
  const currentQuestionData = questions[currentQuestion];

  const handleAnswerSelect = (answerIndex: number) => {
    const answerValue = String.fromCharCode(65 + answerIndex); // A, B, C, D...
    setSelectedAnswer(answerValue);
    setAnswers({
      ...answers,
      [currentQuestion]: answerValue
    });
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(answers[currentQuestion + 1] || null);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setSelectedAnswer(answers[currentQuestion - 1] || null);
    }
  };

  const handleQuestionClick = (index: number) => {
    setCurrentQuestion(index);
    setSelectedAnswer(answers[index] || null);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <Header />
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-foreground">加载题目中...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <Header />
        <div className="flex flex-col items-center gap-4">
          <p className="text-foreground text-lg">暂无题目数据</p>
          <Button onClick={() => navigate('/training/knowledge-explore')}>
            返回知识探索
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      <div className="p-6">
        <div className="max-w-[1400px] mx-auto">
          {/* 半透明白色容器 */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
            
            {/* 头部信息 */}
            <div className="flex items-center justify-between mb-8">
              <Button
                variant="outline"
                onClick={() => navigate('/training/knowledge-explore')}
                className="border-border text-foreground hover:bg-muted/50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary w-12 h-12 rounded-full flex items-center justify-center">
                          <Target className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-foreground text-xl">题目 {currentQuestion + 1}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {currentQuestionData.type === 'judge' ? '判断题' : '选择题'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-foreground">
                          难度: {currentQuestionData.difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-foreground">
                          {currentQuestionData.level}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* 题目 */}
                      <div className="text-lg text-foreground leading-relaxed font-medium p-4 bg-white/5 rounded-lg">
                        {currentQuestionData.stem}
                      </div>

                      {/* 选项 */}
                      <div className="space-y-3">
                        {parseOptions(currentQuestionData).map((option, index) => {
                          const answerLetter = String.fromCharCode(65 + index); // A, B, C, D...
                          return (
                            <div
                              key={index}
                              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                selectedAnswer === answerLetter
                                  ? 'bg-primary/20 border-primary shadow-md'
                                  : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
                              }`}
                              onClick={() => handleAnswerSelect(index)}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                  selectedAnswer === answerLetter
                                    ? 'border-primary bg-primary'
                                    : 'border-white/30'
                                }`}>
                                  {selectedAnswer === answerLetter && (
                                    <div className="w-3 h-3 bg-white rounded-full"></div>
                                  )}
                                </div>
                                <span className="text-foreground">
                                  <span className="font-semibold">{answerLetter}.</span> {option}
                                </span>
                              </div>
                            </div>
                          );
                        })}
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

export default ChapterPractice;
