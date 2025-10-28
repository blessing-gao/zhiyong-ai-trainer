import React, { useState } from "react";
import { SubtaskTab } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, MessageCircle } from "lucide-react";

interface VideoViewerProps {
  tab: SubtaskTab;
  onProgress?: (progress: number) => void;
}

const VideoViewer: React.FC<VideoViewerProps> = ({ tab, onProgress }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [duration] = useState(tab.duration || 0);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = (time: number) => {
    setPlaybackTime(time);
    const progress = duration > 0 ? (time / duration) * 100 : 0;
    onProgress?.(Math.round(progress));
  };

  return (
    <div className="h-full flex flex-col bg-black">
      {/* 视频播放器 */}
      <div className="flex-1 flex items-center justify-center bg-black relative">
        <iframe
          src={tab.source?.iframeSrc}
          className="w-full h-full border-0"
          title={tab.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* 控制栏 */}
      <div className="bg-gray-900 px-4 py-3 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePlayPause}
            className="text-white hover:bg-gray-800"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <span className="text-sm">
            {Math.floor(playbackTime / 60)}:{String(Math.floor(playbackTime % 60)).padStart(2, "0")} / {Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, "0")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
            <Volume2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800" title="问助教">
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoViewer;

