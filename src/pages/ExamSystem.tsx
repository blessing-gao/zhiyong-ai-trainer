import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LogOut,
  BookOpen,
  Clock,
  Target,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ExamLoginInfo {
  participantId: number;
  username: string;
  admissionNumber: string;
  seatNumber: string;
  examId: number;
  examName: string;
  examStartTime: string;
  examEndTime: string;
  duration: number;
  totalScore: number;
  passScore: number;
  examStatus: number;
  papers: Array<{
    paperId: number;
    paperName: string;
    questionCount: number;
    totalScore: number;
    passScore: number;
  }>;
}

const ExamSystem = () => {
  const navigate = useNavigate();
  const [loginInfo, setLoginInfo] = useState<ExamLoginInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 初始化：从 sessionStorage 获取登录信息
  useEffect(() => {
    try {
      const examLoginInfo = sessionStorage.getItem("examLoginInfo");
      if (!examLoginInfo) {
        setError("未找到登录信息，请重新登录");
        setTimeout(() => navigate("/exam/login"), 2000);
        return;
      }

      const info = JSON.parse(examLoginInfo) as ExamLoginInfo;
      setLoginInfo(info);
      setIsLoading(false);
    } catch (err) {
      console.error("解析登录信息失败:", err);
      setError("登录信息格式错误，请重新登录");
      setTimeout(() => navigate("/exam/login"), 2000);
    }
  }, [navigate]);

  // 处理进入考试
  const handleEnterExam = (paperId: number) => {
    if (!loginInfo) return;

    // 保存当前考试信息到 sessionStorage
    sessionStorage.setItem(
      "currentExamInfo",
      JSON.stringify({
        participantId: loginInfo.participantId,
        examId: loginInfo.examId,
        paperId: paperId,
        examName: loginInfo.examName,
        duration: loginInfo.duration,
        totalScore: loginInfo.totalScore,
        passScore: loginInfo.passScore,
      })
    );

    // 跳转到答题卡界面
    navigate("/exam/formal", {
      state: {
        fromExamSystem: true,
        paperId: paperId,
      },
    });
  };

  // 处理退出登录
  const handleLogout = () => {
    if (confirm("确定要退出考试系统吗？")) {
      sessionStorage.removeItem("examLoginInfo");
      sessionStorage.removeItem("currentExamInfo");
      navigate("/exam/login");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !loginInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700">{error || "加载失败"}</p>
            </div>
            <Button
              onClick={() => navigate("/exam/login")}
              className="w-full"
            >
              返回登录
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getExamStatusText = (status: number) => {
    switch (status) {
      case 1:
        return "未开始";
      case 2:
        return "考试中";
      case 3:
        return "已结束";
      default:
        return "未知";
    }
  };

  const getExamStatusColor = (status: number) => {
    switch (status) {
      case 1:
        return "bg-yellow-100 text-yellow-800";
      case 2:
        return "bg-green-100 text-green-800";
      case 3:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* 顶部导航栏 */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">考试系统</h1>
            <p className="text-gray-600 mt-1">欢迎，{loginInfo.username}</p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            退出登录
          </Button>
        </div>
      </div>

      {/* 考生信息卡片 */}
      <div className="max-w-6xl mx-auto mb-8">
        <Card>
          <CardHeader>
            <CardTitle>考生信息</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">准考证号</p>
                <p className="text-lg font-semibold text-gray-900">
                  {loginInfo.admissionNumber}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">座位号</p>
                <p className="text-lg font-semibold text-gray-900">
                  {loginInfo.seatNumber}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">考试名称</p>
                <p className="text-lg font-semibold text-gray-900">
                  {loginInfo.examName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">考试状态</p>
                <Badge className={getExamStatusColor(loginInfo.examStatus)}>
                  {getExamStatusText(loginInfo.examStatus)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 试卷列表 */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">我的试卷</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loginInfo.papers.map((paper, index) => (
            <Card
              key={paper.paperId}
              className="hover:shadow-lg transition-shadow cursor-pointer"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {paper.paperName || `试卷 ${index + 1}`}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      试卷ID: {paper.paperId}
                    </p>
                  </div>
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 试卷信息 */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Target className="w-4 h-4" />
                    <span>题目数量: {paper.questionCount || "加载中..."}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>总分: {paper.totalScore}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>及格分: {paper.passScore}</span>
                  </div>
                </div>

                {/* 进入考试按钮 */}
                <Button
                  onClick={() => handleEnterExam(paper.paperId)}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  进入考试
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 如果没有试卷 */}
        {loginInfo.papers.length === 0 && (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">暂无试卷</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ExamSystem;

