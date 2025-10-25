import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { userApi } from "@/services/api";
import { Loader2 } from "lucide-react";

interface AddUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddUserDialog = ({ isOpen, onClose, onSuccess }: AddUserDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    phone: "",
    realName: "",
    userType: "user",
    status: 1,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "status" ? parseInt(value) : value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.username.trim()) {
      toast({ title: "错误", description: "用户名不能为空", variant: "destructive" });
      return false;
    }

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(formData.username)) {
      toast({ title: "错误", description: "用户名只能包含字母、数字和下划线，长度3-20", variant: "destructive" });
      return false;
    }

    if (!formData.password.trim()) {
      toast({ title: "错误", description: "密码不能为空", variant: "destructive" });
      return false;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(formData.password)) {
      toast({ title: "错误", description: "密码至少8个字符，必须包含大小写字母和数字", variant: "destructive" });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({ title: "错误", description: "两次输入的密码不一致", variant: "destructive" });
      return false;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({ title: "错误", description: "邮箱格式不正确", variant: "destructive" });
      return false;
    }

    if (formData.phone && !/^1[3-9]\d{9}$/.test(formData.phone)) {
      toast({ title: "错误", description: "手机号格式不正确", variant: "destructive" });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response: any = await userApi.addUser({
        username: formData.username,
        password: formData.password,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        realName: formData.realName || undefined,
        userType: formData.userType,
        status: formData.status,
      });

      if (response.code === 0) {
        toast({ title: "成功", description: "用户添加成功" });
        setFormData({
          username: "",
          password: "",
          confirmPassword: "",
          email: "",
          phone: "",
          realName: "",
          userType: "user",
          status: 1,
        });
        onSuccess();
        onClose();
      } else {
        toast({ title: "错误", description: response.message || "添加用户失败", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "错误", description: "添加用户失败", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-gray-700 mb-4">添加用户</h2>

        <div className="space-y-4">
          {/* 用户名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              用户名 <span className="text-red-500">*</span>
            </label>
            <Input
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="3-20个字符，只能包含字母、数字和下划线"
              className="w-full"
            />
          </div>

          {/* 密码 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              密码 <span className="text-red-500">*</span>
            </label>
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="至少8个字符，必须包含大小写字母和数字"
              className="w-full"
            />
          </div>

          {/* 确认密码 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              确认密码 <span className="text-red-500">*</span>
            </label>
            <Input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="再次输入密码"
              className="w-full"
            />
          </div>

          {/* 真实姓名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">真实姓名</label>
            <Input
              name="realName"
              value={formData.realName}
              onChange={handleInputChange}
              placeholder="请输入真实姓名"
              className="w-full"
            />
          </div>

          {/* 邮箱 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="请输入邮箱地址"
              className="w-full"
            />
          </div>

          {/* 手机号 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">手机号</label>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="请输入手机号"
              className="w-full"
            />
          </div>

          {/* 用户类型 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">用户类型</label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="user">普通用户</option>
              <option value="admin">管理员</option>
            </select>
          </div>

          {/* 状态 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>启用</option>
              <option value={0}>禁用</option>
            </select>
          </div>
        </div>

        {/* 按钮 */}
        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                添加中...
              </>
            ) : (
              "添加用户"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddUserDialog;

