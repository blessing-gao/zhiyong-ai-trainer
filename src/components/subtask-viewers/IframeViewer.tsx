import React, { useState } from "react";
import { SubtaskTab } from "@/types/course";
import { Button } from "@/components/ui/button";
import { RefreshCw, MessageCircle, ExternalLink } from "lucide-react";

interface IframeViewerProps {
  tab: SubtaskTab;
  onProgress?: (progress: number) => void;
}

const IframeViewer: React.FC<IframeViewerProps> = ({ tab, onProgress }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleRefresh = () => {
    setIsLoading(true);
    setError(null);
  };

  const handleOpenExternal = () => {
    if (tab.source?.iframeSrc) {
      window.open(tab.source.iframeSrc, "_blank");
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 工具栏 */}
      <div className="border-b px-4 py-3 flex items-center justify-between bg-gray-50">
        <span className="text-sm font-medium">{tab.title}</span>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleRefresh} title="刷新">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleOpenExternal} title="在新标签页打开">
            <ExternalLink className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" title="问助教">
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin text-2xl mb-2">⏳</div>
              <p className="text-gray-600">加载中...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 bg-red-50 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="text-2xl mb-2">⚠️</div>
              <p className="text-red-600">{error}</p>
              <Button onClick={handleRefresh} className="mt-4">
                重试
              </Button>
            </div>
          </div>
        )}

        <iframe
          src={tab.source?.iframeSrc}
          className="w-full h-full border-0"
          title={tab.title}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setError("加载失败，请检查网络连接或稍后重试");
          }}
        />
      </div>
    </div>
  );
};

export default IframeViewer;

