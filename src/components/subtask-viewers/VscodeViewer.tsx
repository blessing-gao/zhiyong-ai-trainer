import React, { useState } from "react";
import { SubtaskTab } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Play, Download, MessageCircle } from "lucide-react";

interface VscodeViewerProps {
  tab: SubtaskTab;
  onProgress?: (progress: number) => void;
}

const VscodeViewer: React.FC<VscodeViewerProps> = ({ tab, onProgress }) => {
  const [isLaunching, setIsLaunching] = useState(false);
  const [isLaunched, setIsLaunched] = useState(false);

  const handleLaunchVscode = async () => {
    setIsLaunching(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLaunching(false);
    setIsLaunched(true);
    onProgress?.(50);
  };

  if (!isLaunched) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="border-b px-4 py-3 flex items-center justify-between bg-gray-50">
          <span className="text-sm font-medium">VS Code Web IDE</span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4 text-4xl">⚙️</div>
            <h3 className="text-lg font-semibold mb-2">启动 VS Code</h3>
            <p className="text-gray-600 mb-6 max-w-sm">
              点击下方按钮启动 VS Code Web IDE，进行代码编辑和调试。
            </p>
            <Button
              onClick={handleLaunchVscode}
              disabled={isLaunching}
              className="gap-2"
            >
              <Play className="w-4 h-4" />
              {isLaunching ? "正在启动..." : "启动 VS Code"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b px-4 py-3 flex items-center justify-between bg-gray-50">
        <span className="text-sm font-medium">VS Code Web IDE - 运行中</span>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" title="下载">
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" title="问助教">
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>
      </div>
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

export default VscodeViewer;

