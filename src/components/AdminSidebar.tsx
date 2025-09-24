import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  Users,
  BookOpen,
  Award,
  GraduationCap,
  Database,
  Settings,
  FileText,
  Activity,
  Calendar,
  MessageSquare,
  Shield,
  TrendingUp,
  Bell,
  Upload
} from "lucide-react";

// 管理菜单项配置
const menuItems = [
  {
    title: "仪表盘",
    url: "#dashboard",
    icon: BarChart3,
    description: "系统概览和数据统计"
  },
  {
    title: "用户管理",
    url: "#users",
    icon: Users,
    description: "学生和管理员账户管理"
  },
  {
    title: "课程管理",
    url: "#courses",
    icon: BookOpen,
    description: "课程内容和章节管理"
  },
  {
    title: "题库管理",
    url: "#questions",
    icon: Database,
    description: "试题和题库维护"
  },
  {
    title: "考试管理",
    url: "#exams",
    icon: Award,
    description: "考试场次和成绩管理"
  },
  {
    title: "证书管理",
    url: "#certificates",
    icon: GraduationCap,
    description: "认证证书颁发管理"
  },
  {
    title: "数据统计",
    url: "#analytics",
    icon: TrendingUp,
    description: "学习数据和系统分析"
  },
  {
    title: "内容管理",
    url: "#content",
    icon: FileText,
    description: "公告、通知等内容管理"
  },
  {
    title: "日志管理",
    url: "#logs",
    icon: Activity,
    description: "系统日志和操作记录"
  },
  {
    title: "系统设置",
    url: "#settings",
    icon: Settings,
    description: "平台配置和参数设置"
  }
];

const quickActions = [
  {
    title: "批量导入",
    url: "#import",
    icon: Upload,
    description: "批量导入用户或题目"
  },
  {
    title: "通知管理",
    url: "#notifications",
    icon: Bell,
    description: "发送系统通知"
  },
  {
    title: "安全管理",
    url: "#security",
    icon: Shield,
    description: "系统安全设置"
  },
  {
    title: "反馈管理",
    url: "#feedback",
    icon: MessageSquare,
    description: "用户反馈处理"
  }
];

interface AdminSidebarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  const { open: sidebarOpen } = useSidebar();
  const collapsed = !sidebarOpen;

  const handleMenuClick = (url: string) => {
    const section = url.replace('#', '');
    onSectionChange?.(section);
  };

  const isActive = (url: string) => {
    const section = url.replace('#', '');
    return activeSection === section;
  };

  return (
    <Sidebar className={collapsed ? "w-16" : "w-72"}>
      {/* 侧边栏头部 */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Settings className="h-6 w-6 text-primary" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-semibold text-lg">管理中心</h2>
              <p className="text-sm text-muted-foreground">系统管理控制台</p>
            </div>
          )}
        </div>
      </div>

      <SidebarContent className="px-2">
        {/* 主要功能 */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            主要功能
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className="h-12"
                  >
                    <button
                      onClick={() => handleMenuClick(item.url)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                        isActive(item.url)
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && (
                        <div className="flex-1 text-left">
                          <div className="font-medium">{item.title}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {item.description}
                          </div>
                        </div>
                      )}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 快捷操作 */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            快捷操作
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {quickActions.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className="h-10"
                  >
                    <button
                      onClick={() => handleMenuClick(item.url)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive(item.url)
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && (
                        <span className="font-medium text-sm">{item.title}</span>
                      )}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* 底部折叠按钮 */}
      <div className="mt-auto p-4 border-t">
        <SidebarTrigger className="w-full justify-center" />
      </div>
    </Sidebar>
  );
}