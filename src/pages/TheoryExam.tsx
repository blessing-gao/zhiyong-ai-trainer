import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Clock, FileText, CheckCircle, AlertTriangle, Save } from "lucide-react";

interface Question {
  id: number;
  type: 'single' | 'multiple' | 'judge';
  question: string;
  options?: string[];
  answer?: string | string[];
}

export const TheoryExam = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [timeLeft, setTimeLeft] = useState(7200); // 120分钟 = 7200秒
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 模拟试题数据
  const questions: Question[] = [
    {
      id: 1,
      type: 'single',
      question: '人工智能的英文缩写是什么？',
      options: ['AI', 'AL', 'IA', 'IL']
    },
    {
      id: 2,
      type: 'single',
      question: '下列哪个不是机器学习的主要类型？',
      options: ['监督学习', '无监督学习', '强化学习', '逻辑学习']
    },
    {
      id: 3,
      type: 'judge',
      question: '深度学习是机器学习的一个分支。',
      options: ['正确', '错误']
    },
    {
      id: 4,
      type: 'single',
      question: '神经网络中的激活函数的主要作用是什么？',
      options: ['引入非线性', '减少计算量', '防止过拟合', '增加网络深度']
    },
    {
      id: 5,
      type: 'multiple',
      question: '以下哪些是常见的深度学习框架？（多选）',
      options: ['TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn']
    }
  ];

  // 计时器
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft, isSubmitted]);

  // 格式化时间显示
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 处理答案选择
  const handleAnswerChange = (questionId: number, answer: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question?.type === 'multiple') {
      const currentAnswers = answers[questionId] as string[] || [];
      if (currentAnswers.includes(answer)) {
        setAnswers({
          ...answers,
          [questionId]: currentAnswers.filter(a => a !== answer)
        });
      } else {
        setAnswers({
          ...answers,
          [questionId]: [...currentAnswers, answer]
        });
      }
    } else {
      setAnswers({
        ...answers,
        [questionId]: answer
      });
    }
  };

  // 保存答案
  const handleSave = () => {
    toast({
      title: "答案已保存",
      description: "您的答案已自动保存"
    });
  };

  // 提交考试
  const handleSubmit = () => {
    setIsSubmitted(true);
    toast({
      title: "考试已提交",
      description: "感谢您的参与，考试结果将在审核后公布"
    });
    
    // 模拟提交延迟后跳转
    setTimeout(() => {
      navigate('/exam');
    }, 3000);
  };

  // 获取已答题数量
  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  // 获取进度百分比
  const getProgress = () => {
    return (getAnsweredCount() / questions.length) * 100;
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-elegant">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-16 h-16 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-green-700">考试已提交</CardTitle>
            <CardDescription>您的理论考试已成功提交</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              考试结果将在审核后通过邮件或短信通知您
            </p>
            <p className="text-sm text-muted-foreground">
              正在返回考试主页...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* 顶部状态栏 */}
      <div className="bg-white border-b border-border shadow-soft sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <span className="font-semibold">理论考试</span>
              </div>
              <Badge variant="outline">
                题目 {currentQuestion + 1} / {questions.length}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">已答：</span>
                <Badge className="bg-green-100 text-green-700">
                  {getAnsweredCount()} / {questions.length}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className={`font-mono font-semibold ${timeLeft < 600 ? 'text-red-600' : 'text-orange-600'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-1" />
                保存
              </Button>
            </div>
          </div>
          
          {/* 进度条 */}
          <div className="mt-3">
            <Progress value={getProgress()} className="h-2" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-elegant">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  第 {currentQuestion + 1} 题
                  <Badge className="ml-2" variant="outline">
                    {currentQ.type === 'single' ? '单选题' : 
                     currentQ.type === 'multiple' ? '多选题' : '判断题'}
                  </Badge>
                </CardTitle>
                {timeLeft < 600 && (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">时间不足10分钟</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 题目 */}
              <div className="text-lg leading-relaxed p-4 bg-blue-50 rounded-lg">
                {currentQ.question}
              </div>

              {/* 选项 */}
              <div className="space-y-3">
                {currentQ.type === 'multiple' ? (
                  <div className="space-y-3">
                    {currentQ.options?.map((option, index) => {
                      const optionLabel = String.fromCharCode(65 + index);
                      const isSelected = (answers[currentQ.id] as string[] || []).includes(option);
                      return (
                        <div
                          key={index}
                          className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-primary bg-primary/5' 
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => handleAnswerChange(currentQ.id, option)}
                        >
                          <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                            isSelected ? 'border-primary bg-primary' : 'border-border'
                          }`}>
                            {isSelected && <CheckCircle className="h-3 w-3 text-white" />}
                          </div>
                          <Label className="flex-1 cursor-pointer">
                            <span className="font-medium mr-2">{optionLabel}.</span>
                            {option}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <RadioGroup
                    value={answers[currentQ.id] as string || ''}
                    onValueChange={(value) => handleAnswerChange(currentQ.id, value)}
                  >
                    {currentQ.options?.map((option, index) => {
                      const optionLabel = String.fromCharCode(65 + index);
                      return (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-3 rounded-lg border-2 hover:border-primary/50 transition-all"
                        >
                          <RadioGroupItem value={option} id={`option-${index}`} />
                          <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                            <span className="font-medium mr-2">{optionLabel}.</span>
                            {option}
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                )}
              </div>

              <Separator />

              {/* 导航按钮 */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                >
                  上一题
                </Button>

                <div className="flex items-center gap-2">
                  {currentQuestion === questions.length - 1 ? (
                    <Button onClick={handleSubmit} className="gradient-primary text-white">
                      提交考试
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
                    >
                      下一题
                    </Button>
                  )}
                </div>
              </div>

              {/* 题目导航 */}
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-3">快速导航：</p>
                <div className="flex flex-wrap gap-2">
                  {questions.map((_, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant={currentQuestion === index ? 'default' : 'outline'}
                      className={`w-10 h-10 ${
                        answers[questions[index].id] 
                          ? currentQuestion === index 
                            ? 'bg-primary text-white' 
                            : 'bg-green-100 text-green-700 border-green-300'
                          : ''
                      }`}
                      onClick={() => setCurrentQuestion(index)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};