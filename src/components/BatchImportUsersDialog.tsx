import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { userApi } from "@/services/api";
import { generateUserTemplate, parseCSVFile, validateUserData } from "@/utils/excelTemplates";
import { Loader2, Download, Upload, AlertCircle, CheckCircle } from "lucide-react";

interface BatchImportUsersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const BatchImportUsersDialog = ({ isOpen, onClose, onSuccess }: BatchImportUsersDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"upload" | "preview" | "result">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [importResult, setImportResult] = useState<any>(null);

  const handleDownloadTemplate = () => {
    generateUserTemplate();
    toast({ title: "成功", description: "模板已下载" });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".csv")) {
      toast({ title: "错误", description: "请上传 CSV 文件", variant: "destructive" });
      return;
    }

    setFile(selectedFile);

    try {
      const data = await parseCSVFile(selectedFile);
      const validation = validateUserData(data);

      if (!validation.valid) {
        setValidationErrors(validation.errors);
        setPreviewData([]);
        toast({ title: "验证失败", description: `发现 ${validation.errors.length} 个错误`, variant: "destructive" });
        return;
      }

      setPreviewData(data);
      setValidationErrors([]);
      setStep("preview");
      toast({ title: "成功", description: `成功读取 ${data.length} 条记录` });
    } catch (error: any) {
      toast({ title: "错误", description: error.message || "文件解析失败", variant: "destructive" });
    }
  };

  const handleImport = async () => {
    if (previewData.length === 0) return;

    setLoading(true);
    try {
      console.log("📤 开始批量导入用户，共", previewData.length, "条记录");
      const response: any = await userApi.importUsers({
        users: previewData,
      });

      if (response.code === 0 && response.data) {
        console.log("✅ 批量导入成功:", response.data);
        setImportResult(response.data);
        setStep("result");
        toast({ title: "成功", description: `成功导入 ${response.data.success_count} 条记录` });
      } else {
        toast({ title: "错误", description: response.msg || "导入失败", variant: "destructive" });
      }
    } catch (error) {
      console.error("❌ 批量导入失败:", error);
      toast({ title: "错误", description: "导入失败", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep("upload");
    setFile(null);
    setPreviewData([]);
    setValidationErrors([]);
    setImportResult(null);
    onClose();
  };

  const handleFinish = () => {
    onSuccess();
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-700 mb-4">批量导入用户</h2>

        {/* 上传步骤 */}
        {step === "upload" && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                📋 请先下载模板，按照模板格式填写用户信息，然后上传 CSV 文件
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleDownloadTemplate}
                variant="outline"
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                下载模板
              </Button>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">点击选择文件或拖拽上传</p>
                <p className="text-xs text-gray-500 mt-1">支持 CSV 格式</p>
              </label>
            </div>

            {file && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800">✅ 已选择文件: {file.name}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                取消
              </Button>
            </div>
          </div>
        )}

        {/* 预览步骤 */}
        {step === "preview" && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                📊 预览数据，共 {previewData.length} 条记录
              </p>
            </div>

            {/* 数据预览表格 */}
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 py-2 text-left">用户名</th>
                    <th className="px-4 py-2 text-left">邮箱</th>
                    <th className="px-4 py-2 text-left">手机号</th>
                    <th className="px-4 py-2 text-left">真实姓名</th>
                    <th className="px-4 py-2 text-left">用户类型</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.slice(0, 5).map((row, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{row.username}</td>
                      <td className="px-4 py-2">{row.email || "-"}</td>
                      <td className="px-4 py-2">{row.phone || "-"}</td>
                      <td className="px-4 py-2">{row.realName || "-"}</td>
                      <td className="px-4 py-2">{row.userType || "user"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {previewData.length > 5 && (
              <p className="text-sm text-gray-500 text-center">
                ... 还有 {previewData.length - 5} 条记录
              </p>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep("upload")}
                className="flex-1"
              >
                返回
              </Button>
              <Button
                onClick={handleImport}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    导入中...
                  </>
                ) : (
                  "确认导入"
                )}
              </Button>
            </div>
          </div>
        )}

        {/* 结果步骤 */}
        {step === "result" && importResult && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{importResult.success_count}</p>
                <p className="text-sm text-green-700">成功导入</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-red-600">{importResult.failed_count}</p>
                <p className="text-sm text-red-700">导入失败</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-gray-600">{importResult.total_count}</p>
                <p className="text-sm text-gray-700">总计</p>
              </div>
            </div>

            {/* 失败信息 */}
            {importResult.failed_users && importResult.failed_users.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <p className="font-medium text-red-800">导入失败的记录</p>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {importResult.failed_users.map((item: any, index: number) => (
                    <div key={index} className="text-sm text-red-700">
                      <p>
                        <span className="font-medium">第 {item.row_number} 行</span> - {item.username}: {item.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 成功信息 */}
            {importResult.success_users && importResult.success_users.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <p className="font-medium text-green-800">成功导入的用户</p>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {importResult.success_users.slice(0, 5).map((user: any, index: number) => (
                    <div key={index} className="text-sm text-green-700">
                      <p>{user.username} ({user.real_name || "无"})</p>
                    </div>
                  ))}
                  {importResult.success_users.length > 5 && (
                    <p className="text-sm text-green-600">... 还有 {importResult.success_users.length - 5} 个用户</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                关闭
              </Button>
              <Button
                onClick={handleFinish}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                完成
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchImportUsersDialog;

