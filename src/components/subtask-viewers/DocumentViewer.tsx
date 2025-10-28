import React, { useEffect, useState } from "react";
import { SubtaskTab } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Share2, Download, MessageCircle } from "lucide-react";

interface DocumentViewerProps {
  tab: SubtaskTab;
  onProgress?: (progress: number) => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ tab, onProgress }) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const element = e.target as HTMLElement;
      const scrollTop = element.scrollTop;
      const scrollHeight = element.scrollHeight - element.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setScrollProgress(progress);
      onProgress?.(Math.round(progress));
    };

    const container = document.getElementById("document-content");
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [onProgress]);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 工具栏 */}
      <div className="border-b px-4 py-3 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">阅读进度: {Math.round(scrollProgress)}%</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" title="分享">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" title="下载">
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" title="问助教">
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 内容区域 */}
      <div
        id="document-content"
        className="flex-1 overflow-y-auto px-8 py-6"
      >
        <div
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: tab.source?.html || "" }}
        />
      </div>
    </div>
  );
};

export default DocumentViewer;

