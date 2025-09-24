import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Calendar, Clock, CheckCircle, XCircle, Target, Trophy, BookOpen, BarChart3 } from "lucide-react";

export const TrainingHistory = () => {
  const navigate = useNavigate();
  
  // Mock data for training history
  const practiceHistory = [
    {
      id: 1,
      chapter: "机器学习基础",
      date: "2024-01-15",
      time: "14:30",
      totalQuestions: 50,
      correctAnswers: 42,
      accuracy: 84,
      timeSpent: 35,
      status: "completed"
    },
    {
      id: 2,
      chapter: "深度学习原理",
      date: "2024-01-14",
      time: "10:15",
      totalQuestions: 60,
      correctAnswers: 48,
      accuracy: 80,
      timeSpent: 45,
      status: "completed"
    },
    {
      id: 3,
      chapter: "生成式AI技术",
      date: "2024-01-13",
      time: "16:20",
      totalQuestions: 40,
      correctAnswers: 35,
      accuracy: 87.5,
      timeSpent: 28,
      status: "completed"
    },
    {
      id: 4,
      chapter: "人工智能概述",
      date: "2024-01-12",
      time: "09:45",
      totalQuestions: 30,
      correctAnswers: 26,
      accuracy: 86.7,
      timeSpent: 20,
      status: "completed"
    }
  ];

  const examHistory = [
    {
      id: 1,
      title: "模拟考试一",
      date: "2024-01-16",
      time: "09:00",
      totalQuestions: 100,
      correctAnswers: 85,
      score: 85,
      timeSpent: 105,
      status: "passed",
      difficulty: "初级"
    },
    {
      id: 2,
      title: "模拟考试二",
      date: "2024-01-10",
      time: "14:00",
      totalQuestions: 120,
      correctAnswers: 94,
      score: 78,
      timeSpent: 135,
      status: "passed",
      difficulty: "中级"
    },
    {
      id: 3,
      title: "模拟考试三",
      date: "2024-01-05",
      time: "10:30",
      totalQuestions: 150,
      correctAnswers: 98,
      score: 65,
      timeSpent: 180,
      status: "failed",
      difficulty: "高级"
    }
  ];

  const wrongQuestionHistory = [
    {
      id: 1,
      question: "什么是机器学习中的过拟合现象？",
      chapter: "机器学习基础",
      date: "2024-01-15",
      wrongCount: 3,
      masteredDate: null,
      status: "reviewing"
    },
    {
      id: 2,
      question: "深度学习中的反向传播算法原理是什么？",
      chapter: "深度学习原理",
      date: "2024-01-14",
      wrongCount: 2,
      masteredDate: "2024-01-16",
      status: "mastered"
    },
    {
      id: 3,
      question: "生成式AI在内容创作中的应用有哪些？",
      chapter: "生成式AI技术",
      date: "2024-01-13",
      wrongCount: 1,
      masteredDate: null,
      status: "reviewing"
    }
  ];

  const getStatusBadge = (status: string, score?: number) => {
    switch (status) {
      case "completed":
      case "passed":
        return <Badge className="bg-green-100 text-green-700 border-green-200">✓ 通过</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-700 border-red-200">✗ 未通过</Badge>;
      case "mastered":
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">✓ 已掌握</Badge>;
      case "reviewing":
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">📖 复习中</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTotalStats = () => {
    const totalPracticeQuestions = practiceHistory.reduce((sum, record) => sum + record.totalQuestions, 0);
    const totalCorrectAnswers = practiceHistory.reduce((sum, record) => sum + record.correctAnswers, 0);
    const averageAccuracy = totalPracticeQuestions > 0 ? (totalCorrectAnswers / totalPracticeQuestions * 100).toFixed(1) : 0;
    const totalStudyTime = practiceHistory.reduce((sum, record) => sum + record.timeSpent, 0);
    
    return {
      totalPracticeQuestions,
      totalCorrectAnswers,
      averageAccuracy,
      totalStudyTime,
      totalExams: examHistory.length,
      passedExams: examHistory.filter(exam => exam.status === "passed").length
    };
  };

  const stats = getTotalStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="ghost" onClick={() => navigate("/training")} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回训练中心
            </Button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
              训练历史记录
            </h1>
            <p className="text-xl text-muted-foreground mt-2">
              查看您的学习进度和成长轨迹
            </p>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="grid md:grid-cols-6 gap-4 mb-8">
          <Card className="shadow-soft">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.totalPracticeQuestions}</div>
                <div className="text-sm text-muted-foreground">累计练习题目</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.totalCorrectAnswers}</div>
                <div className="text-sm text-muted-foreground">正确答题数</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.averageAccuracy}%</div>
                <div className="text-sm text-muted-foreground">平均准确率</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.totalStudyTime}min</div>
                <div className="text-sm text-muted-foreground">累计学习时长</div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.totalExams}</div>
                <div className="text-sm text-muted-foreground">参与考试次数</div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.passedExams}</div>
                <div className="text-sm text-muted-foreground">通过考试次数</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="practice" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="practice">章节练习记录</TabsTrigger>
            <TabsTrigger value="exams">模拟考试记录</TabsTrigger>
            <TabsTrigger value="wrong-questions">错题记录</TabsTrigger>
          </TabsList>

          {/* Practice History */}
          <TabsContent value="practice">
            <Card className="shadow-medium">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="gradient-primary w-12 h-12 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle>章节练习记录</CardTitle>
                    <CardDescription>查看您的章节练习详细记录</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>章节名称</TableHead>
                      <TableHead>练习日期</TableHead>
                      <TableHead>题目数量</TableHead>
                      <TableHead>正确数量</TableHead>
                      <TableHead>准确率</TableHead>
                      <TableHead>用时</TableHead>
                      <TableHead>状态</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {practiceHistory.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.chapter}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3" />
                            {record.date} {record.time}
                          </div>
                        </TableCell>
                        <TableCell>{record.totalQuestions}</TableCell>
                        <TableCell>{record.correctAnswers}</TableCell>
                        <TableCell>
                          <span className={`font-medium ${
                            record.accuracy >= 90 ? 'text-green-600' :
                            record.accuracy >= 80 ? 'text-blue-600' :
                            record.accuracy >= 70 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {record.accuracy}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="h-3 w-3" />
                            {record.timeSpent}min
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Exam History */}
          <TabsContent value="exams">
            <Card className="shadow-medium">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="gradient-primary w-12 h-12 rounded-lg flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle>模拟考试记录</CardTitle>
                    <CardDescription>查看您的模拟考试成绩和详细记录</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>考试名称</TableHead>
                      <TableHead>考试日期</TableHead>
                      <TableHead>题目数量</TableHead>
                      <TableHead>正确数量</TableHead>
                      <TableHead>得分</TableHead>
                      <TableHead>用时</TableHead>
                      <TableHead>难度</TableHead>
                      <TableHead>状态</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {examHistory.map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell className="font-medium">{exam.title}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3" />
                            {exam.date} {exam.time}
                          </div>
                        </TableCell>
                        <TableCell>{exam.totalQuestions}</TableCell>
                        <TableCell>{exam.correctAnswers}</TableCell>
                        <TableCell>
                          <span className={`font-bold text-lg ${
                            exam.score >= 80 ? 'text-green-600' :
                            exam.score >= 70 ? 'text-blue-600' :
                            exam.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {exam.score}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="h-3 w-3" />
                            {exam.timeSpent}min
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{exam.difficulty}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(exam.status, exam.score)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wrong Questions History */}
          <TabsContent value="wrong-questions">
            <Card className="shadow-medium">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="gradient-primary w-12 h-12 rounded-lg flex items-center justify-center">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle>错题记录</CardTitle>
                    <CardDescription>追踪您的错题和掌握情况</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>题目内容</TableHead>
                      <TableHead>所属章节</TableHead>
                      <TableHead>初次错误日期</TableHead>
                      <TableHead>错误次数</TableHead>
                      <TableHead>掌握日期</TableHead>
                      <TableHead>状态</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wrongQuestionHistory.map((question) => (
                      <TableRow key={question.id}>
                        <TableCell className="max-w-md">
                          <div className="truncate" title={question.question}>
                            {question.question}
                          </div>
                        </TableCell>
                        <TableCell>{question.chapter}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3" />
                            {question.date}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${
                            question.wrongCount <= 1 ? 'text-green-600' :
                            question.wrongCount <= 2 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {question.wrongCount}次
                          </span>
                        </TableCell>
                        <TableCell>
                          {question.masteredDate ? (
                            <div className="flex items-center gap-1 text-sm text-green-600">
                              <CheckCircle className="h-3 w-3" />
                              {question.masteredDate}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(question.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};