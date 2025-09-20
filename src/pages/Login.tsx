import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, Shield, Clipboard } from "lucide-react";

export const Login = () => {
  const { type } = useParams<{ type: 'student' | 'admin' | 'exam' }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    examCode: ''
  });

  const getLoginConfig = () => {
    switch (type) {
      case 'student':
        return {
          title: '学生登录',
          description: '登录后可访问课程中心、训练中心等学习功能',
          icon: User,
          fields: ['username', 'password']
        };
      case 'admin':
        return {
          title: '管理员登录',
          description: '管理员专用登录入口，管理系统和用户',
          icon: Shield,
          fields: ['username', 'password']
        };
      case 'exam':
        return {
          title: '考试登录',
          description: '使用管理员分配的考试账号登录参加正式考试',
          icon: Clipboard,
          fields: ['username', 'password', 'examCode']
        };
      default:
        return {
          title: '登录',
          description: '请选择登录类型',
          icon: User,
          fields: []
        };
    }
  };

  const config = getLoginConfig();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 模拟登录验证
    if (!formData.username || !formData.password) {
      toast({
        title: "登录失败",
        description: "请填写完整的登录信息",
        variant: "destructive"
      });
      return;
    }

    if (type === 'exam' && !formData.examCode) {
      toast({
        title: "登录失败", 
        description: "请输入考试代码",
        variant: "destructive"
      });
      return;
    }

    // 模拟成功登录
    toast({
      title: "登录成功",
      description: `欢迎${type === 'admin' ? '管理员' : ''}登录智涌·人工智能中心`
    });

    // 根据登录类型跳转
    if (type === 'admin') {
      navigate('/admin');
    } else if (type === 'exam') {
      navigate('/exam/start');
    } else {
      navigate('/');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-strong">
        <CardHeader className="text-center">
          <div className="gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <config.icon className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl">{config.title}</CardTitle>
          <CardDescription>{config.description}</CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {config.fields.includes('username') && (
              <div className="space-y-2">
                <Label htmlFor="username">用户名</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="请输入用户名"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  required
                />
              </div>
            )}
            
            {config.fields.includes('password') && (
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="请输入密码"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />
              </div>
            )}
            
            {config.fields.includes('examCode') && (
              <div className="space-y-2">
                <Label htmlFor="examCode">考试代码</Label>
                <Input
                  id="examCode"
                  type="text"
                  placeholder="请输入考试代码"
                  value={formData.examCode}
                  onChange={(e) => handleInputChange('examCode', e.target.value)}
                  required
                />
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full gradient-primary text-white hover:opacity-90"
            >
              登录
            </Button>
            
            {type === 'student' && (
              <div className="text-center text-sm text-muted-foreground">
                还没有账号？
                <Button variant="link" className="p-0 h-auto text-primary">
                  立即注册
                </Button>
              </div>
            )}
            
            <div className="text-center">
              <Button 
                type="button"
                variant="link" 
                onClick={() => navigate('/')}
                className="text-muted-foreground"
              >
                返回首页
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};