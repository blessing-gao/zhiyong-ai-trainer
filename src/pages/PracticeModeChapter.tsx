import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  Target,
  BookOpen,
  Loader2
} from "lucide-react";
import Header from "@/components/Header";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { examAnswerApi } from "@/services/api";

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

interface QuestionResult {
  questionId: number | string;
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
  analysis: string | null;
}

const PracticeModeChapter = () => {
  const { applyRoleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { chapterName } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [secondLevelTagId, setSecondLevelTagId] = useState<number | null>(null);
  const [questionResults, setQuestionResults] = useState<{ [key: number]: QuestionResult }>({});
  const [checkingAnswer, setCheckingAnswer] = useState(false);

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

  // 解析题目选项
  const parseOptions = (question: Question): string[] => {
    if (question.type === 'judge') {
      return ['正确', '错误'];
    }

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

    return [];
  };

  const totalQuestions = questions.length;
  const currentQuestionData = questions[currentQuestion];
  const currentResult = questionResults[currentQuestion];

  const handleAnswerSelect = async (answerIndex: number) => {
    // 如果已经有结果，不允许再改答案
    if (currentResult) {
      return;
    }

    const answerLetter = String.fromCharCode(65 + answerIndex); // A, B, C, D...
    const currentAnswers = selectedAnswers[currentQuestion] || '';
    let newAnswers = currentAnswers;

    if (currentQuestionData.type === 'multiple') {
      // 多选题：支持多选
      if (currentAnswers.includes(answerLetter)) {
        // 如果已选，则取消选择
        newAnswers = currentAnswers.replace(answerLetter, '');
      } else {
        // 如果未选，则添加选择
        newAnswers = (currentAnswers + answerLetter).split('').sort().join('');
      }
      setSelectedAnswers({
        ...selectedAnswers,
        [currentQuestion]: newAnswers
      });
    } else {
      // 单选题和判断题：只能单选
      newAnswers = answerLetter;
      setSelectedAnswers({
        ...selectedAnswers,
        [currentQuestion]: newAnswers
      });

      // 立即调用后端判题
      await checkAnswer(newAnswers);
    }
  };

  const checkAnswer = async (userAnswer: string) => {
    try {
      setCheckingAnswer(true);
      const response: any = await examAnswerApi.checkSingleAnswer({
        questionId: Number(currentQuestionData.id),
        userAnswer: userAnswer,
        questionType: currentQuestionData.type
      });

      if (response.code === 0 && response.data) {
        const result: QuestionResult = {
          questionId: response.data.question_id,
          isCorrect: response.data.is_correct,
          userAnswer: response.data.user_answer,
          correctAnswer: response.data.correct_answer,
          analysis: response.data.analysis
        };

        setQuestionResults({
          ...questionResults,
          [currentQuestion]: result
        });
      }
    } catch (error) {
      console.error("Failed to check answer:", error);
    } finally {
      setCheckingAnswer(false);
    }
  };

  const handleSubmitMultipleChoice = async () => {
    const userAnswer = selectedAnswers[currentQuestion];
    if (userAnswer) {
      await checkAnswer(userAnswer);
    }
  };

  const handleNext = async () => {
    // 如果是多选题且还没有提交，先提交
    if (currentQuestionData.type === 'multiple' && !currentResult && selectedAnswers[currentQuestion]) {
      await handleSubmitMultipleChoice();
      return;
    }

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
                <h1 className="text-2xl font-bold text-foreground">刷题模式</h1>
                <p className="text-muted-foreground">第 {currentQuestion + 1}/{totalQuestions} 题</p>
              </div>
              
              <div className="text-sm text-muted-foreground">
                已完成: {Object.keys(questionResults).length}/{totalQuestions}
              </div>
            </div>

            {/* 主体内容区 - 左右分栏 */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* 左侧题目导航 */}
              <div className="lg:col-span-1">
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-foreground text-center">题目导航</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-5 gap-2 max-h-[500px] overflow-y-auto">
                      {Array.from({ length: totalQuestions }, (_, i) => {
                        const result = questionResults[i];
                        return (
                          <button
                            key={i}
                            onClick={() => handleQuestionClick(i)}
                            className={`
                              h-10 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center
                              ${currentQuestion === i 
                                ? 'bg-primary text-white ring-2 ring-primary ring-offset-2 ring-offset-white/10' 
                                : result
                                ? result.isCorrect
                                  ? 'bg-green-500/30 text-green-300 hover:bg-green-500/40'
                                  : 'bg-red-500/30 text-red-300 hover:bg-red-500/40'
                                : 'bg-white/5 text-foreground hover:bg-white/10'
                              }
                            `}
                          >
                            {result ? (
                              result.isCorrect ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : (
                                <XCircle className="h-4 w-4" />
                              )
                            ) : (
                              i + 1
                            )}
                          </button>
                        );
                      })}
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
                            {currentQuestionData.type === 'judge' ? '判断题' : currentQuestionData.type === 'single' ? '单选题' : '多选题'}
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
                          const answerLetter = String.fromCharCode(65 + index);
                          const currentAnswers = selectedAnswers[currentQuestion] || '';
                          const isSelected = currentAnswers.includes(answerLetter);

                          // 检查每个选项是否在正确答案中
                          let isCorrectAnswer = false;
                          if (currentResult?.correctAnswer) {
                            isCorrectAnswer = currentResult.correctAnswer.includes(answerLetter);
                          }

                          // 判断选项的状态
                          // 1. 未判题时选中的选项 - 蓝色
                          const isSelectedBeforeCheck = isSelected && !currentResult;

                          // 2. 判题后答对的选项 - 绿色（用户选了且答对，或者是正确答案）
                          const isCorrectAfterCheck = currentResult && isCorrectAnswer;

                          // 3. 判题后答错的选项 - 红色（用户选了但不是正确答案）
                          const isWrongAfterCheck = currentResult && isSelected && !isCorrectAnswer;

                          return (
                            <div
                              key={index}
                              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                isSelectedBeforeCheck
                                  ? 'bg-blue-500/20 border-blue-500 shadow-md'
                                  : isCorrectAfterCheck
                                  ? 'bg-green-500/20 border-green-500 shadow-md'
                                  : isWrongAfterCheck
                                  ? 'bg-red-500/20 border-red-500 shadow-md'
                                  : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
                              } ${currentResult ? 'cursor-not-allowed' : ''}`}
                              onClick={() => !currentResult && handleAnswerSelect(index)}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-${currentQuestionData.type === 'multiple' ? 'md' : 'full'} border-2 flex items-center justify-center transition-all ${
                                  isSelectedBeforeCheck
                                    ? 'border-blue-500 bg-blue-500'
                                    : isCorrectAfterCheck
                                    ? 'border-green-500 bg-green-500'
                                    : isWrongAfterCheck
                                    ? 'border-red-500 bg-red-500'
                                    : 'border-white/30'
                                }`}>
                                  {(isSelectedBeforeCheck || isCorrectAfterCheck || isWrongAfterCheck) && (
                                    <div className={`${currentQuestionData.type === 'multiple' ? 'w-2 h-2' : 'w-3 h-3'} bg-white ${currentQuestionData.type === 'multiple' ? 'rounded' : 'rounded-full'}`}></div>
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

                      {/* 判题结果 */}
                      {currentResult && (
                        <div className={`p-4 rounded-lg ${
                          currentResult.isCorrect
                            ? 'bg-green-500/20 border border-green-500'
                            : 'bg-red-500/20 border border-red-500'
                        }`}>
                          <div className="flex items-center gap-2 mb-2">
                            {currentResult.isCorrect ? (
                              <>
                                <CheckCircle className="h-5 w-5 text-green-400" />
                                <span className="font-semibold text-green-300">答对了！</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-5 w-5 text-red-400" />
                                <span className="font-semibold text-red-300">答错了</span>
                              </>
                            )}
                          </div>
                          {!currentResult.isCorrect && (
                            <>
                              <p className="text-sm text-foreground/80 mb-2">
                                <span className="font-semibold">正确答案：</span> {currentResult.correctAnswer}
                              </p>
                              {currentResult.analysis && (
                                <p className="text-sm text-foreground/80">
                                  <span className="font-semibold">解析：</span> {currentResult.analysis}
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      )}

                      {checkingAnswer && (
                        <div className="flex items-center justify-center gap-2 text-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>判题中...</span>
                        </div>
                      )}
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

                  {currentQuestionData.type === 'multiple' && !currentResult && selectedAnswers[currentQuestion] && (
                    <Button
                      onClick={handleSubmitMultipleChoice}
                      disabled={checkingAnswer}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {checkingAnswer ? '判题中...' : '提交答案'}
                    </Button>
                  )}

                  <Button
                    onClick={handleNext}
                    disabled={currentQuestion === totalQuestions - 1 || (currentQuestionData.type === 'multiple' && !currentResult)}
                    className="bg-primary hover:bg-primary-dark text-white disabled:opacity-50"
                  >
                    下一题
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeModeChapter;

