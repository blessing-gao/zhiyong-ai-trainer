import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, Target } from "lucide-react";

const FormalExam = () => {
  const { applyRoleTheme } = useTheme();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]); // 用于多选题
  const [answers, setAnswers] = useState<{ [key: number]: number | number[] | null }>({});
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

  // 生成100道题目（支持多种题型）
  const generateQuestions = () => {
    const baseQuestions = [
      {
        type: "single",
        question: "关于机器学习基础理论的问题1：以下哪个选项是正确的？",
        options: [
          "5√2",
          "12√3",
          "1",
          "以上都不对"
        ],
        correct: 0
      },
      {
        type: "single",
        question: "什么是机器学习？",
        options: [
          "让计算机通过数据学习的技术",
          "让计算机变得更快的技术",
          "让计算机存储更多数据的技术",
          "让计算机变得更便宜的技术"
        ],
        correct: 0
      },
      {
        type: "multiple",
        question: "深度学习中常用的激活函数有哪些？（多选）",
        options: [
          "ReLU",
          "Sigmoid",
          "Tanh",
          "Softmax",
          "Linear"
        ],
        correct: [0, 1, 2, 3]
      },
      {
        type: "judge",
        question: "神经网络中的反向传播算法用于计算梯度。",
        options: ["正确", "错误"],
        correct: 0
      },
      {
        type: "single",
        question: "卷积神经网络（CNN）主要用于处理什么类型的数据？",
        options: [
          "A. 图像数据",
          "B. 文本数据",
          "C. 时间序列数据",
          "D. 表格数据"
        ],
        correct: 0
      },
      {
        type: "judge",
        question: "过拟合是指模型在训练集上表现很好，但在测试集上表现很差。",
        options: ["正确", "错误"],
        correct: 0
      },
      {
        type: "multiple",
        question: "以下哪些是常见的机器学习算法？（多选）",
        options: [
          "A. 决策树",
          "B. 随机森林",
          "C. 支持向量机",
          "D. K-均值聚类",
          "E. 线性回归"
        ],
        correct: [0, 1, 2, 3, 4]
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
  
  // 计算已答题数量和进度 - 修复计算逻辑
  const answeredCount = React.useMemo(() => {
    return Object.values(answers).filter(answer => answer !== null && answer !== undefined).length;
  }, [answers]);
  
  const progress = React.useMemo(() => {
    return (answeredCount / totalQuestions) * 100;
  }, [answeredCount, totalQuestions]);

  const handleAnswerSelect = (answerIndex: number) => {
    const isMultiple = currentQuestionData.type === "multiple";

    if (isMultiple) {
      // 多选题：切换选择
      const newAnswers = selectedAnswers.includes(answerIndex)
        ? selectedAnswers.filter(a => a !== answerIndex)
        : [...selectedAnswers, answerIndex];
      setSelectedAnswers(newAnswers);
      setAnswers({
        ...answers,
        [currentQuestion]: newAnswers
      });
    } else {
      // 单选题和判断题
      setSelectedAnswer(answerIndex.toString());
      setAnswers({
        ...answers,
        [currentQuestion]: answerIndex
      });
      
      // 自动进入下一题（延迟500ms以便用户看到选择效果）
      if (currentQuestion < totalQuestions - 1) {
        setTimeout(() => {
          handleNext();
        }, 500);
      }
    }
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
      const nextAnswer = answers[currentQuestion + 1];
      if (Array.isArray(nextAnswer)) {
        setSelectedAnswers(nextAnswer);
        setSelectedAnswer(null);
      } else {
        setSelectedAnswer(nextAnswer?.toString() || null);
        setSelectedAnswers([]);
      }
      
      // 自动滚动到当前题号
      setTimeout(() => {
        scrollToCurrentQuestion();
      }, 100);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      const prevAnswer = answers[currentQuestion - 1];
      if (Array.isArray(prevAnswer)) {
        setSelectedAnswers(prevAnswer);
        setSelectedAnswer(null);
      } else {
        setSelectedAnswer(prevAnswer?.toString() || null);
        setSelectedAnswers([]);
      }
      
      // 自动滚动到当前题号
      setTimeout(() => {
        scrollToCurrentQuestion();
      }, 100);
    }
  };

  const handleQuestionClick = (index: number) => {
    setCurrentQuestion(index);
    const answer = answers[index];
    if (Array.isArray(answer)) {
      setSelectedAnswers(answer);
      setSelectedAnswer(null);
    } else {
      setSelectedAnswer(answer?.toString() || null);
      setSelectedAnswers([]);
    }
  };

  // 滚动到当前题号
  const scrollToCurrentQuestion = () => {
    const questionContainer = document.querySelector('.question-scroll-container');
    if (questionContainer) {
      const questionButtons = questionContainer.querySelectorAll('button');
      const currentButton = questionButtons[currentQuestion];
      if (currentButton) {
        currentButton.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  };

  const handleSubmit = () => {
    // 提交考试逻辑
    alert('考试提交成功！');
    navigate('/exam');
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#E6F7FF] relative overflow-hidden p-4">
      {/* 验证代码是否生效 */}
      <div style={{ display: 'none' }}>VERSION: 2024-NEW</div>
      {/* 三个渐变圆形背景 */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-20 -left-60 w-[768px] h-[768px] rounded-full animate-float" style={{
          background: 'radial-gradient(circle, #A2EBFF 0%, transparent 70%)'
        }}></div>
        <div className="absolute bottom-30 -right-50 w-[840px] h-[840px] rounded-full animate-float-slow" style={{
          background: 'radial-gradient(circle, #79E3DA 0%, transparent 70%)'
        }}></div>
        <div className="absolute -top-40 left-1/4 -translate-x-1/2 w-[600px] h-[600px] rounded-full animate-float" style={{
          background: 'radial-gradient(circle, #97CAFF 0%, transparent 60%)',
          animationDelay: '1s'
        }}></div>
      </div>
      
      {/* 顶部区域 */}
      <div className="max-w-7xl mx-auto relative z-10">
        {/* 返回按钮和倒计时 */}
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="outline"
            onClick={() => navigate('/exam')}
            className="bg-white border transition-all font-medium px-6 rounded-2xl shadow-md text-base flex items-center h-[52px]"
            style={{
              borderColor: '#67B3FF',
              color: '#67B3FF'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#67B3FF';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.color = '#67B3FF';
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回考试中心
          </Button>
          
          <div 
            className="px-8 rounded-2xl shadow-md bg-white border transition-all flex items-center justify-center h-[52px]"
            style={{
              borderColor: '#67B3FF',
              color: '#67B3FF'
            }}
          >
            <span className="text-2xl font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* 进度条区域 */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-3 shadow-lg mb-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(to right, #A2EBFF, #79E3DA, #97CAFF, #67B3FF)'
                }}
              />
            </div>
            <span 
              className="whitespace-nowrap" 
              style={{ 
                fontFamily: 'Arial, sans-serif',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#374151'
              }}
            >
              已答:{answeredCount} 总数:{totalQuestions} ({Math.round(progress)}%)
            </span>
          </div>
        </div>

        {/* 题号按钮区域 */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 shadow-lg mb-4 overflow-hidden">
          <style dangerouslySetInnerHTML={{ __html: `
            .question-scroll-container {
              overflow-x: auto;
              padding-bottom: 8px;
              margin-bottom: -8px;
            }
            .question-scroll-container::-webkit-scrollbar {
              height: 8px;
            }
            .question-scroll-container::-webkit-scrollbar-track {
              background: #e5e7eb;
              border-radius: 4px;
            }
            .question-scroll-container::-webkit-scrollbar-thumb {
              background: #67B3FF;
              border-radius: 4px;
            }
            .question-scroll-container::-webkit-scrollbar-thumb:hover {
              background: #4A90E2;
            }
          `}} />
          <div className="question-scroll-container flex gap-3" style={{ scrollbarWidth: 'thin', scrollbarColor: '#67B3FF #e5e7eb' }}>
            {Array.from({ length: totalQuestions }, (_, i) => {
              return (
                <button
                  key={i}
                  onClick={() => handleQuestionClick(i)}
                  className={`
                    w-8 h-8 flex-shrink-0 rounded-full font-semibold text-sm transition-all duration-200
                    ${currentQuestion === i 
                      ? 'bg-[#67B3FF] text-white shadow-lg scale-110' 
                      : answers[i] !== undefined 
                      ? 'bg-[#A2EBFF] text-gray-700' 
                      : 'bg-gray-100 text-gray-500'
                    }
                  `}
                  style={{ fontFamily: 'Arial, sans-serif' }}
                >
                  {(i + 1).toString()}
                </button>
              );
            })}
          </div>
        </div>

        {/* 主体内容 - 左右分栏 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧：题目区域 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span 
                    className="text-white px-4 py-1 rounded-full font-medium"
                    style={{ 
                      fontFamily: 'Arial, sans-serif',
                      backgroundColor: currentQuestionData.type === "multiple" ? '#79E3DA' : '#67B3FF'
                    }}
                  >
                    第 {String(currentQuestion + 1)} 题
                  </span>
                </div>
                
                {/* 上一题和下一题按钮 */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: currentQuestion === 0 ? '#e5e7eb' : (currentQuestionData.type === "multiple" ? '#79E3DA' : '#67B3FF'),
                      color: currentQuestion === 0 ? '#9ca3af' : 'white'
                    }}
                    onMouseEnter={(e) => {
                      if (currentQuestion !== 0) {
                        e.currentTarget.style.backgroundColor = currentQuestionData.type === "multiple" ? '#6BCFC7' : '#4A90E2';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentQuestion !== 0) {
                        e.currentTarget.style.backgroundColor = currentQuestionData.type === "multiple" ? '#79E3DA' : '#67B3FF';
                      }
                    }}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={handleNext}
                    disabled={currentQuestion === totalQuestions - 1}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: currentQuestion === totalQuestions - 1 ? '#e5e7eb' : (currentQuestionData.type === "multiple" ? '#79E3DA' : '#67B3FF'),
                      color: currentQuestion === totalQuestions - 1 ? '#9ca3af' : 'white'
                    }}
                    onMouseEnter={(e) => {
                      if (currentQuestion !== totalQuestions - 1) {
                        e.currentTarget.style.backgroundColor = currentQuestionData.type === "multiple" ? '#6BCFC7' : '#4A90E2';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentQuestion !== totalQuestions - 1) {
                        e.currentTarget.style.backgroundColor = currentQuestionData.type === "multiple" ? '#79E3DA' : '#67B3FF';
                      }
                    }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-gray-800 text-base leading-relaxed">
                {currentQuestionData.question}
              </p>
            </div>
            
            {/* 如果有图片可以在这里显示 */}
            <div className="bg-gray-50 rounded-xl p-6 flex items-center justify-center min-h-[150px]">
              <span className="text-gray-400 text-sm">题目图片区域</span>
            </div>
          </div>

          {/* 右侧：选项区域 */}
          <div className="space-y-3">
            {currentQuestionData.options.map((option, index) => {
              // 去掉选项文本中的前缀 (如 "A. "、"B. " 等)
              const cleanOption = option.replace(/^[A-E]\.\s*/, '');
              
              const isMultiple = currentQuestionData.type === "multiple";
              const isSelected = isMultiple 
                ? selectedAnswers.includes(index)
                : selectedAnswer === index.toString();
              
              // 根据题型选择悬停颜色
              const hoverColor = isMultiple ? '#79E3DA' : '#67B3FF';
              const selectedColor = isMultiple ? '#79E3DA' : '#67B3FF';
              
              return (
                <div
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className="rounded-2xl p-4 shadow-lg cursor-pointer transition-all duration-200"
                  style={{
                    backgroundColor: isSelected ? selectedColor : 'white',
                    color: isSelected ? 'white' : '#374151'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = hoverColor;
                      e.currentTarget.style.color = 'white';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.color = '#374151';
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all flex-shrink-0"
                      style={{ 
                        backgroundColor: isSelected ? 'white' : selectedColor,
                        color: isSelected ? selectedColor : 'white',
                        borderColor: selectedColor,
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '18px',
                        fontWeight: 'bold'
                      }}
                    >
                      {['A', 'B', 'C', 'D', 'E'][index]}
                    </div>
                    <span className="text-base font-medium">
                      {cleanOption}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 提交按钮 - 只在所有题答完后显示 */}
        {answeredCount === totalQuestions && (
          <div className="flex justify-center items-center mt-8">
            <Button
              variant="outline"
              onClick={handleSubmit}
              className="bg-white border transition-all font-bold px-12 py-6 text-lg rounded-xl shadow-lg"
              style={{
                borderColor: '#67B3FF',
                color: '#67B3FF'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#67B3FF';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = '#67B3FF';
              }}
            >
              提交考试
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormalExam;

