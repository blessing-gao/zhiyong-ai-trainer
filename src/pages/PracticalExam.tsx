import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Clock, 
  FlaskConical, 
  CheckCircle, 
  AlertTriangle, 
  Save, 
  Code, 
  Database, 
  BarChart3,
  Upload,
  Download
} from "lucide-react";

interface PracticalTask {
  id: number;
  title: string;
  description: string;
  type: 'coding' | 'analysis' | 'model';
  timeAllocation: number; // 分钟
  maxScore: number;
}

export const PracticalExam = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentTask, setCurrentTask] = useState(0);
  const [submissions, setSubmissions] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(5400); // 90分钟 = 5400秒
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [switchCount, setSwitchCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 模拟实验任务数据
  const tasks: PracticalTask[] = [
    {
      id: 1,
      title: "Python编程实践",
      description: "实现一个简单的线性回归模型，要求使用Python和numpy库完成数据处理和模型训练。",
      type: 'coding',
      timeAllocation: 30,
      maxScore: 30
    },
    {
      id: 2,
      title: "数据分析任务",
      description: "分析提供的用户行为数据集，找出用户购买偏好的规律，并提供相应的营销建议。",
      type: 'analysis',
      timeAllocation: 25,
      maxScore: 25
    },
    {
      id: 3,
      title: "机器学习模型构建",
      description: "使用提供的数据集构建一个分类模型，要求选择合适的算法并进行模型评估。",
      type: 'model',
      timeAllocation: 35,
      maxScore: 45
    }
  ];

  // 进入全屏和监听切屏
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } catch (error) {
        console.error('无法进入全屏模式:', error);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && !isSubmitted) {
        setSwitchCount(prev => {
          const newCount = prev + 1;
          toast({
            title: "检测到切屏",
            description: `警告！已切屏 ${newCount} 次，切屏3次将自动提交考试`,
            variant: "destructive",
          });
          
          if (newCount >= 3) {
            handleSubmit();
          }
          
          return newCount;
        });
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isSubmitted) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    enterFullscreen();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, [isSubmitted, toast]);

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

  // 处理提交内容
  const handleSubmissionChange = (taskId: number, content: string) => {
    setSubmissions({
      ...submissions,
      [taskId]: content
    });
  };

  // 保存当前任务
  const handleSave = () => {
    toast({
      title: "任务已保存",
      description: "您的实验内容已自动保存"
    });
  };

  // 提交考试
  const handleSubmit = () => {
    setIsSubmitted(true);
    // 退出全屏
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    toast({
      title: "实验考试已提交",
      description: "您的实验作品已提交，感谢您的参与"
    });
    
    // 模拟提交延迟后跳转
    setTimeout(() => {
      navigate('/exam');
    }, 3000);
  };

  // 获取已完成任务数量
  const getCompletedCount = () => {
    return Object.keys(submissions).filter(taskId => submissions[parseInt(taskId)]?.trim()).length;
  };

  // 获取进度百分比
  const getProgress = () => {
    return (getCompletedCount() / tasks.length) * 100;
  };

  // 获取任务图标
  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'coding':
        return <Code className="h-5 w-5" />;
      case 'analysis':
        return <BarChart3 className="h-5 w-5" />;
      case 'model':
        return <Database className="h-5 w-5" />;
      default:
        return <FlaskConical className="h-5 w-5" />;
    }
  };

  // 获取任务类型标签
  const getTaskTypeLabel = (type: string) => {
    switch (type) {
      case 'coding':
        return '编程实践';
      case 'analysis':
        return '数据分析';
      case 'model':
        return '模型构建';
      default:
        return '实验任务';
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-elegant">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-16 h-16 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-green-700">实验考试已提交</CardTitle>
            <CardDescription>您的实验考试作品已成功提交</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              实验成果将由专业导师进行评审，结果将通过邮件通知您
            </p>
            <p className="text-sm text-muted-foreground">
              正在返回考试主页...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentTaskData = tasks[currentTask];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* 顶部状态栏 */}
      <div className="bg-white border-b border-border shadow-soft sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-green-600" />
                <span className="font-semibold">实验考试</span>
              </div>
              <Badge variant="outline">
                任务 {currentTask + 1} / {tasks.length}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">已完成：</span>
                <Badge className="bg-green-100 text-green-700">
                  {getCompletedCount()} / {tasks.length}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className={`font-mono font-semibold ${timeLeft < 600 ? 'text-red-600' : 'text-orange-600'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              {switchCount > 0 && (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="text-sm text-destructive font-medium">
                    切屏警告: {switchCount}/3
                  </span>
                </div>
              )}
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
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* 任务列表侧边栏 */}
            <div className="lg:col-span-1">
              <Card className="shadow-medium sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">实验任务</CardTitle>
                  <CardDescription>点击切换任务</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {tasks.map((task, index) => (
                    <div
                      key={task.id}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        currentTask === index 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setCurrentTask(index)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {getTaskIcon(task.type)}
                        <span className="font-medium text-sm">任务 {index + 1}</span>
                        {submissions[task.id]?.trim() && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{task.title}</p>
                      <div className="flex justify-between items-center text-xs">
                        <Badge variant="outline" className="text-xs">
                          {getTaskTypeLabel(task.type)}
                        </Badge>
                        <span className="text-muted-foreground">{task.maxScore}分</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* 主要内容区域 */}
            <div className="lg:col-span-3">
              <Card className="shadow-elegant">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getTaskIcon(currentTaskData.type)}
                      <div>
                        <CardTitle className="text-xl">
                          任务 {currentTask + 1}: {currentTaskData.title}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          建议用时：{currentTaskData.timeAllocation}分钟 | 分值：{currentTaskData.maxScore}分
                        </CardDescription>
                      </div>
                    </div>
                    {timeLeft < 600 && (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm font-medium">时间不足10分钟</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 任务描述 */}
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold mb-2">任务要求：</h3>
                    <p className="text-sm leading-relaxed">{currentTaskData.description}</p>
                  </div>

                  {/* 任务工作区 */}
                  <Tabs defaultValue="workspace" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="workspace">工作区</TabsTrigger>
                      <TabsTrigger value="resources">资源文件</TabsTrigger>
                      <TabsTrigger value="submit">提交区</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="workspace" className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold">代码编辑器 / 工作区</h3>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Upload className="h-4 w-4 mr-1" />
                              上传文件
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              下载
                            </Button>
                          </div>
                        </div>
                        <Textarea
                          placeholder={`请在此处完成任务：${currentTaskData.title}\n\n您可以输入代码、分析报告或模型描述...`}
                          className="min-h-[400px] font-mono text-sm"
                          value={submissions[currentTaskData.id] || ''}
                          onChange={(e) => handleSubmissionChange(currentTaskData.id, e.target.value)}
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="resources" className="space-y-4">
                      <div className="space-y-4">
                        <h3 className="font-semibold">相关资源</h3>
                        <div className="grid gap-3">
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">数据集.csv</p>
                              <p className="text-sm text-muted-foreground">训练数据集文件</p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              下载
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">参考文档.pdf</p>
                              <p className="text-sm text-muted-foreground">API参考文档</p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              下载
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">示例代码.py</p>
                              <p className="text-sm text-muted-foreground">示例代码模板</p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              下载
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="submit" className="space-y-4">
                      <div className="space-y-4">
                        <h3 className="font-semibold">提交您的作品</h3>
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-700 mb-2">提交说明：</p>
                          <ul className="text-sm text-blue-600 space-y-1">
                            <li>• 请确保您的代码能够正常运行</li>
                            <li>• 如果是分析任务，请包含完整的分析过程和结论</li>
                            <li>• 模型构建任务需要包含模型评估结果</li>
                            <li>• 支持上传多个文件（代码、报告、图表等）</li>
                          </ul>
                        </div>
                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground mb-2">拖拽文件到此处或点击上传</p>
                          <Button variant="outline">选择文件</Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <Separator />

                  {/* 导航按钮 */}
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentTask(Math.max(0, currentTask - 1))}
                      disabled={currentTask === 0}
                    >
                      上一个任务
                    </Button>

                    <div className="flex items-center gap-2">
                      {currentTask === tasks.length - 1 ? (
                        <Button onClick={handleSubmit} className="gradient-secondary text-white">
                          提交实验考试
                        </Button>
                      ) : (
                        <Button
                          onClick={() => setCurrentTask(Math.min(tasks.length - 1, currentTask + 1))}
                        >
                          下一个任务
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};