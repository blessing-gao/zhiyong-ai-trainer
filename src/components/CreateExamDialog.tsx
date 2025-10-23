import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, ChevronRight, ChevronLeft } from "lucide-react";
import { examApi } from "@/services/api";

interface CreateExamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface ExamBasicInfo {
  examName: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalScore: number;
  passScore: number;
  examType: number;
  description: string;
}

interface ExamSession {
  sessionName: string;
  startTime: string;
  endTime: string;
  location: string;
  seatLimit: number;
  monitorId?: number;
  participants: ExamParticipant[];
}

interface ExamParticipant {
  userId: number;
  username: string;
  paperId: number;
  paperName?: string;
  admissionNumber: string;
  password: string;
  seatNumber: string;
}

interface User {
  id: string | number;
  username: string;
  real_name: string;
}

interface Paper {
  id: number;
  name: string;
}

const CreateExamDialog = ({ open, onOpenChange, onSuccess }: CreateExamDialogProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [papersLoading, setPapersLoading] = useState(false);

  // 第一步：基本信息
  const [basicInfo, setBasicInfo] = useState<ExamBasicInfo>({
    examName: "",
    startTime: "",
    endTime: "",
    duration: 120,
    totalScore: 100,
    passScore: 60,
    examType: 1,
    description: "",
  });

  // 第二步：考场列表
  const [sessions, setSessions] = useState<ExamSession[]>([
    {
      sessionName: "",
      startTime: "",
      endTime: "",
      location: "",
      seatLimit: 50,
      participants: [],
    },
  ]);

  // 当前编辑的考场索引
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);

  // 加载用户列表
  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const response: any = await examApi.getUsers();
      if (response.code === 0 && response.data) {
        // 后端返回的数据结构是 { page, data: [...], page_size, total_count, total_pages, has_next }
        const userData = response.data.data || [];
        setUsers(userData);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setUsersLoading(false);
    }
  };

  // 加载试卷列表
  const loadPapers = async () => {
    setPapersLoading(true);
    try {
      const response: any = await examApi.getPapers();
      if (response.code === 0 && response.data) {
        setPapers(response.data.records || []);
      }
    } catch (error) {
      console.error("Failed to load papers:", error);
    } finally {
      setPapersLoading(false);
    }
  };

  // 当对话框打开时加载数据
  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
  };

  // 当步骤改变时加载数据
  useEffect(() => {
    if (step === 3) {
      loadUsers();
      loadPapers();
    }
  }, [step]);

  // 验证第一步
  const validateStep1 = () => {
    if (!basicInfo.examName) {
      alert("请输入考试名称");
      return false;
    }
    if (!basicInfo.startTime || !basicInfo.endTime) {
      alert("请选择考试时间");
      return false;
    }
    if (new Date(basicInfo.startTime) >= new Date(basicInfo.endTime)) {
      alert("开始时间必须早于结束时间");
      return false;
    }
    if (basicInfo.passScore > basicInfo.totalScore) {
      alert("及格分数不能大于总分");
      return false;
    }
    return true;
  };

  // 验证第二步
  const validateStep2 = () => {
    if (sessions.length === 0) {
      alert("至少需要添加一个考场");
      return false;
    }
    for (const session of sessions) {
      if (!session.sessionName) {
        alert("请输入考场名称");
        return false;
      }
      if (!session.startTime || !session.endTime) {
        alert("请选择考场时间");
        return false;
      }
      if (new Date(session.startTime) >= new Date(session.endTime)) {
        alert("考场开始时间必须早于结束时间");
        return false;
      }
    }
    return true;
  };

  // 验证第三步
  const validateStep3 = () => {
    for (const session of sessions) {
      if (session.participants.length === 0) {
        alert("每个考场至少需要添加一个考生");
        return false;
      }
    }
    return true;
  };

  // 验证第四步
  const validateStep4 = () => {
    for (const session of sessions) {
      for (const participant of session.participants) {
        if (!participant.paperId) {
          alert("请为所有考生绑定试卷");
          return false;
        }
      }
    }
    return true;
  };

  // 下一步
  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    if (step === 4 && !validateStep4()) return;

    setStep(step + 1);
  };

  // 上一步
  const handlePrev = () => {
    setStep(step - 1);
  };

  // 添加考场
  const addSession = () => {
    setSessions([
      ...sessions,
      {
        sessionName: "",
        startTime: "",
        endTime: "",
        location: "",
        seatLimit: 50,
        participants: [],
      },
    ]);
  };

  // 删除考场
  const deleteSession = (index: number) => {
    setSessions(sessions.filter((_, i) => i !== index));
    if (currentSessionIndex >= sessions.length - 1) {
      setCurrentSessionIndex(Math.max(0, sessions.length - 2));
    }
  };

  // 添加考生
  const addParticipant = () => {
    const newSessions = [...sessions];
    newSessions[currentSessionIndex].participants.push({
      userId: 0,
      username: "",
      paperId: 0,
      paperName: "",
      admissionNumber: "",
      password: "",
      seatNumber: "",
    });
    setSessions(newSessions);
  };

  // 删除考生
  const deleteParticipant = (participantIndex: number) => {
    const newSessions = [...sessions];
    newSessions[currentSessionIndex].participants = newSessions[
      currentSessionIndex
    ].participants.filter((_, i) => i !== participantIndex);
    setSessions(newSessions);
  };

  // 格式化日期时间为 ISO 8601 格式（添加秒数）
  const formatDateTime = (dateTimeStr: string): string => {
    if (!dateTimeStr) return dateTimeStr;
    // 如果已经包含秒数，直接返回
    if (dateTimeStr.includes(":") && dateTimeStr.split(":").length > 2) {
      return dateTimeStr;
    }
    // 否则添加 :00
    return dateTimeStr + ":00";
  };

  // 提交表单
  const handleSubmit = async () => {
    if (!validateStep4()) return;

    setLoading(true);
    try {
      const payload = {
        exam: {
          ...basicInfo,
          startTime: formatDateTime(basicInfo.startTime),
          endTime: formatDateTime(basicInfo.endTime),
        },
        sessions: sessions.map((session) => ({
          session: {
            sessionName: session.sessionName,
            startTime: formatDateTime(session.startTime),
            endTime: formatDateTime(session.endTime),
            location: session.location,
            seatLimit: session.seatLimit,
            monitorId: session.monitorId,
          },
          participants: session.participants.map((p) => ({
            userId: p.userId,
            username: p.username,
            paperId: p.paperId,
            admissionNumber: p.admissionNumber,
            password: p.password,
            seatNumber: p.seatNumber,
          })),
        })),
      };

      const response: any = await examApi.batchCreateExam(payload);
      if (response.code === 0) {
        alert("考试创建成功");
        onOpenChange(false);
        setStep(1);
        onSuccess?.();
      } else {
        alert("创建失败: " + response.msg);
      }
    } catch (error) {
      console.error("Failed to create exam:", error);
      alert("创建失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>创建考试</DialogTitle>
        </DialogHeader>

        {/* 步骤指示器 */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  s <= step
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {s}
              </div>
              {s < 4 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    s < step ? "bg-blue-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* 步骤标题 */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold">
            {step === 1 && "第一步：填写考试基本信息"}
            {step === 2 && "第二步：安排考场"}
            {step === 3 && "第三步：分配考生"}
            {step === 4 && "第四步：绑定试卷"}
          </h3>
          <p className="text-sm text-gray-500">
            {step === 1 && "请输入考试的基本信息"}
            {step === 2 && "为考试添加考场，可以添加多个考场"}
            {step === 3 && "为每个考场选择考生"}
            {step === 4 && "为每个考生绑定试卷"}
          </p>
        </div>

        {/* 内容区域 */}
        <div className="space-y-4">
          {step === 1 && <Step1Content basicInfo={basicInfo} setBasicInfo={setBasicInfo} />}
          {step === 2 && (
            <Step2Content
              sessions={sessions}
              setSessions={setSessions}
              currentSessionIndex={currentSessionIndex}
              setCurrentSessionIndex={setCurrentSessionIndex}
              addSession={addSession}
              deleteSession={deleteSession}
            />
          )}
          {step === 3 && (
            <Step3Content
              sessions={sessions}
              setSessions={setSessions}
              currentSessionIndex={currentSessionIndex}
              setCurrentSessionIndex={setCurrentSessionIndex}
              users={users}
              usersLoading={usersLoading}
              addParticipant={addParticipant}
              deleteParticipant={deleteParticipant}
            />
          )}
          {step === 4 && (
            <Step4Content
              sessions={sessions}
              setSessions={setSessions}
              papers={papers}
              papersLoading={papersLoading}
            />
          )}
        </div>

        {/* 按钮 */}
        <DialogFooter className="flex justify-between">
          <div>
            {step > 1 && (
              <Button variant="outline" onClick={handlePrev}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                上一步
              </Button>
            )}
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            {step < 4 ? (
              <Button onClick={handleNext}>
                下一步
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "保存中..." : "保存"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// 第一步组件
const Step1Content = ({
  basicInfo,
  setBasicInfo,
}: {
  basicInfo: ExamBasicInfo;
  setBasicInfo: (info: ExamBasicInfo) => void;
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>考试名称 *</Label>
        <Input
          value={basicInfo.examName}
          onChange={(e) =>
            setBasicInfo({ ...basicInfo, examName: e.target.value })
          }
          placeholder="请输入考试名称"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>开始时间 *</Label>
          <Input
            type="datetime-local"
            value={basicInfo.startTime}
            onChange={(e) =>
              setBasicInfo({ ...basicInfo, startTime: e.target.value })
            }
          />
        </div>
        <div>
          <Label>结束时间 *</Label>
          <Input
            type="datetime-local"
            value={basicInfo.endTime}
            onChange={(e) =>
              setBasicInfo({ ...basicInfo, endTime: e.target.value })
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>考试时长（分钟）</Label>
          <Input
            type="number"
            value={basicInfo.duration}
            onChange={(e) =>
              setBasicInfo({
                ...basicInfo,
                duration: parseInt(e.target.value) || 0,
              })
            }
          />
        </div>
        <div>
          <Label>考试类型</Label>
          <select
            value={basicInfo.examType}
            onChange={(e) =>
              setBasicInfo({
                ...basicInfo,
                examType: parseInt(e.target.value),
              })
            }
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value={1}>正式考试</option>
            <option value={2}>模拟考试</option>
            <option value={3}>练习</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>总分</Label>
          <Input
            type="number"
            value={basicInfo.totalScore}
            onChange={(e) =>
              setBasicInfo({
                ...basicInfo,
                totalScore: parseFloat(e.target.value) || 0,
              })
            }
          />
        </div>
        <div>
          <Label>及格分数</Label>
          <Input
            type="number"
            value={basicInfo.passScore}
            onChange={(e) =>
              setBasicInfo({
                ...basicInfo,
                passScore: parseFloat(e.target.value) || 0,
              })
            }
          />
        </div>
      </div>

      <div>
        <Label>考试描述</Label>
        <textarea
          value={basicInfo.description}
          onChange={(e) =>
            setBasicInfo({ ...basicInfo, description: e.target.value })
          }
          placeholder="请输入考试描述"
          className="w-full px-3 py-2 border rounded-md"
          rows={3}
        />
      </div>
    </div>
  );
};

// 第二步组件
const Step2Content = ({
  sessions,
  setSessions,
  currentSessionIndex,
  setCurrentSessionIndex,
  addSession,
  deleteSession,
}: {
  sessions: ExamSession[];
  setSessions: (sessions: ExamSession[]) => void;
  currentSessionIndex: number;
  setCurrentSessionIndex: (index: number) => void;
  addSession: () => void;
  deleteSession: (index: number) => void;
}) => {
  const currentSession = sessions[currentSessionIndex];

  return (
    <div className="space-y-4">
      {/* 考场列表 */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <Label>考场列表</Label>
          <Button size="sm" onClick={addSession}>
            <Plus className="w-4 h-4 mr-1" />
            添加考场
          </Button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {sessions.map((session, index) => (
            <Badge
              key={index}
              variant={currentSessionIndex === index ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setCurrentSessionIndex(index)}
            >
              {session.sessionName || `考场${index + 1}`}
            </Badge>
          ))}
        </div>
      </div>

      {/* 当前考场编辑 */}
      {currentSession && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              编辑考场 {currentSessionIndex + 1}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>考场名称 *</Label>
              <Input
                value={currentSession.sessionName}
                onChange={(e) => {
                  const newSessions = [...sessions];
                  newSessions[currentSessionIndex].sessionName = e.target.value;
                  setSessions(newSessions);
                }}
                placeholder="请输入考场名称"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>开始时间 *</Label>
                <Input
                  type="datetime-local"
                  value={currentSession.startTime}
                  onChange={(e) => {
                    const newSessions = [...sessions];
                    newSessions[currentSessionIndex].startTime = e.target.value;
                    setSessions(newSessions);
                  }}
                />
              </div>
              <div>
                <Label>结束时间 *</Label>
                <Input
                  type="datetime-local"
                  value={currentSession.endTime}
                  onChange={(e) => {
                    const newSessions = [...sessions];
                    newSessions[currentSessionIndex].endTime = e.target.value;
                    setSessions(newSessions);
                  }}
                />
              </div>
            </div>

            <div>
              <Label>考试地点</Label>
              <Input
                value={currentSession.location}
                onChange={(e) => {
                  const newSessions = [...sessions];
                  newSessions[currentSessionIndex].location = e.target.value;
                  setSessions(newSessions);
                }}
                placeholder="请输入考试地点"
              />
            </div>

            <div>
              <Label>最大考生人数</Label>
              <Input
                type="number"
                value={currentSession.seatLimit}
                onChange={(e) => {
                  const newSessions = [...sessions];
                  newSessions[currentSessionIndex].seatLimit =
                    parseInt(e.target.value) || 0;
                  setSessions(newSessions);
                }}
              />
            </div>

            {sessions.length > 1 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteSession(currentSessionIndex)}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                删除考场
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// 第三步组件
const Step3Content = ({
  sessions,
  setSessions,
  currentSessionIndex,
  setCurrentSessionIndex,
  users,
  usersLoading,
  addParticipant,
  deleteParticipant,
}: {
  sessions: ExamSession[];
  setSessions: (sessions: ExamSession[]) => void;
  currentSessionIndex: number;
  setCurrentSessionIndex: (index: number) => void;
  users: User[];
  usersLoading: boolean;
  addParticipant: () => void;
  deleteParticipant: (index: number) => void;
}) => {
  const currentSession = sessions[currentSessionIndex];

  return (
    <div className="space-y-4">
      {/* 考场选择 */}
      <div>
        <Label>选择考场</Label>
        <div className="flex gap-2 flex-wrap">
          {sessions.map((session, index) => (
            <Badge
              key={index}
              variant={currentSessionIndex === index ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setCurrentSessionIndex(index)}
            >
              {session.sessionName || `考场${index + 1}`} (
              {session.participants.length}人)
            </Badge>
          ))}
        </div>
      </div>

      {/* 考生列表 */}
      {currentSession && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">
                {currentSession.sessionName || `考场${currentSessionIndex + 1}`}
                的考生
              </CardTitle>
              <Button size="sm" onClick={addParticipant}>
                <Plus className="w-4 h-4 mr-1" />
                添加考生
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {currentSession.participants.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                还没有添加考生，点击"添加考生"按钮添加
              </p>
            ) : (
              <div className="space-y-2">
                {currentSession.participants.map((participant, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <select
                        value={participant.userId}
                        onChange={(e) => {
                          const selectedUser = users.find(
                            (u) => u.id.toString() === e.target.value
                          );
                          const newSessions = [...sessions];
                          newSessions[currentSessionIndex].participants[
                            index
                          ].userId = parseInt(e.target.value);
                          newSessions[currentSessionIndex].participants[
                            index
                          ].username = selectedUser?.real_name || "";
                          setSessions(newSessions);
                        }}
                        className="w-full px-3 py-2 border rounded-md"
                        disabled={usersLoading}
                      >
                        <option value={0}>
                          {usersLoading ? "加载中..." : "选择考生"}
                        </option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.real_name} ({user.username})
                          </option>
                        ))}
                      </select>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteParticipant(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// 第四步组件
const Step4Content = ({
  sessions,
  setSessions,
  papers,
  papersLoading,
}: {
  sessions: ExamSession[];
  setSessions: (sessions: ExamSession[]) => void;
  papers: Paper[];
  papersLoading: boolean;
}) => {
  return (
    <div className="space-y-4">
      {sessions.map((session, sessionIndex) => (
        <Card key={sessionIndex}>
          <CardHeader>
            <CardTitle className="text-base">
              {session.sessionName || `考场${sessionIndex + 1}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {session.participants.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                该考场还没有考生
              </p>
            ) : (
              <div className="space-y-2">
                {session.participants.map((participant, participantIndex) => (
                  <div
                    key={participantIndex}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{participant.username}</p>
                      <p className="text-sm text-gray-500">
                        准考证号: {participant.admissionNumber || "-"}
                      </p>
                    </div>
                    <select
                      value={participant.paperId}
                      onChange={(e) => {
                        const selectedPaper = papers.find(
                          (p) => p.id === parseInt(e.target.value)
                        );
                        const newSessions = [...sessions];
                        newSessions[sessionIndex].participants[
                          participantIndex
                        ].paperId = parseInt(e.target.value);
                        newSessions[sessionIndex].participants[
                          participantIndex
                        ].paperName = selectedPaper?.name || "";
                        setSessions(newSessions);
                      }}
                      className="px-3 py-2 border rounded-md"
                      disabled={papersLoading}
                    >
                      <option value={0}>
                        {papersLoading ? "加载中..." : "选择试卷"}
                      </option>
                      {papers.map((paper) => (
                        <option key={paper.id} value={paper.id}>
                          {paper.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CreateExamDialog;

