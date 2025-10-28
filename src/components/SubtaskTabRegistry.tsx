/**
 * 子任务 Tab 注册表
 * 将子任务类型映射到对应的渲染组件
 * 支持可插拔的组件扩展
 */

import React, { Suspense } from "react";
import { SubtaskTab } from "@/types/course";
import DocumentViewer from "./subtask-viewers/DocumentViewer";
import MarkdownViewer from "./subtask-viewers/MarkdownViewer";
import PdfViewer from "./subtask-viewers/PdfViewer";
import VideoViewer from "./subtask-viewers/VideoViewer";
import NotebookViewer from "./subtask-viewers/NotebookViewer";
import VscodeViewer from "./subtask-viewers/VscodeViewer";
import LabViewer from "./subtask-viewers/LabViewer";
import IframeViewer from "./subtask-viewers/IframeViewer";
import QuizViewer from "./subtask-viewers/QuizViewer";

// Skeleton 占位符
const TabSkeleton = () => (
  <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
    <div className="text-gray-400">加载中...</div>
  </div>
);

// 子任务类型到组件的映射
export const TAB_REGISTRY: Record<string, React.FC<{ tab: SubtaskTab; onProgress?: (progress: number) => void }>> = {
  document: DocumentViewer,
  markdown: MarkdownViewer,
  pdf: PdfViewer,
  video: VideoViewer,
  notebook: NotebookViewer,
  vscode: VscodeViewer,
  lab: LabViewer,
  iframe: IframeViewer,
  quiz: QuizViewer,
  annotation: IframeViewer, // 标注工具也用 iframe
  agent: IframeViewer, // 智能体构建器也用 iframe
};

// 获取子任务类型对应的图标
export const getTabIcon = (type: string) => {
  const icons: Record<string, string> = {
    document: "📄",
    markdown: "📝",
    pdf: "📕",
    video: "🎥",
    notebook: "💻",
    vscode: "⚙️",
    lab: "🧪",
    iframe: "🌐",
    quiz: "❓",
    annotation: "🏷️",
    agent: "🤖",
  };
  return icons[type] || "📌";
};

// 获取子任务类型的显示名称
export const getTabTypeName = (type: string) => {
  const names: Record<string, string> = {
    document: "文档",
    markdown: "Markdown",
    pdf: "PDF",
    video: "视频",
    notebook: "Notebook",
    vscode: "VS Code",
    lab: "实验",
    iframe: "嵌入内容",
    quiz: "测验",
    annotation: "标注",
    agent: "智能体",
  };
  return names[type] || type;
};

// 渲染子任务 Tab 内容
export const renderSubtaskTab = (tab: SubtaskTab, onProgress?: (progress: number) => void) => {
  const Component = TAB_REGISTRY[tab.type] || IframeViewer;
  
  return (
    <Suspense fallback={<TabSkeleton />}>
      <Component tab={tab} onProgress={onProgress} />
    </Suspense>
  );
};

