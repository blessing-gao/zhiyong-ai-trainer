import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { examApi } from "@/services/api";
import { Download, Loader2, AlertCircle } from "lucide-react";

interface ExamPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  examId: number;
}

interface ExamInfo {
  id: number;
  examName: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalScore: number;
  passScore: number;
  examType: number;
  status: number;
  description?: string;
}

interface ParticipantInfo {
  id: number;
  username: string;
  paperId: number;
  admissionNumber: string;
  password: string;
  seatNumber?: string;
}

interface SessionInfo {
  session: {
    id: number;
    sessionName: string;
    startTime: string;
    endTime: string;
    location?: string;
    seatLimit?: number;
  };
  participants: ParticipantInfo[];
}

interface PreviewData {
  exam: ExamInfo;
  sessions: SessionInfo[];
}

const ExamPreviewDialog = ({ open, onOpenChange, examId }: ExamPreviewDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);

  // 加载预览数据
  useEffect(() => {
    if (open && examId) {
      loadPreviewData();
    }
  }, [open, examId]);

  // 设置默认选中的考场
  useEffect(() => {
    if (previewData && previewData.sessions.length > 0 && !selectedSessionId) {
      setSelectedSessionId(previewData.sessions[0].session.id);
    }
  }, [previewData, selectedSessionId]);

  const loadPreviewData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: any = await examApi.getExamPreview(examId);
      if (response.code === 0 && response.data) {
        setPreviewData(response.data);
      } else {
        setError(response.msg || "加载预览数据失败");
      }
    } catch (err) {
      setError("加载预览数据失败，请重试");
      console.error("Failed to load preview data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await fetch(`http://localhost:8081/api/exams/${examId}/export-participants`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `participants_${examId}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        setError("导出失败，请重试");
      }
    } catch (err) {
      setError("导出失败，请重试");
      console.error("Failed to export:", err);
    } finally {
      setExporting(false);
    }
  };

  const formatDateTime = (dateTime: string) => {
    if (!dateTime) return "-";
    const date = new Date(dateTime);
    return date.toLocaleString("zh-CN");
  };

  const getStatusBadge = (status: number) => {
    const statusMap: Record<number, { label: string; variant: any }> = {
      1: { label: "未开始", variant: "outline" },
      2: { label: "进行中", variant: "default" },
      3: { label: "已结束", variant: "secondary" },
    };
    const statusInfo = statusMap[status] || { label: "未知", variant: "outline" };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const currentSession = previewData?.sessions.find(
    (s) => s.session.id === selectedSessionId
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>考试预览</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">加载中...</span>
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-600">{error}</span>
          </div>
        ) : previewData ? (
          <div className="space-y-6">
            {/* 考试基本信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">考试基本信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">考试名称</p>
                    <p className="font-medium">{previewData.exam.examName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">考试状态</p>
                    <p>{getStatusBadge(previewData.exam.status)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">开始时间</p>
                    <p className="font-medium">{formatDateTime(previewData.exam.startTime)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">结束时间</p>
                    <p className="font-medium">{formatDateTime(previewData.exam.endTime)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">考试时长</p>
                    <p className="font-medium">{previewData.exam.duration} 分钟</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">总分/及格分</p>
                    <p className="font-medium">
                      {previewData.exam.totalScore} / {previewData.exam.passScore}
                    </p>
                  </div>
                </div>
                {previewData.exam.description && (
                  <div>
                    <p className="text-sm text-gray-500">考试说明</p>
                    <p className="font-medium">{previewData.exam.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 考场和考生信息 */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">考场和考生信息</CardTitle>
                <Button
                  size="sm"
                  onClick={handleExport}
                  disabled={exporting}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  {exporting ? "导出中..." : "导出考生信息"}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 考场选择 */}
                <div className="flex gap-2 flex-wrap">
                  {previewData.sessions.map((session) => (
                    <Button
                      key={session.session.id}
                      variant={
                        selectedSessionId === session.session.id ? "default" : "outline"
                      }
                      onClick={() => setSelectedSessionId(session.session.id)}
                      className="text-sm"
                    >
                      {session.session.sessionName}
                      <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded">
                        {session.participants.length}人
                      </span>
                    </Button>
                  ))}
                </div>

                {/* 考生列表 */}
                {currentSession && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-3">
                      {currentSession.session.sessionName} - 考生列表
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                              序号
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                              考生姓名
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                              考试时间
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                              准考证号
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                              密码
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                              座位号
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {currentSession.participants.map((participant, index) => (
                            <tr key={participant.id}>
                              <td className="px-4 py-2">{index + 1}</td>
                              <td className="px-4 py-2">{participant.username}</td>
                              <td className="px-4 py-2 text-xs">
                                {formatDateTime(currentSession.session.startTime)} ~ {formatDateTime(currentSession.session.endTime)}
                              </td>
                              <td className="px-4 py-2 font-mono text-xs">
                                {participant.admissionNumber}
                              </td>
                              <td className="px-4 py-2 font-mono text-xs">
                                {participant.password}
                              </td>
                              <td className="px-4 py-2">{participant.seatNumber || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default ExamPreviewDialog;

