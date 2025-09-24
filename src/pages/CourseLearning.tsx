import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Circle, 
  ChevronDown, 
  ChevronRight,
  Video,
  FileText,
  Code,
  MessageCircle,
  Brain,
  Lightbulb,
  Monitor,
  Bot,
  Send,
  Settings
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export const CourseLearning = () => {
  const { courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [currentChapter, setCurrentChapter] = useState(1);
  const [currentLesson, setCurrentLesson] = useState(1);
  const [activeSection, setActiveSection] = useState<'outline' | 'teaching' | 'practice' | 'assistant'>('teaching');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, type: 'assistant', content: '欢迎来到智能助教！我是您的学习助手，有任何问题都可以问我。' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // 模拟课程数据
  const courseData = {
    id: 'ai-basics',
    title: '生成式人工智能基础与应用',
    chapters: [
      {
        id: 1,
        title: '人工智能概述',
        lessons: [
          { id: 1, title: 'AI发展历程', type: 'video', duration: '15分钟', completed: true },
          { id: 2, title: 'AI基本概念', type: 'ppt', duration: '20分钟', completed: true },
          { id: 3, title: 'AI应用领域', type: 'markdown', duration: '10分钟', completed: false, current: true },
          { id: 4, title: '章节测试', type: 'practice', duration: '30分钟', completed: false },
        ]
      },
      {
        id: 2,
        title: '机器学习基础',
        lessons: [
          { id: 1, title: '监督学习', type: 'video', duration: '25分钟', completed: false },
          { id: 2, title: '无监督学习', type: 'ppt', duration: '20分钟', completed: false },
          { id: 3, title: '强化学习', type: 'markdown', duration: '15分钟', completed: false },
          { id: 4, title: '实验：线性回归', type: 'practice', duration: '45分钟', completed: false },
        ]
      },
      {
        id: 3,
        title: '深度学习原理',
        lessons: [
          { id: 1, title: '神经网络基础', type: 'video', duration: '30分钟', completed: false },
          { id: 2, title: 'CNN卷积神经网络', type: 'ppt', duration: '35分钟', completed: false },
          { id: 3, title: 'RNN循环神经网络', type: 'markdown', duration: '25分钟', completed: false },
          { id: 4, title: '实验：图像分类', type: 'practice', duration: '60分钟', completed: false },
        ]
      }
    ]
  };

  // 获取当前课程内容
  const getCurrentContent = () => {
    const chapter = courseData.chapters.find(c => c.id === currentChapter);
    const lesson = chapter?.lessons.find(l => l.id === currentLesson);
    return { chapter, lesson };
  };

  const { chapter, lesson } = getCurrentContent();

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    const newMessage = {
      id: chatMessages.length + 1,
      type: 'user' as const,
      content: chatInput
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    setChatInput('');
    
    // 模拟AI回复
    setTimeout(() => {
      const aiReply = {
        id: chatMessages.length + 2,
        type: 'assistant' as const,
        content: `关于"${chatInput}"的问题，这是一个很好的问题。让我为您详细解答...`
      };
      setChatMessages(prev => [...prev, aiReply]);
    }, 1000);
  };

  // 教学内容渲染
  const renderTeachingContent = () => {
    if (!lesson) return <div>选择课程内容开始学习</div>;

    switch (lesson.type) {
      case 'video':
        return (
          <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
            <div className="text-center text-white">
              <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">{lesson.title}</p>
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
                <Play className="h-4 w-4 mr-2" />
                播放视频
              </Button>
            </div>
          </div>
        );
      case 'ppt':
        return (
          <div className="aspect-video bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center border">
            <div className="text-center">
              <Monitor className="h-16 w-16 mx-auto mb-4 text-blue-600" />
              <p className="text-lg mb-2 text-blue-800">{lesson.title}</p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <FileText className="h-4 w-4 mr-2" />
                查看PPT
              </Button>
            </div>
          </div>
        );
      case 'markdown':
        return (
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-2xl font-bold mb-4">{lesson.title}</h3>
            <div className="prose max-w-none">
              <h4>人工智能应用领域</h4>
              <p>人工智能技术正在各个领域发挥着重要作用：</p>
              <ul>
                <li><strong>自然语言处理</strong>：机器翻译、聊天机器人、文本分析</li>
                <li><strong>计算机视觉</strong>：图像识别、人脸识别、自动驾驶</li>
                <li><strong>语音识别</strong>：语音助手、语音转文字</li>
                <li><strong>推荐系统</strong>：个性化推荐、精准营销</li>
                <li><strong>医疗健康</strong>：疾病诊断、药物发现</li>
              </ul>
              <p>这些应用正在深刻改变着我们的生活和工作方式...</p>
            </div>
          </div>
        );
      default:
        return <div>未知内容类型</div>;
    }
  };

  // 实训内容渲染
  const renderPracticeContent = () => {
    return (
      <Tabs defaultValue="coding" className="h-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="coding">编程实验</TabsTrigger>
          <TabsTrigger value="prompt">提示词工程</TabsTrigger>
          <TabsTrigger value="agent">智能体构建</TabsTrigger>
          <TabsTrigger value="comfyui">ComfyUI</TabsTrigger>
        </TabsList>
        
        <TabsContent value="coding" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Python编程实验
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 h-96">
                <div>
                  <h4 className="font-semibold mb-2">代码编辑器</h4>
                  <div className="bg-gray-900 rounded p-4 h-full">
                    <code className="text-green-400 text-sm">
                      # 线性回归示例<br/>
                      import numpy as np<br/>
                      import matplotlib.pyplot as plt<br/>
                      <br/>
                      # 生成示例数据<br/>
                      X = np.random.randn(100, 1)<br/>
                      y = 2 * X + 1 + np.random.randn(100, 1) * 0.1
                    </code>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">运行结果</h4>
                  <div className="bg-gray-100 rounded p-4 h-full">
                    <p className="text-sm text-gray-600">点击运行按钮查看结果...</p>
                  </div>
                </div>
              </div>
              <Button className="mt-4">
                <Play className="h-4 w-4 mr-2" />
                运行代码
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="prompt" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                提示词工程实验
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold mb-2">提示词输入</label>
                  <Textarea 
                    placeholder="请输入您的提示词..." 
                    className="h-32"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">AI响应</label>
                  <div className="bg-gray-50 border rounded p-4 h-32">
                    <p className="text-gray-500">AI响应将在这里显示...</p>
                  </div>
                </div>
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  发送提示词
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="agent" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                智能体构建实验
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Bot className="h-16 w-16 mx-auto mb-4 text-blue-600" />
                <p className="text-lg mb-4">智能体构建工具</p>
                <p className="text-gray-600 mb-6">设计和配置您的专属AI智能体</p>
                <Button>
                  <Settings className="h-4 w-4 mr-2" />
                  开始构建
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comfyui" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                ComfyUI工作流
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold">UI</span>
                  </div>
                  <p className="text-lg mb-2">ComfyUI界面</p>
                  <p className="text-gray-600 mb-4">可视化AI工作流设计</p>
                  <Button variant="outline">
                    启动ComfyUI
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/courses')}
                className="mb-2"
              >
                ← 返回课程
              </Button>
              <h1 className="text-2xl font-bold">{courseData.title}</h1>
              <p className="text-muted-foreground">
                第{currentChapter}章 {chapter?.title} - {lesson?.title}
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              进度: {Math.round((currentLesson / (chapter?.lessons.length || 1)) * 100)}%
            </div>
          </div>
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-120px)]">
        {/* 左侧：课程大纲 */}
        <ResizablePanel defaultSize={25} minSize={20}>
          <div className="p-4 h-full">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              课程大纲
            </h3>
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-2">
                {courseData.chapters.map((chapterItem) => (
                  <Collapsible key={chapterItem.id} defaultOpen={chapterItem.id === currentChapter}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted rounded">
                      <span className="font-medium text-left">
                        第{chapterItem.id}章 {chapterItem.title}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-4">
                      {chapterItem.lessons.map((lessonItem) => (
                        <div
                          key={lessonItem.id}
                          className={`p-2 rounded cursor-pointer flex items-center gap-2 ${
                            currentChapter === chapterItem.id && currentLesson === lessonItem.id
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-muted'
                          }`}
                          onClick={() => {
                            setCurrentChapter(chapterItem.id);
                            setCurrentLesson(lessonItem.id);
                          }}
                        >
                          {lessonItem.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : lessonItem.current ? (
                            <Play className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Circle className="h-4 w-4 text-gray-400" />
                          )}
                          <div className="flex-1">
                            <div className="text-sm font-medium">{lessonItem.title}</div>
                            <div className="text-xs opacity-70">{lessonItem.duration}</div>
                          </div>
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </ScrollArea>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        {/* 中间：教学区和实训区 */}
        <ResizablePanel defaultSize={50} minSize={40}>
          <Tabs value={activeSection} onValueChange={(value) => setActiveSection(value as any)} className="h-full">
            <div className="border-b px-4">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="teaching">教学区</TabsTrigger>
                <TabsTrigger value="practice">实训区</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="teaching" className="p-4 h-full">
              <div className="h-[calc(100vh-220px)]">
                {renderTeachingContent()}
              </div>
            </TabsContent>

            <TabsContent value="practice" className="p-4 h-full">
              <div className="h-[calc(100vh-220px)]">
                {renderPracticeContent()}
              </div>
            </TabsContent>
          </Tabs>
        </ResizablePanel>

        <ResizableHandle />

        {/* 右侧：智能助教 */}
        <ResizablePanel defaultSize={25} minSize={20}>
          <div className="p-4 h-full flex flex-col">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              智能助教
            </h3>
            
            <ScrollArea className="flex-1 mb-4">
              <div className="space-y-4">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground ml-4'
                        : 'bg-muted mr-4'
                    }`}
                  >
                    <div className="text-sm">{message.content}</div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-2">
              <Textarea
                placeholder="有什么问题可以问我..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="resize-none"
                rows={2}
              />
              <Button 
                onClick={handleSendMessage}
                className="w-full"
                disabled={!chatInput.trim()}
              >
                <Send className="h-4 w-4 mr-2" />
                发送
              </Button>
            </div>

            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                💡 我可以回答课程相关问题、解释概念、提供学习建议等
              </p>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};