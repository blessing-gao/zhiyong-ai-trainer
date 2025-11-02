import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  CheckCircle,
  Lock,
  Lightbulb,
  Target,
  Loader2
} from "lucide-react";
import Header from "@/components/Header";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import { tagApi, questionApi } from "@/services/api";

interface FirstLevelTag {
  id: string | number;
  tagName: string;
  tagCode: string;
  description: string;
  sortOrder?: number;
}

interface SecondLevelTag {
  id: string | number;
  tagName: string;
  tagCode: string;
  description: string;
  sortOrder?: number;
}

const KnowledgeExplore = () => {
  const { applyRoleTheme } = useTheme();
  const navigate = useNavigate();
  const [firstLevelTags, setFirstLevelTags] = useState<FirstLevelTag[]>([]);
  const [secondLevelTags, setSecondLevelTags] = useState<SecondLevelTag[]>([]);
  const [selectedFirstLevelId, setSelectedFirstLevelId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingSecondLevel, setLoadingSecondLevel] = useState(false);

  // Apply theme based on user role
  useEffect(() => {
    applyRoleTheme();
  }, [applyRoleTheme]);

  // 加载一级标签
  useEffect(() => {
    const loadFirstLevelTags = async () => {
      try {
        setLoading(true);
        const response: any = await tagApi.getFirstLevelTags();
        if (response.code === 0 && response.data) {
          setFirstLevelTags(response.data);
          // 默认选中第一个一级标签
          if (response.data.length > 0) {
            setSelectedFirstLevelId(response.data[0].id);
            loadSecondLevelTags(response.data[0].id);
          }
        }
      } catch (error) {
        console.error("Failed to load first level tags:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFirstLevelTags();
  }, []);

  // 加载二级标签
  const loadSecondLevelTags = async (firstLevelId: number) => {
    try {
      setLoadingSecondLevel(true);
      const response: any = await tagApi.getSecondLevelTags(firstLevelId);
      if (response.code === 0 && response.data) {
        setSecondLevelTags(response.data);
      } else {
        setSecondLevelTags([]);
      }
    } catch (error) {
      console.error("Failed to load second level tags:", error);
      setSecondLevelTags([]);
    } finally {
      setLoadingSecondLevel(false);
    }
  };

  // 处理一级标签点击
  const handleFirstLevelClick = (firstLevelId: number) => {
    setSelectedFirstLevelId(firstLevelId);
    loadSecondLevelTags(firstLevelId);
  };

  // 处理学习按钮点击
  const handleLearnClick = async (secondLevelTagId: number, tagName: string) => {
    try {
      setLoadingSecondLevel(true);
      // 调用 API 获取该二级标签下的所有题目
      const response: any = await questionApi.getQuestionsBySecondLevelTag(secondLevelTagId);
      if (response.code === 0 && response.data) {
        // 将题目数据存储到 localStorage，供 PracticeModeChapter 页面使用
        localStorage.setItem(`questions_${secondLevelTagId}`, JSON.stringify(response.data));
        // 导航到刷题模式页面
        navigate(`/training/practice/${tagName}`, {
          state: {
            secondLevelTagId,
            questions: response.data
          }
        });
      }
    } catch (error) {
      console.error("Failed to load questions:", error);
    } finally {
      setLoadingSecondLevel(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero relative overflow-hidden flex items-center justify-center">
        <Header />
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-foreground">加载知识体系中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      <Header />

      <div className="px-[5%] py-[3%] pt-24 transition-all duration-300 relative z-10">
        {/* 头部信息 */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/training')}
            className="border-border text-foreground hover:bg-muted/50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回训练中心
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">知识探索</h1>
            <p className="text-muted-foreground">系统化学习AI知识体系</p>
          </div>
          
          <div className="w-[140px]"></div>
        </div>

        {/* 主体内容 - 左右分栏 */}
        <div className="grid md:grid-cols-4 gap-6">
          {/* 左侧：一级标签导航 */}
          <div className="md:col-span-1">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm sticky top-24">
              <CardHeader>
                <CardTitle className="text-foreground">知识体系</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {firstLevelTags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleFirstLevelClick(Number(tag.id))}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      selectedFirstLevelId === Number(tag.id)
                        ? 'bg-primary text-white'
                        : 'bg-white/5 text-foreground hover:bg-white/10'
                    }`}
                  >
                    <div className="font-medium text-sm">{tag.tagName}</div>
                    <div className="text-xs mt-1 opacity-75">{tag.description}</div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* 右侧：二级标签详情 */}
          <div className="md:col-span-3">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <div>
                  <CardTitle className="text-2xl text-foreground">
                    {firstLevelTags.find(t => Number(t.id) === selectedFirstLevelId)?.tagName || '选择知识体系'}
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    {firstLevelTags.find(t => Number(t.id) === selectedFirstLevelId)?.description || ''}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                {loadingSecondLevel ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                    <span className="text-muted-foreground">加载中...</span>
                  </div>
                ) : secondLevelTags.length > 0 ? (
                  <div className="space-y-4">
                    {secondLevelTags.map((tag) => (
                      <div
                        key={tag.id}
                        className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground">{tag.tagName}</h3>
                            <p className="text-sm text-muted-foreground mt-2">{tag.description}</p>
                          </div>
                          <Button
                            onClick={() => handleLearnClick(Number(tag.id), tag.tagName)}
                            disabled={loadingSecondLevel}
                            className="ml-4 bg-primary hover:bg-primary-dark"
                          >
                            {loadingSecondLevel ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                加载中...
                              </>
                            ) : (
                              <>
                                学习
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">暂无二级标签数据</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 学习建议 */}
        <div className="mt-8 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-6 w-6 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">学习建议</h3>
              <p className="text-sm text-muted-foreground">
                点击左侧知识体系中的一级标签，查看对应的二级标签。选择感兴趣的二级标签进行学习。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeExplore;

