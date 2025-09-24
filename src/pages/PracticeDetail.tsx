import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Clock, CheckCircle, XCircle, BookOpen, Target, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const PracticeDetail = () => {
  const { chapterName } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [practiceComplete, setPracticeComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes

  // Mock questions data
  const questions = [
    {
      id: 1,
      question: "什么是机器学习中的监督学习？",
      options: [
        "使用标记数据训练模型的学习方法",
        "不使用任何标记数据的学习方法", 
        "通过奖励和惩罚学习的方法",
        "只用于分类问题的学习方法"
      ],
      correct: 0,
      explanation: "监督学习是一种机器学习方法，它使用标记的训练数据来训练模型，使模型能够对新的未标记数据进行预测。"
    },
    {
      id: 2,
      question: "深度学习中的反向传播算法主要用于什么？",
      options: [
        "数据预处理",
        "计算梯度并更新网络权重",
        "生成新的训练数据",
        "评估模型性能"
      ],
      correct: 1,
      explanation: "反向传播算法是深度学习中用于计算损失函数相对于网络权重的梯度，并据此更新权重的核心算法。"
    },
    {
      id: 3,
      question: "什么是生成式AI的主要特征？",
      options: [
        "只能进行分类任务",
        "能够生成新的内容或数据",
        "只能处理文本数据",
        "运行速度非常快"
      ],
      correct: 1,
      explanation: "生成式AI的主要特征是能够创造或生成新的内容，如文本、图像、音频等，而不仅仅是对现有数据进行分类或分析。"
    }
  ];

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handlePracticeSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (!selectedAnswer) {
      toast({
        title: "请选择答案",
        description: "请先选择一个答案再继续",
        variant: "destructive"
      });
      return;
    }

    setShowExplanation(true);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(answers[currentQuestion + 1] || "");
        setShowExplanation(false);
      } else {
        handlePracticeSubmit();
      }
    }, 3000);
  };

  const handlePracticeSubmit = () => {
    setPracticeComplete(true);
    toast({
      title: "练习完成",
      description: "恭喜您完成本章节练习！"
    });
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (parseInt(answer) === questions[index]?.correct) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  if (practiceComplete) {
    const score = calculateScore();
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="shadow-strong">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-3xl">练习完成！</CardTitle>
              <CardDescription>您已完成《{chapterName}》章节练习</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-6xl font-bold text-primary mb-2">{score}分</div>
                <div className="text-lg text-muted-foreground">
                  正确率: {answers.filter((answer, index) => parseInt(answer) === questions[index]?.correct).length} / {questions.length}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {answers.filter((answer, index) => parseInt(answer) === questions[index]?.correct).length}
                  </div>
                  <div className="text-sm text-green-700">答对题数</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {answers.filter((answer, index) => parseInt(answer) !== questions[index]?.correct).length}
                  </div>
                  <div className="text-sm text-red-700">答错题数</div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate("/training")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  返回训练中心
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  <Target className="h-4 w-4 mr-2" />
                  重新练习
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate("/training")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回训练中心
          </Button>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-3 py-1">
              <Clock className="h-3 w-3 mr-1" />
              {formatTime(timeLeft)}
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              <BookOpen className="h-3 w-3 mr-1" />
              {currentQuestion + 1} / {questions.length}
            </Badge>
          </div>
        </div>

        {/* Progress */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">练习进度</span>
              <span className="text-sm text-muted-foreground">
                {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
              </span>
            </div>
            <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2" />
          </CardContent>
        </Card>

        {/* Question */}
        <Card className="shadow-medium">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="gradient-primary w-12 h-12 rounded-lg flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>第 {currentQuestion + 1} 题</CardTitle>
                <CardDescription>{chapterName} - 章节练习</CardDescription>
              </div>
            </div>
            
            <div className="text-lg font-medium leading-relaxed">
              {questions[currentQuestion]?.question}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
              {questions[currentQuestion]?.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {showExplanation && (
              <div className={`p-4 rounded-lg border ${
                parseInt(selectedAnswer) === questions[currentQuestion]?.correct 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {parseInt(selectedAnswer) === questions[currentQuestion]?.correct ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className="font-medium">
                    {parseInt(selectedAnswer) === questions[currentQuestion]?.correct ? '回答正确!' : '回答错误!'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {questions[currentQuestion]?.explanation}
                </p>
                {parseInt(selectedAnswer) !== questions[currentQuestion]?.correct && (
                  <div className="mt-2 text-sm">
                    <span className="font-medium text-green-700">正确答案: </span>
                    <span className="text-green-700">
                      {String.fromCharCode(65 + questions[currentQuestion]?.correct)} - {questions[currentQuestion]?.options[questions[currentQuestion]?.correct]}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between">
              <Button 
                variant="outline" 
                disabled={currentQuestion === 0}
                onClick={() => {
                  if (currentQuestion > 0) {
                    setCurrentQuestion(prev => prev - 1);
                    setSelectedAnswer(answers[currentQuestion - 1] || "");
                    setShowExplanation(false);
                  }
                }}
              >
                上一题
              </Button>
              
              <Button 
                onClick={handleNextQuestion}
                disabled={showExplanation}
              >
                {currentQuestion === questions.length - 1 ? '完成练习' : '下一题'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};