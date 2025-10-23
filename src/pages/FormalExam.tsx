import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Clock,
  Target,
  Send,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";
import { examApi } from "@/services/api";

const FormalExam = () => {
  const { applyRoleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number[] }>({});
  const [questions, setQuestions] = useState<any[]>([]);
  const [examInfo, setExamInfo] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(100 * 60); // 100分钟倒计时
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [examResult, setExamResult] = useState<any>(null);
  const [resultTab, setResultTab] = useState<'correct' | 'wrong'>('correct');
  const [resultCurrentQuestion, setResultCurrentQuestion] = useState(0);

  // Apply theme based on user role
  useEffect(() => {
    applyRoleTheme();
  }, [applyRoleTheme]);

  // 初始化题目数据
  useEffect(() => {
    console.log("📖 初始化题目数据...");
    console.log("📍 路由状态:", location.state);

    let questionsData: any[] = [];
    let examInfoData: any = null;

    // 优先从路由状态获取数据
    if (location.state && location.state.questions && location.state.questions.length > 0) {
      console.log("✅ 从路由状态获取题目数据");
      questionsData = location.state.questions;
      examInfoData = location.state.examInfo;
    } else if (location.state && location.state.fromExamSystem) {
      // 从考试系统进入，使用假数据
      console.log("✅ 从考试系统进入，使用假数据");
      const currentExamInfo = sessionStorage.getItem("currentExamInfo");
      if (currentExamInfo) {
        const examInfo = JSON.parse(currentExamInfo);
        questionsData = generateDefaultQuestions();
        examInfoData = {
          name: examInfo.examName || "考试试卷",
          duration: examInfo.duration || 120,
          totalScore: examInfo.totalScore || 100,
          passScore: examInfo.passScore || 60,
          questionCount: questionsData.length
        };
      } else {
        questionsData = generateDefaultQuestions();
        examInfoData = {
          name: "考试试卷",
          duration: 120,
          totalScore: 100,
          passScore: 60,
          questionCount: questionsData.length
        };
      }
    } else {
      // 其次从 localStorage 获取数据
      const storedQuestions = localStorage.getItem('exam_questions');
      const storedExamInfo = localStorage.getItem('exam_info');

      if (storedQuestions) {
        console.log("✅ 从localStorage获取题目数据");
        questionsData = JSON.parse(storedQuestions);
        examInfoData = storedExamInfo ? JSON.parse(storedExamInfo) : null;
      } else {
        console.warn("⚠️ 未找到题目数据，使用默认数据");
        // 使用默认数据
        questionsData = generateDefaultQuestions();
        examInfoData = {
          name: "默认试卷",
          duration: 120,
          totalScore: 100,
          passScore: 60,
          questionCount: questionsData.length
        };
      }
    }

    setQuestions(questionsData);
    setExamInfo(examInfoData);

    // 设置倒计时时间
    if (examInfoData && examInfoData.duration) {
      setTimeLeft(examInfoData.duration * 60);
    }

    setIsLoading(false);
    console.log("✅ 题目数据初始化完成，共", questionsData.length, "道题目");
  }, [location.state]);

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

  // 生成默认题目（备用）
  const generateDefaultQuestions = () => {
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
    for (let i = 0; i < 100; i++) {
      const base = baseQuestions[i % baseQuestions.length];
      allQuestions.push({
        id: i + 1,
        ...base
      });
    }
    return allQuestions;
  };

  // 获取当前题目数据
  const currentQuestionData = questions.length > 0 ? questions[currentQuestion] : null;
  const totalQuestions = questions.length;

  const handleAnswerSelect = (answerIndex: number) => {
    const currentQuestionType = currentQuestionData?.type;

    if (currentQuestionType === 'multiple') {
      // 多选题：可以选择多个选项
      const currentAnswers = selectedAnswers[currentQuestion] || [];
      if (currentAnswers.includes(answerIndex)) {
        // 如果已选中，则取消选中
        setSelectedAnswers({
          ...selectedAnswers,
          [currentQuestion]: currentAnswers.filter(a => a !== answerIndex)
        });
      } else {
        // 如果未选中，则添加
        setSelectedAnswers({
          ...selectedAnswers,
          [currentQuestion]: [...currentAnswers, answerIndex]
        });
      }
    } else {
      // 单选题、判断题：只能选择一个选项
      setSelectedAnswers({
        ...selectedAnswers,
        [currentQuestion]: [answerIndex]
      });
    }
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleQuestionClick = (index: number) => {
    setCurrentQuestion(index);
  };

  const handleSubmit = async () => {
    const answeredCount = Object.keys(selectedAnswers).length;
    const totalCount = totalQuestions;

    // 显示提交确认
    const confirmMessage = `您已答题 ${answeredCount}/${totalCount} 道题目，确定要提交吗？`;

    if (window.confirm(confirmMessage)) {
      setIsSubmitting(true);
      try {
        // 构建提交数据
        const answers = questions.map((question, index) => {
          const selectedIndexes = selectedAnswers[index] || [];
          return {
            questionId: question.id,
            questionType: question.type,
            answer: selectedIndexes.join(',') // 多选用逗号分隔
          };
        });

        const submitData = {
          examId: 1, // TODO: 从路由参数或考试信息获取
          participantId: 1, // TODO: 从用户信息获取
          answers: answers
        };

        console.log("📤 提交答卷数据:", submitData);

        // 调用后端API
        const response: any = await examApi.submitExamAnswers(submitData);

        if (response.code === 0 && response.data) {
          console.log("✅ 答卷提交成功，结果:", response.data);
          setExamResult(response.data);
        } else {
          alert("提交失败：" + (response.msg || "未知错误"));
        }
      } catch (error) {
        console.error("提交答卷失败:", error);
        alert("提交失败，请重试");
      } finally {
        setIsSubmitting(false);
      }
    }
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

            {/* 如果已提交，显示结果 */}
            {examResult ? (
              <div className="space-y-6">
                {/* 成绩总览 */}
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-center text-2xl text-foreground">答题结果</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div className="p-4 bg-white/5 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-2">总题数</p>
                        <p className="text-2xl font-bold text-foreground">{examResult.totalQuestions}</p>
                      </div>
                      <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                        <p className="text-sm text-green-600 mb-2">答对</p>
                        <p className="text-2xl font-bold text-green-600">{examResult.correctCount}</p>
                      </div>
                      <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                        <p className="text-sm text-red-600 mb-2">答错</p>
                        <p className="text-2xl font-bold text-red-600">{examResult.wrongCount}</p>
                      </div>
                      <div className={`p-4 rounded-lg border ${examResult.passed ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                        <p className="text-sm mb-2">{examResult.passed ? '及格' : '未及格'}</p>
                        <p className={`text-2xl font-bold ${examResult.passed ? 'text-green-600' : 'text-red-600'}`}>
                          {examResult.score.toFixed(1)}分
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 答题卡形式的结果展示 */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* 左侧答题卡 */}
                  <div className="lg:col-span-1">
                    <Card className="bg-white/10 border-white/20 backdrop-blur-sm sticky top-24">
                      <CardHeader>
                        <CardTitle className="text-sm">
                          <div className="flex gap-2 mb-3">
                            <Button
                              variant={resultTab === 'correct' ? 'default' : 'outline'}
                              onClick={() => {
                                setResultTab('correct');
                                setResultCurrentQuestion(0);
                              }}
                              className="gap-2 flex-1 text-xs"
                            >
                              <CheckCircle className="h-3 w-3" />
                              答对
                            </Button>
                            <Button
                              variant={resultTab === 'wrong' ? 'default' : 'outline'}
                              onClick={() => {
                                setResultTab('wrong');
                                setResultCurrentQuestion(0);
                              }}
                              className="gap-2 flex-1 text-xs"
                            >
                              <XCircle className="h-3 w-3" />
                              答错
                            </Button>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-5 gap-2">
                          {(resultTab === 'correct' ? examResult.correctQuestions : examResult.wrongQuestions).map(
                            (question: any, index: number) => (
                              <button
                                key={question.questionId}
                                onClick={() => setResultCurrentQuestion(index)}
                                className={`w-full aspect-square rounded-lg font-semibold text-sm transition-all ${
                                  resultCurrentQuestion === index
                                    ? resultTab === 'correct'
                                      ? 'bg-green-600 text-white border-2 border-green-400'
                                      : 'bg-red-600 text-white border-2 border-red-400'
                                    : resultTab === 'correct'
                                    ? 'bg-green-500/20 text-green-600 border border-green-500/30 hover:bg-green-500/30'
                                    : 'bg-red-500/20 text-red-600 border border-red-500/30 hover:bg-red-500/30'
                                }`}
                              >
                                {index + 1}
                              </button>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* 右侧题目详情 */}
                  <div className="lg:col-span-3">
                    {(() => {
                      const currentQuestions = resultTab === 'correct' ? examResult.correctQuestions : examResult.wrongQuestions;
                      const currentQuestion = currentQuestions[resultCurrentQuestion];

                      if (!currentQuestion) return null;

                      return (
                        <Card className={`bg-white/10 border-white/20 backdrop-blur-sm ${
                          resultTab === 'correct' ? 'border-green-500/30' : 'border-red-500/30'
                        }`}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">
                                第 {resultCurrentQuestion + 1} 题 {resultTab === 'correct' ? '✓' : '✗'}
                              </CardTitle>
                              <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                                resultTab === 'correct'
                                  ? 'bg-green-500/20 text-green-600'
                                  : 'bg-red-500/20 text-red-600'
                              }`}>
                                {resultTab === 'correct' ? '答对' : '答错'}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            {/* 题目 */}
                            <div>
                              <p className="text-sm text-muted-foreground mb-2">题目</p>
                              <p className="text-foreground">{currentQuestion.stem}</p>
                            </div>

                            {/* 选项 */}
                            {currentQuestion.options && (
                              <div>
                                <p className="text-sm text-muted-foreground mb-3">选项</p>
                                <div className="space-y-2">
                                  {currentQuestion.options.split('\n').map((option: string, idx: number) => {
                                    const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D...
                                    const isUserAnswer = currentQuestion.userAnswer.includes(String(idx));
                                    const isCorrectAnswer = currentQuestion.answer.includes(String(idx));

                                    return (
                                      <div
                                        key={idx}
                                        className={`p-3 rounded-lg border-2 transition-all ${
                                          isCorrectAnswer
                                            ? 'bg-green-500/10 border-green-500/50'
                                            : isUserAnswer && resultTab === 'wrong'
                                            ? 'bg-red-500/10 border-red-500/50'
                                            : 'bg-white/5 border-white/10'
                                        }`}
                                      >
                                        <div className="flex items-start gap-3">
                                          <span className={`font-semibold min-w-fit ${
                                            isCorrectAnswer
                                              ? 'text-green-600'
                                              : isUserAnswer && resultTab === 'wrong'
                                              ? 'text-red-600'
                                              : 'text-muted-foreground'
                                          }`}>
                                            {optionLetter}.
                                          </span>
                                          <span className="text-foreground">{option}</span>
                                          {isCorrectAnswer && <span className="ml-auto text-green-600 font-semibold">✓ 正确</span>}
                                          {isUserAnswer && resultTab === 'wrong' && <span className="ml-auto text-red-600 font-semibold">✗ 你选</span>}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* 答案总结 */}
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                                <p className="text-xs text-muted-foreground mb-1">您的答案</p>
                                <p className="text-sm font-semibold text-foreground">{currentQuestion.userAnswer}</p>
                              </div>
                              <div className={`p-3 rounded-lg border ${
                                resultTab === 'correct'
                                  ? 'bg-green-500/10 border-green-500/20'
                                  : 'bg-green-500/10 border-green-500/20'
                              }`}>
                                <p className="text-xs text-green-600 mb-1">正确答案</p>
                                <p className="text-sm font-semibold text-green-600">{currentQuestion.answer}</p>
                              </div>
                            </div>

                            {/* 解析（仅答错时显示） */}
                            {resultTab === 'wrong' && currentQuestion.analysis && (
                              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                <p className="text-sm font-semibold text-blue-600 mb-2">📖 解析</p>
                                <p className="text-sm text-muted-foreground">{currentQuestion.analysis}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })()}
                  </div>
                </div>

                {/* 返回按钮 */}
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => navigate('/exam')}
                    className="bg-primary hover:bg-primary-dark text-white"
                  >
                    返回考试中心
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* 主体内容区 - 左右分栏 */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* 左侧答题卡 */}
              <div className="lg:col-span-1">
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-foreground text-center">答题卡</CardTitle>
                    <p className="text-sm text-muted-foreground text-center">已答题 {Object.keys(selectedAnswers).length}/{totalQuestions}</p>
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
                              : selectedAnswers[i] !== undefined && selectedAnswers[i].length > 0
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
                {isLoading ? (
                  <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                      <p className="text-foreground">加载题目中...</p>
                    </CardContent>
                  </Card>
                ) : currentQuestionData ? (
                  <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="bg-primary w-12 h-12 rounded-full flex items-center justify-center">
                          <Target className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-foreground text-xl">题目 {currentQuestion + 1}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {currentQuestionData.type === 'judge' ? '判断题' :
                             currentQuestionData.type === 'single' ? '单选题' :
                             currentQuestionData.type === 'multiple' ? '多选题' : '选择题'}
                          </p>
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
                          {currentQuestionData.type === 'judge' ? (
                            // 判断题：只有两个选项（单选）
                            ['正确', '错误'].map((option, index) => {
                              const isSelected = (selectedAnswers[currentQuestion] || []).includes(index);
                              return (
                                <div
                                  key={index}
                                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                    isSelected
                                      ? 'bg-primary/20 border-primary shadow-md'
                                      : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
                                  }`}
                                  onClick={() => handleAnswerSelect(index)}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                      isSelected
                                        ? 'border-primary bg-primary'
                                        : 'border-white/30'
                                    }`}>
                                      {isSelected && (
                                        <div className="w-3 h-3 bg-white rounded-full"></div>
                                      )}
                                    </div>
                                    <span className="text-foreground font-medium">{index === 0 ? 'A. ' : 'B. '}{option}</span>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            // 单选题或多选题
                            (currentQuestionData.options ?
                              (typeof currentQuestionData.options === 'string'
                                ? JSON.parse(currentQuestionData.options)
                                : currentQuestionData.options
                              )
                              : []
                            ).map((option: string, index: number) => {
                              const isSelected = (selectedAnswers[currentQuestion] || []).includes(index);
                              const isMultiple = currentQuestionData.type === 'multiple';
                              return (
                                <div
                                  key={index}
                                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                    isSelected
                                      ? 'bg-primary/20 border-primary shadow-md'
                                      : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
                                  }`}
                                  onClick={() => handleAnswerSelect(index)}
                                >
                                  <div className="flex items-center gap-3">
                                    {isMultiple ? (
                                      // 多选题：使用复选框
                                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                                        isSelected
                                          ? 'border-primary bg-primary'
                                          : 'border-white/30'
                                      }`}>
                                        {isSelected && (
                                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                          </svg>
                                        )}
                                      </div>
                                    ) : (
                                      // 单选题：使用单选框
                                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                        isSelected
                                          ? 'border-primary bg-primary'
                                          : 'border-white/30'
                                      }`}>
                                        {isSelected && (
                                          <div className="w-3 h-3 bg-white rounded-full"></div>
                                        )}
                                      </div>
                                    )}
                                    <span className="text-foreground">{option}</span>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                      <p className="text-foreground">未找到题目数据</p>
                    </CardContent>
                  </Card>
                )}

                {/* 导航按钮 */}
                <div className="flex justify-between items-center mt-6 gap-4">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className="border-border text-foreground hover:bg-muted/50 disabled:opacity-50"
                  >
                    上一题
                  </Button>

                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700 text-white gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        提交中...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        提交答卷
                      </>
                    )}
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
              </>
            )}
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

