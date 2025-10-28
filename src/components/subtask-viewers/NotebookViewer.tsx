import React, { useState } from "react";
import { SubtaskTab } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Download, MessageCircle } from "lucide-react";

interface NotebookViewerProps {
  tab: SubtaskTab;
  onProgress?: (progress: number) => void;
}

const NotebookViewer: React.FC<NotebookViewerProps> = ({ tab, onProgress }) => {
  const [isLaunching, setIsLaunching] = useState(false);
  const [isLaunched, setIsLaunched] = useState(false);

  const handleLaunchNotebook = async () => {
    setIsLaunching(true);
    // 模拟启动延迟
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLaunching(false);
    setIsLaunched(true);
    onProgress?.(50);
  };

  const handleReset = () => {
    setIsLaunched(false);
    onProgress?.(0);
  };

  if (!isLaunched) {
    return (
      <div className="h-full flex flex-col bg-white">
        {/* 工具栏 */}
        <div className="border-b px-4 py-3 flex items-center justify-between bg-gray-50">
          <span className="text-sm font-medium">Jupyter Notebook</span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" title="问助教">
              <MessageCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* 启动卡片 */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4 text-4xl">💻</div>
            <h3 className="text-lg font-semibold mb-2">启动 Jupyter Notebook</h3>
            <p className="text-gray-600 mb-6 max-w-sm">
              点击下方按钮启动 Notebook 环境，开始交互式编程学习。环境将在新标签页中打开。
            </p>
            <Button
              onClick={handleLaunchNotebook}
              disabled={isLaunching}
              className="gap-2"
            >
              <Play className="w-4 h-4" />
              {isLaunching ? "正在启动..." : "启动 Notebook"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 工具栏 */}
      <div className="border-b px-4 py-3 flex items-center justify-between bg-gray-50">
        <span className="text-sm font-medium">Jupyter Notebook - 运行中</span>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleReset} title="重置">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" title="下载">
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" title="问助教">
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Notebook 嵌入 */}
      <div className="flex-1 overflow-hidden">
        <iframe
          src={tab.source?.iframeSrc}
          className="w-full h-full border-0"
          title={tab.title}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </div>
  );
};

export default NotebookViewer;

