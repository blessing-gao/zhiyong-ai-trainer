import React, { useState } from "react";
import { SubtaskTab } from "@/types/course";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download, MessageCircle } from "lucide-react";

interface PdfViewerProps {
  tab: SubtaskTab;
  onProgress?: (progress: number) => void;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ tab, onProgress }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(10); // Mock 总页数

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const progress = (page / totalPages) * 100;
    onProgress?.(Math.round(progress));
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 工具栏 */}
      <div className="border-b px-4 py-3 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-600">
            第 {currentPage} / {totalPages} 页
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" title="下载">
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" title="问助教">
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* PDF 嵌入 */}
      <div className="flex-1 overflow-hidden">
        <iframe
          src={tab.source?.iframeSrc}
          className="w-full h-full border-0"
          title={tab.title}
          sandbox="allow-same-origin allow-scripts allow-popups"
        />
      </div>
    </div>
  );
};

export default PdfViewer;

