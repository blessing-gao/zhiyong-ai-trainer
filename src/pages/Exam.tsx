import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { FileText, FlaskConical, Clock, User, Calendar, MapPin, AlertCircle } from "lucide-react";

export const Exam = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // 模拟考生信息（实际应该从登录状态或API获取）
  const candidateInfo = {
    name: "张三",
    candidateId: "2024AI001",
    idCard: "320123199901011234",
    examDate: "2024年3月25日",
    examTime: "上午 9:00 - 12:00",
    examRoom: "计算机实验室A-101",
    seatNumber: "15",
    examSession: "AI训练师认证考试-2024年3月"
  };

  const handleTheoryExam = () => {
    toast({
      title: "正在进入理论考试",
      description: "请仔细阅读考试规则，诚信应考"
    });
    navigate('/exam/theory');
  };

  const handlePracticalExam = () => {
    toast({
      title: "正在进入实验考试",
      description: "请确保网络连接稳定，诚信应考"
    });
    navigate('/exam/practical');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent mb-2">
            智涌·AI训练师认证考试
          </h1>
          <p className="text-muted-foreground">请核对准考证信息，选择对应的考试类型</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* 准考证信息 */}
          <Card className="shadow-elegant border-l-4 border-l-primary">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-primary">准考证</CardTitle>
                  <CardDescription>{candidateInfo.examSession}</CardDescription>
                </div>
                <Badge className="bg-green-100 text-green-700 px-3 py-1">
                  有效
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* 考生信息 */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    考生信息
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">姓名：</span>
                      <span className="font-medium">{candidateInfo.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">准考证号：</span>
                      <span className="font-medium text-primary">{candidateInfo.candidateId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">身份证号：</span>
                      <span className="font-medium">{candidateInfo.idCard}</span>
                    </div>
                  </div>
                </div>

                {/* 考试安排 */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    考试安排
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">考试日期：</span>
                      <span className="font-medium">{candidateInfo.examDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">考试时间：</span>
                      <span className="font-medium">{candidateInfo.examTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">考试地点：</span>
                      <span className="font-medium">{candidateInfo.examRoom}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">座位号：</span>
                      <span className="font-medium text-primary">{candidateInfo.seatNumber}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 考试注意事项 */}
          <Card className="shadow-medium border-orange-200">
            <CardHeader>
              <CardTitle className="text-orange-700 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                考试注意事项
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <ul className="space-y-2">
                  <li>• 请提前15分钟到达考场</li>
                  <li>• 携带身份证和准考证</li>
                  <li>• 考试期间禁止使用手机等电子设备</li>
                  <li>• 保持考场安静，不得交头接耳</li>
                </ul>
                <ul className="space-y-2">
                  <li>• 理论考试时长：120分钟</li>
                  <li>• 实验考试时长：90分钟</li>
                  <li>• 考试结束后请有序退场</li>
                  <li>• 严禁作弊，违者取消考试资格</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Separator className="my-8" />

          {/* 考试入口 */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* 理论考试 */}
            <Card className="shadow-elegant hover:shadow-strong transition-all duration-300 group cursor-pointer border-2 hover:border-primary/50">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-blue-700">理论考试</CardTitle>
                <CardDescription>
                  人工智能基础理论知识考试
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>考试时长：120分钟</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  包含选择题、判断题、简答题等题型
                </div>
                <Button 
                  onClick={handleTheoryExam}
                  className="w-full gradient-primary text-white hover:opacity-90 transition-all"
                  size="lg"
                >
                  进入理论考试
                </Button>
              </CardContent>
            </Card>

            {/* 实验考试 */}
            <Card className="shadow-elegant hover:shadow-strong transition-all duration-300 group cursor-pointer border-2 hover:border-primary/50">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <FlaskConical className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl text-green-700">实验考试</CardTitle>
                <CardDescription>
                  人工智能实践操作技能考试
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>考试时长：90分钟</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  包含编程实践、模型训练、数据分析等
                </div>
                <Button 
                  onClick={handlePracticalExam}
                  className="w-full gradient-secondary text-white hover:opacity-90 transition-all"
                  size="lg"
                >
                  进入实验考试
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 底部提示 */}
          <div className="text-center text-sm text-muted-foreground bg-blue-50 p-4 rounded-lg">
            <p>如有技术问题，请联系监考老师或技术支持人员</p>
            <p className="mt-1">祝您考试顺利！</p>
          </div>
        </div>
      </div>
    </div>
  );
};