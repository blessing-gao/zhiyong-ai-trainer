import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Clock, CheckCircle, XCircle, Brain, Trophy, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const SimulationDetail = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [examStarted, setExamStarted] = useState(false);
  const [examComplete, setExamComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(7200); // 2 hours
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  // Mock exam data
  const examInfo = {
    title: "AI训练师认证模拟考试",
    description: "综合性AI技术认证考试",
    totalQuestions: 100,
    duration: 120,
    passingScore: 70,
    difficulty: "中级"
  };

  // Generate mock questions
  const generateQuestions = () => {
    const questionTypes = [
      "机器学习基础理论",
      "深度学习架构",
      "生成式AI应用",
      "数据处理技术",
      "模型评估方法",
      "AI伦理与安全",
      "实际应用场景"
    ];

    return Array.from({ length: 100 }, (_, index) => ({
      id: index + 1,
      type: questionTypes[index % questionTypes.length],
      question: `关于${questionTypes[index % questionTypes.length]}的问题 ${index + 1}：以下哪个说法是正确的？`,
      options: [
        `选项A - 这是一个关于${questionTypes[index % questionTypes.length]}的正确描述`,
        `选项B - 这是一个关于${questionTypes[index % questionTypes.length]}的错误描述`,
        `选项C - 这是另一个关于${questionTypes[index % questionTypes.length]}的描述`,
        `选项D - 这是最后一个关于${questionTypes[index % questionTypes.length]}的描述`
      ],
      correct: Math.floor(Math.random() * 4),
      explanation: `这道题考查的是${questionTypes[index % questionTypes.length]}的核心概念，正确答案的依据是...`
    }));
  };

  const [questions] = useState(generateQuestions);

  // Timer countdown
  useEffect(() => {
    if (!examStarted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleExamSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startExam = () => {
    setExamStarted(true);
    setTimeLeft(examInfo.duration * 60);
    toast({
      title: "考试开始",
      description: "祝您考试顺利！请仔细阅读每道题目。"
    });
  };

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestion(index);
    setSelectedAnswer(answers[index] || "");
  };

  const handleExamSubmit = () => {
    setExamComplete(true);
    toast({
      title: "考试提交成功",
      description: "正在计算您的成绩..."
    });
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer && parseInt(answer) === questions[index]?.correct) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const getAnsweredCount = () => {
    return answers.filter(answer => answer !== undefined && answer !== "").length;
  };

  // Exam start screen
  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="shadow-strong">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 gradient-primary rounded-full flex items-center justify-center mb-4">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-3xl">{examInfo.title}</CardTitle>
              <CardDescription className="text-lg">{examInfo.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">考试信息</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>题目数量:</span>
                      <span className="font-medium">{examInfo.totalQuestions} 题</span>
                    </div>
                    <div className="flex justify-between">
                      <span>考试时长:</span>
                      <span className="font-medium">{examInfo.duration} 分钟</span>
                    </div>
                    <div className="flex justify-between">
                      <span>及格分数:</span>
                      <span className="font-medium">{examInfo.passingScore} 分</span>
                    </div>
                    <div className="flex justify-between">
                      <span>难度等级:</span>
                      <Badge variant="outline">{examInfo.difficulty}</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">考试须知</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span>考试开始后不可暂停，请确保网络连接稳定</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span>建议在安静的环境中完成考试</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span>考试时间到后将自动提交，请合理分配时间</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span>可以在题目间自由跳转，最后统一提交</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center pt-6 border-t">
                <Button variant="outline" onClick={() => navigate("/training")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  返回训练中心
                </Button>
                <Button onClick={startExam} className="px-8">
                  <Trophy className="h-4 w-4 mr-2" />
                  开始考试
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Exam complete screen
  if (examComplete) {
    const score = calculateScore();
    const passed = score >= examInfo.passingScore;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="shadow-strong">
            <CardHeader className="text-center">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                passed ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {passed ? (
                  <CheckCircle className="h-8 w-8 text-green-600" />
                ) : (
                  <XCircle className="h-8 w-8 text-red-600" />
                )}
              </div>
              <CardTitle className="text-3xl">
                {passed ? '考试通过！' : '考试未通过'}
              </CardTitle>
              <CardDescription>
                {passed ? '恭喜您通过了模拟考试' : '继续努力，下次一定能通过'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className={`text-6xl font-bold mb-2 ${passed ? 'text-green-600' : 'text-red-600'}`}>
                  {score}分
                </div>
                <div className="text-lg text-muted-foreground">
                  正确率: {answers.filter((answer, index) => answer && parseInt(answer) === questions[index]?.correct).length} / {questions.length}
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {answers.filter((answer, index) => answer && parseInt(answer) === questions[index]?.correct).length}
                  </div>
                  <div className="text-sm text-green-700">答对题数</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {answers.filter((answer, index) => answer && parseInt(answer) !== questions[index]?.correct).length}
                  </div>
                  <div className="text-sm text-red-700">答错题数</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">
                    {questions.length - getAnsweredCount()}
                  </div>
                  <div className="text-sm text-gray-700">未作答</div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate("/training")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  返回训练中心
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  <Trophy className="h-4 w-4 mr-2" />
                  重新考试
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Exam interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background py-4">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">{examInfo.title}</h1>
            <Badge variant="outline" className="px-3 py-1">
              <Brain className="h-3 w-3 mr-1" />
              第 {currentQuestion + 1} / {questions.length} 题
            </Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-3 py-1">
              <Clock className="h-3 w-3 mr-1" />
              {formatTime(timeLeft)}
            </Badge>
            <Button variant="outline" onClick={() => setShowSubmitDialog(true)}>
              提交考试
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Question navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">答题卡</CardTitle>
                <CardDescription>已答题: {getAnsweredCount()} / {questions.length}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((_, index) => (
                    <Button
                      key={index}
                      variant={currentQuestion === index ? "default" : answers[index] ? "outline" : "ghost"}
                      size="sm"
                      className={`h-8 w-8 p-0 text-xs ${
                        answers[index] ? 'bg-green-100 text-green-700 border-green-300' : ''
                      }`}
                      onClick={() => goToQuestion(index)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
                
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded"></div>
                    <span>当前题目</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                    <span>已作答</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
                    <span>未作答</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question content */}
          <div className="lg:col-span-3">
            <Card className="shadow-medium">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{questions[currentQuestion]?.type}</Badge>
                  <div className="text-sm text-muted-foreground">
                    题目 {currentQuestion + 1} / {questions.length}
                  </div>
                </div>
                
                <div className="text-lg font-medium leading-relaxed mt-4">
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

                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    disabled={currentQuestion === 0}
                    onClick={() => goToQuestion(currentQuestion - 1)}
                  >
                    上一题
                  </Button>
                  
                  <Button 
                    disabled={currentQuestion === questions.length - 1}
                    onClick={() => goToQuestion(currentQuestion + 1)}
                  >
                    下一题
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};