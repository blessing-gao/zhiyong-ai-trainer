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
          "A. ReLU",
          "B. Sigmoid",
          "C. Tanh",
          "D. Softmax",
          "E. Linear"
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
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

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
    <div className="min-h-screen bg-gradient-to-br from-white to-[#E6F7FF] p-4">
      {/* 顶部区域 */}
      <div className="max-w-7xl mx-auto">
        {/* 返回按钮和倒计时 */}
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="outline"
            onClick={() => navigate('/exam')}
            className="bg-white border transition-all font-medium px-6 py-3 rounded-2xl shadow-md text-base flex items-center"
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
            className="px-8 py-3 rounded-2xl shadow-md bg-white border transition-all"
            style={{
              borderColor: '#67B3FF',
              color: '#67B3FF'
            }}
          >
            <span className="text-2xl font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* 进度条区域 */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-700 font-medium text-lg">进展</span>
            <span className="text-gray-700 font-medium text-lg">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(to right, #A2EBFF, #79E3DA, #97CAFF, #67B3FF)'
              }}
            />
          </div>
        </div>

        {/* 题号按钮区域 */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6 overflow-hidden">
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
            {Array.from({ length: totalQuestions }, (_, i) => (
              <button
                key={i}
                onClick={() => handleQuestionClick(i)}
                className={`
                  w-8 h-8 flex-shrink-0 rounded-full font-semibold text-sm transition-all duration-200 font-sans
                  ${currentQuestion === i 
                    ? 'bg-[#67B3FF] text-white shadow-lg scale-110' 
                    : answers[i] !== undefined 
                    ? 'bg-[#A2EBFF] text-gray-700' 
                    : 'bg-gray-100 text-gray-500'
                  }
                `}
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', fontVariantNumeric: 'lining-nums' }}
              >
                {String(i + 1)}
              </button>
            ))}
          </div>
        </div>

        {/* 主体内容 - 左右分栏 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧：题目区域 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-[#79E3DA] text-white px-4 py-1 rounded-full font-medium">
                  第 {currentQuestion + 1} 题
                </span>
              </div>
              <p className="text-gray-800 text-lg leading-relaxed">
                {currentQuestionData.question}
              </p>
            </div>
            
            {/* 如果有图片可以在这里显示 */}
            <div className="bg-gray-50 rounded-xl p-8 flex items-center justify-center min-h-[200px]">
              <span className="text-gray-400">题目图片区域</span>
            </div>
          </div>

          {/* 右侧：选项区域 */}
          <div className="space-y-4">
            {currentQuestionData.options.map((option, index) => {
              const labels = ['A', 'B', 'C', 'D'];
              const isSelected = selectedAnswer === index.toString();
              
              return (
                <div
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className="rounded-2xl p-6 shadow-lg cursor-pointer transition-all duration-200"
                  style={{
                    backgroundColor: isSelected ? '#67B3FF' : 'white',
                    color: isSelected ? 'white' : '#374151'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = '#67B3FF';
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
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl border-2 transition-all flex-shrink-0 font-sans"
                      style={{ 
                        backgroundColor: isSelected ? 'white' : '#67B3FF',
                        color: isSelected ? '#67B3FF' : 'white',
                        borderColor: '#67B3FF',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
                      }}
                    >
                      {labels[index]}
                    </div>
                    <span className="text-lg font-medium">
                      {option}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* 左侧：上一题和下一题按钮 */}
          <div className="flex justify-between items-center gap-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="bg-white border transition-all font-medium px-8 py-6 text-lg rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderColor: currentQuestion === 0 ? '#cccccc' : '#67B3FF',
                color: currentQuestion === 0 ? '#999999' : '#67B3FF'
              }}
              onMouseEnter={(e) => {
                if (currentQuestion !== 0) {
                  e.currentTarget.style.backgroundColor = '#67B3FF';
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (currentQuestion !== 0) {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = '#67B3FF';
                }
              }}
            >
              上一题
            </Button>

            <Button
              variant="outline"
              onClick={handleNext}
              disabled={currentQuestion === totalQuestions - 1}
              className="bg-white border transition-all font-medium px-8 py-6 text-lg rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderColor: currentQuestion === totalQuestions - 1 ? '#cccccc' : '#67B3FF',
                color: currentQuestion === totalQuestions - 1 ? '#999999' : '#67B3FF'
              }}
              onMouseEnter={(e) => {
                if (currentQuestion !== totalQuestions - 1) {
                  e.currentTarget.style.backgroundColor = '#67B3FF';
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (currentQuestion !== totalQuestions - 1) {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = '#67B3FF';
                }
              }}
            >
              下一题
            </Button>
          </div>

          {/* 右侧：提交按钮 */}
          <div className="flex justify-end items-center">
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
              提交
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormalExam;

