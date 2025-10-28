import React, { useState } from "react";
import { SubtaskTab } from "@/types/course";
import { Button } from "@/components/ui/button";
import { CheckCircle, MessageCircle } from "lucide-react";

interface QuizViewerProps {
  tab: SubtaskTab;
  onProgress?: (progress: number) => void;
}

const QuizViewer: React.FC<QuizViewerProps> = ({ tab, onProgress }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // Mock 测验数据
  const questions = [
    {
      id: 1,
      question: "什么是生成式AI？",
      options: [
        "能够生成新内容的人工智能系统",
        "只能分析数据的AI系统",
        "只能分类的AI系统",
        "以上都不对"
      ],
      correct: 0
    },
    {
      id: 2,
      question: "以下哪个不是生成式AI的应用？",
      options: [
        "文本生成",
        "图像生成",
        "物体检测",
        "音频生成"
      ],
      correct: 2
    }
  ];

  const handleSelectAnswer = (optionIndex: number) => {
    setAnswers({ ...answers, [currentQuestion]: optionIndex });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const correctCount = questions.filter(
      (q, idx) => answers[idx] === q.correct
    ).length;
    const progress = (correctCount / questions.length) * 100;
    onProgress?.(Math.round(progress));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const question = questions[currentQuestion];
  const isAnswered = currentQuestion in answers;
  const isCorrect = answers[currentQuestion] === question.correct;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 工具栏 */}
      <div className="border-b px-4 py-3 flex items-center justify-between bg-gray-50">
        <span className="text-sm font-medium">
          测验 - 第 {currentQuestion + 1} / {questions.length} 题
        </span>
        <Button variant="ghost" size="sm" title="问助教">
          <MessageCircle className="w-4 h-4" />
        </Button>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-2xl">
          <h3 className="text-lg font-semibold mb-6">{question.question}</h3>

          <div className="space-y-3 mb-8">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => !submitted && handleSelectAnswer(idx)}
                disabled={submitted}
                className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                  answers[currentQuestion] === idx
                    ? submitted
                      ? isCorrect
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                      : "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      answers[currentQuestion] === idx
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {answers[currentQuestion] === idx && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span>{option}</span>
                  {submitted && idx === question.correct && (
                    <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {submitted && (
            <div className={`p-4 rounded-lg mb-6 ${isCorrect ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {isCorrect ? "✓ 回答正确！" : "✗ 回答错误，请重新学习相关内容。"}
            </div>
          )}
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="border-t px-8 py-4 flex items-center justify-between bg-gray-50">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentQuestion === 0}
        >
          上一题
        </Button>
        {!submitted ? (
          <Button onClick={handleSubmit} disabled={!isAnswered}>
            提交答案
          </Button>
        ) : (
          <Button onClick={handleNext} disabled={currentQuestion === questions.length - 1}>
            下一题
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizViewer;

