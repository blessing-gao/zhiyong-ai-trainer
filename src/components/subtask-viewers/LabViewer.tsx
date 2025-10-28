import React, { useState } from "react";
import { SubtaskTab } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, MessageCircle } from "lucide-react";

interface LabViewerProps {
  tab: SubtaskTab;
  onProgress?: (progress: number) => void;
}

const LabViewer: React.FC<LabViewerProps> = ({ tab, onProgress }) => {
  const [isLaunching, setIsLaunching] = useState(false);
  const [isLaunched, setIsLaunched] = useState(false);

  const handleLaunchLab = async () => {
    setIsLaunching(true);
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
        <div className="border-b px-4 py-3 flex items-center justify-between bg-gray-50">
          <span className="text-sm font-medium">实验环境</span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4 text-4xl">🧪</div>
            <h3 className="text-lg font-semibold mb-2">启动实验环境</h3>
            <p className="text-gray-600 mb-6 max-w-sm">
              点击下方按钮启动实验环境，进行动手实践。
            </p>
            <Button
              onClick={handleLaunchLab}
              disabled={isLaunching}
              className="gap-2"
            >
              <Play className="w-4 h-4" />
              {isLaunching ? "正在启动..." : "启动实验"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b px-4 py-3 flex items-center justify-between bg-gray-50">
        <span className="text-sm font-medium">实验环境 - 运行中</span>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleReset} title="重置">
            <RotateCcw className="w-4 h-4" />
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

export default LabViewer;

