import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ThirdLevelTagTree {
  id: number;
  name: string;
  code: string;
  description: string;
}

interface SecondLevelTagTree {
  id: number;
  name: string;
  code: string;
  description: string;
  children: ThirdLevelTagTree[];
}

interface FirstLevelTagTree {
  id: number;
  name: string;
  code: string;
  description: string;
  children: SecondLevelTagTree[];
}

interface TagTreeSelectorProps {
  tags: FirstLevelTagTree[];
  selectedTagId?: number;
  onSelectTag: (tagId: number, tagName: string, level: 'first' | 'second' | 'third') => void;
  loading?: boolean;
}

export const TagTreeSelector: React.FC<TagTreeSelectorProps> = ({
  tags,
  selectedTagId,
  onSelectTag,
  loading = false,
}) => {
  const [expandedFirstLevel, setExpandedFirstLevel] = useState<Set<number>>(new Set());
  const [expandedSecondLevel, setExpandedSecondLevel] = useState<Set<number>>(new Set());

  const toggleFirstLevel = (id: number) => {
    const newExpanded = new Set(expandedFirstLevel);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedFirstLevel(newExpanded);
  };

  const toggleSecondLevel = (id: number) => {
    const newExpanded = new Set(expandedSecondLevel);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSecondLevel(newExpanded);
  };

  return (
    <div className="border border-gray-300 rounded-md bg-white max-h-96 overflow-y-auto">
      {loading ? (
        <div className="p-4 text-center text-gray-500">加载中...</div>
      ) : tags.length === 0 ? (
        <div className="p-4 text-center text-gray-500">暂无知识点</div>
      ) : (
        <div className="p-2">
          {tags.map((firstLevel) => (
            <div key={firstLevel.id} className="mb-1">
              {/* 一级标签 */}
              <button
                onClick={() => toggleFirstLevel(firstLevel.id)}
                className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 flex items-center gap-2 ${
                  selectedTagId === firstLevel.id ? 'bg-blue-50 text-blue-700 font-medium' : ''
                }`}
              >
                <span className="flex-shrink-0">
                  {firstLevel.children && firstLevel.children.length > 0 ? (
                    expandedFirstLevel.has(firstLevel.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )
                  ) : (
                    <span className="w-4" />
                  )}
                </span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTag(firstLevel.id, firstLevel.name, 'first');
                  }}
                  className="flex-1 cursor-pointer"
                >
                  【一级】{firstLevel.name}
                </span>
              </button>

              {/* 二级标签 */}
              {expandedFirstLevel.has(firstLevel.id) && firstLevel.children && (
                <div className="ml-4">
                  {firstLevel.children.map((secondLevel) => (
                    <div key={secondLevel.id} className="mb-1">
                      <button
                        onClick={() => toggleSecondLevel(secondLevel.id)}
                        className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 flex items-center gap-2 ${
                          selectedTagId === secondLevel.id ? 'bg-blue-50 text-blue-700 font-medium' : ''
                        }`}
                      >
                        <span className="flex-shrink-0">
                          {secondLevel.children && secondLevel.children.length > 0 ? (
                            expandedSecondLevel.has(secondLevel.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )
                          ) : (
                            <span className="w-4" />
                          )}
                        </span>
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectTag(secondLevel.id, secondLevel.name, 'second');
                          }}
                          className="flex-1 cursor-pointer"
                        >
                          【二级】{secondLevel.name}
                        </span>
                      </button>

                      {/* 三级标签 */}
                      {expandedSecondLevel.has(secondLevel.id) && secondLevel.children && (
                        <div className="ml-4">
                          {secondLevel.children.map((thirdLevel) => (
                            <button
                              key={thirdLevel.id}
                              onClick={() => onSelectTag(thirdLevel.id, thirdLevel.name, 'third')}
                              className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 flex items-center gap-2 ${
                                selectedTagId === thirdLevel.id ? 'bg-blue-50 text-blue-700 font-medium' : ''
                              }`}
                            >
                              <span className="w-4" />
                              <span>【三级】{thirdLevel.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

