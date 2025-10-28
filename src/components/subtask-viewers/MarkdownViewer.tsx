import React, { useEffect, useState } from "react";
import { SubtaskTab } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Copy, MessageCircle } from "lucide-react";

interface MarkdownViewerProps {
  tab: SubtaskTab;
  onProgress?: (progress: number) => void;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ tab, onProgress }) => {
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

    const container = document.getElementById("markdown-content");
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [onProgress]);

  // 简单的 Markdown 转 HTML（实际项目应使用 marked 或 remark）
  const markdownToHtml = (md: string) => {
    let html = md
      .replace(/^### (.*?)$/gm, "<h3>$1</h3>")
      .replace(/^## (.*?)$/gm, "<h2>$1</h2>")
      .replace(/^# (.*?)$/gm, "<h1>$1</h1>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, "<code>$1</code>")
      .replace(/```(.*?)```/gs, "<pre><code>$1</code></pre>")
      .replace(/\n\n/g, "</p><p>")
      .replace(/^- (.*?)$/gm, "<li>$1</li>");
    
    return `<p>${html}</p>`;
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 工具栏 */}
      <div className="border-b px-4 py-3 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">阅读进度: {Math.round(scrollProgress)}%</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" title="复制">
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" title="问助教">
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 内容区域 */}
      <div
        id="markdown-content"
        className="flex-1 overflow-y-auto px-8 py-6"
      >
        <div
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(tab.source?.md || "") }}
        />
      </div>
    </div>
  );
};

export default MarkdownViewer;

