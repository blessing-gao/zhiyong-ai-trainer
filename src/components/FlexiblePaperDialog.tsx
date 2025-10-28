import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, Trash2, X } from 'lucide-react';
import { paperApi, questionBankApi, questionApi, tagApi } from '@/services/api';
import { TagTreeSelector } from './TagTreeSelector';

interface FlexiblePaperDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaperSaved: () => void;
}

interface ExtractionRule {
  type: string;
  question_count: number;
  bank_id?: number;
  difficulty?: string;
  first_level_tag_id?: number;
  second_level_tag_id?: number;
  third_level_tag_id?: number;
  score_per_question: number;
  max_available_count?: number; // 该条件下的最大可用题目数
}

interface QuestionBankOption {
  id: number;
  name: string;
}

interface DifficultyOption {
  value: string;
  label: string;
}

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

interface RuleQueryState {
  [key: number]: {
    loading: boolean;
    availableCount: number;
  };
}

interface SelectedTag {
  id: number;
  name: string;
  level: 'first' | 'second' | 'third';
}

const FlexiblePaperDialog: React.FC<FlexiblePaperDialogProps> = ({
  open,
  onOpenChange,
  onPaperSaved,
}) => {
  const [step, setStep] = useState<'basic' | 'types' | 'rules' | 'preview' | 'save'>('basic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 基本信息
  const [paperName, setPaperName] = useState('');
  const [paperDescription, setPaperDescription] = useState('');
  const [paperType, setPaperType] = useState('exam');

  // 选择的题型
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // 抽题规则
  const [extractionRules, setExtractionRules] = useState<ExtractionRule[]>([]);
  const [questionBanks, setQuestionBanks] = useState<QuestionBankOption[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(false);

  // 知识点标签 - 分级加载
  const [firstLevelTags, setFirstLevelTags] = useState<any[]>([]);
  const [secondLevelTags, setSecondLevelTags] = useState<{ [key: number]: any[] }>({});
  const [thirdLevelTags, setThirdLevelTags] = useState<{ [key: number]: any[] }>({});
  const [loadingFirstLevelTags, setLoadingFirstLevelTags] = useState(false);
  const [loadingSecondLevelTags, setLoadingSecondLevelTags] = useState<{ [key: number]: boolean }>({});
  const [loadingThirdLevelTags, setLoadingThirdLevelTags] = useState<{ [key: number]: boolean }>({});

  const [ruleQueryState, setRuleQueryState] = useState<RuleQueryState>({});

  // 预览数据
  const [previewData, setPreviewData] = useState<any>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  // 保存配置
  const [duration, setDuration] = useState(90);
  const [saving, setSaving] = useState(false);

  const questionTypes = [
    { value: 'judge', label: '判断题' },
    { value: 'single', label: '单选题' },
    { value: 'multiple', label: '多选题' },
  ];

  const difficulties = [
    { value: 'easy', label: '简单' },
    { value: 'medium', label: '中等' },
    { value: 'hard', label: '困难' },
  ];

  // 监听extractionRules变化
  useEffect(() => {
    console.log('extractionRules 已更新:', extractionRules);
  }, [extractionRules]);

  // 加载题库列表和知识点标签
  useEffect(() => {
    if (open && step === 'rules') {
      loadQuestionBanks();
      loadFirstLevelTags();
    }
  }, [open, step]);

  const loadQuestionBanks = async () => {
    setLoadingBanks(true);
    try {
      const response = await questionBankApi.getAllBanks() as any;
      if (response.code === 0 && response.data) {
        setQuestionBanks(response.data);
      } else {
        console.error('加载题库失败:', response.message);
      }
    } catch (err) {
      console.error('加载题库失败:', err);
    } finally {
      setLoadingBanks(false);
    }
  };

  // 加载一级标签
  const loadFirstLevelTags = async () => {
    setLoadingFirstLevelTags(true);
    try {
      const response = await tagApi.getFirstLevelTags() as any;
      if (response.code === 0 && response.data) {
        setFirstLevelTags(response.data);
      } else {
        console.error('加载一级标签失败:', response.message);
      }
    } catch (err) {
      console.error('加载一级标签失败:', err);
    } finally {
      setLoadingFirstLevelTags(false);
    }
  };

  // 加载二级标签
  const loadSecondLevelTags = async (ruleIndex: number, firstLevelTagId: number) => {
    setLoadingSecondLevelTags(prev => ({ ...prev, [ruleIndex]: true }));
    try {
      const response = await tagApi.getSecondLevelTags(firstLevelTagId) as any;
      if (response.code === 0 && response.data) {
        setSecondLevelTags(prev => ({ ...prev, [ruleIndex]: response.data }));
      } else {
        console.error('加载二级标签失败:', response.message);
      }
    } catch (err) {
      console.error('加载二级标签失败:', err);
    } finally {
      setLoadingSecondLevelTags(prev => ({ ...prev, [ruleIndex]: false }));
    }
  };

  // 加载三级标签
  const loadThirdLevelTags = async (ruleIndex: number, secondLevelTagId: number) => {
    setLoadingThirdLevelTags(prev => ({ ...prev, [ruleIndex]: true }));
    try {
      const response = await tagApi.getThirdLevelTags(secondLevelTagId) as any;
      if (response.code === 0 && response.data) {
        setThirdLevelTags(prev => ({ ...prev, [ruleIndex]: response.data }));
      } else {
        console.error('加载三级标签失败:', response.message);
      }
    } catch (err) {
      console.error('加载三级标签失败:', err);
    } finally {
      setLoadingThirdLevelTags(prev => ({ ...prev, [ruleIndex]: false }));
    }
  };

  // 处理选择题型
  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  // 初始化抽题规则
  const handleInitializeRules = () => {
    const rules = selectedTypes.map(type => ({
      type,
      question_count: 10,
      score_per_question: 10,
      max_available_count: 0,
      bank_id: undefined,
      difficulty: undefined,
      third_level_tag_id: undefined,
    }));
    setExtractionRules(rules);
    setStep('rules');
  };

  // 查询符合条件的题目数量
  const queryAvailableQuestionCount = async (index: number, rule: ExtractionRule) => {
    setRuleQueryState(prev => ({
      ...prev,
      [index]: { loading: true, availableCount: 0 }
    }));

    try {
      console.log('查询条件:', {
        type: rule.type,
        difficulty: rule.difficulty,
        bank_id: rule.bank_id,
        first_level_tag_id: rule.first_level_tag_id,
        second_level_tag_id: rule.second_level_tag_id,
        third_level_tag_id: rule.third_level_tag_id
      });

      const response = await questionApi.listQuestions(
        1,
        1, // 只需要获取总数，pageSize设为1
        rule.type,
        rule.difficulty || undefined,
        rule.bank_id || undefined,
        undefined, // keyword
        undefined, // status
        undefined, // sortBy
        undefined, // sortOrder
        rule.first_level_tag_id || undefined,
        rule.second_level_tag_id || undefined,
        rule.third_level_tag_id || undefined
      ) as any;

      if (response.code === 0 && response.data) {
        const availableCount = response.data.total || 0;
        console.log('查询结果 - 可用题目数:', availableCount);

        setRuleQueryState(prev => ({
          ...prev,
          [index]: { loading: false, availableCount }
        }));

        // 如果用户设定的抽题数量超过了可用数量，自动调整
        const newRules = [...extractionRules];
        if (newRules[index].question_count > availableCount) {
          newRules[index].question_count = availableCount;
          setExtractionRules(newRules);
        }

        // 更新max_available_count
        newRules[index].max_available_count = availableCount;
        setExtractionRules(newRules);
      }
    } catch (err) {
      console.error('查询题目数量失败:', err);
      setRuleQueryState(prev => ({
        ...prev,
        [index]: { loading: false, availableCount: 0 }
      }));
    }
  };

  // 处理一级标签选择
  const handleFirstLevelTagChange = (index: number, tagId: number | undefined) => {
    const newRules = [...extractionRules];
    newRules[index].first_level_tag_id = tagId;
    newRules[index].second_level_tag_id = undefined;
    newRules[index].third_level_tag_id = undefined;
    setExtractionRules(newRules);

    setSecondLevelTags(prev => ({ ...prev, [index]: [] }));
    setThirdLevelTags(prev => ({ ...prev, [index]: [] }));

    if (tagId) {
      loadSecondLevelTags(index, tagId);
    }

    // 重新查询可用题目数量
    queryAvailableQuestionCount(index, newRules[index]);
  };

  // 处理二级标签选择
  const handleSecondLevelTagChange = (index: number, tagId: number | undefined) => {
    const newRules = [...extractionRules];
    newRules[index].second_level_tag_id = tagId;
    newRules[index].third_level_tag_id = undefined;
    setExtractionRules(newRules);

    setThirdLevelTags(prev => ({ ...prev, [index]: [] }));

    if (tagId) {
      loadThirdLevelTags(index, tagId);
    }

    // 重新查询可用题目数量
    queryAvailableQuestionCount(index, newRules[index]);
  };

  // 处理三级标签选择
  const handleThirdLevelTagChange = (index: number, tagId: number | undefined) => {
    const newRules = [...extractionRules];
    newRules[index].third_level_tag_id = tagId;
    setExtractionRules(newRules);

    // 重新查询可用题目数量
    queryAvailableQuestionCount(index, newRules[index]);
  };

  // 更新抽题规则
  const updateRule = (index: number, field: string, value: any) => {
    console.log(`更新规则 - 索引: ${index}, 字段: ${field}, 值: ${value}`);
    const newRules = [...extractionRules];

    // 先更新状态
    if (field === 'question_count') {
      // 如果修改了抽题数量，检查是否超过最大值
      const maxCount = newRules[index].max_available_count || 0;
      if (value > maxCount && maxCount > 0) {
        newRules[index][field] = maxCount;
      } else {
        newRules[index][field] = value;
      }
    } else {
      newRules[index][field] = value;
    }

    console.log(`更新后的规则:`, newRules[index]);

    // 立即更新状态，确保UI能显示选中的值
    setExtractionRules(newRules);

    // 如果修改了条件（题库、难度），需要重新查询可用题目数量
    if (['bank_id', 'difficulty'].includes(field)) {
      queryAvailableQuestionCount(index, newRules[index]);
    }
  };

  // 生成预览
  const handleGeneratePreview = async () => {
    setPreviewLoading(true);
    setError(null);
    try {
      const response = await paperApi.previewFlexiblePaper({
        name: paperName,
        description: paperDescription,
        type: paperType,
        extraction_rules: extractionRules,
        duration,
      }) as any;

      if (response.code === 0) {
        setPreviewData(response.data);
        setStep('preview');
      } else {
        setError(response.message || '生成预览失败');
      }
    } catch (err) {
      setError('生成预览出错: ' + (err instanceof Error ? err.message : '未知错误'));
    } finally {
      setPreviewLoading(false);
    }
  };

  // 保存试卷
  const handleSavePaper = async () => {
    setSaving(true);
    setError(null);
    try {
      const response = await paperApi.saveFlexiblePaper({
        name: paperName,
        description: paperDescription,
        type: paperType,
        duration,
        question_ids: previewData.questions.map((q: any) => q.id),
        type_score: previewData.type_score,
        type_ratio: previewData.type_count,
        total_score: previewData.total_score,
        pass_score: previewData.pass_score,
      }) as any;

      if (response.code === 0) {
        onPaperSaved();
        onOpenChange(false);
        resetForm();
      } else {
        setError(response.msg || '保存试卷失败');
      }
    } catch (err) {
      setError('保存试卷出错: ' + (err instanceof Error ? err.message : '未知错误'));
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setStep('basic');
    setPaperName('');
    setPaperDescription('');
    setPaperType('exam');
    setSelectedTypes([]);
    setExtractionRules([]);
    setPreviewData(null);
    setDuration(90);
    setError(null);
  };

  const handleClose = () => {
    onOpenChange(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>灵活随机组卷</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* 第一步：基本信息 */}
        {step === 'basic' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">试卷名称 *</label>
              <Input
                placeholder="请输入试卷名称"
                value={paperName}
                onChange={(e) => setPaperName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">试卷描述</label>
              <Input
                placeholder="请输入试卷描述"
                value={paperDescription}
                onChange={(e) => setPaperDescription(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">试卷类型 *</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={paperType}
                onChange={(e) => setPaperType(e.target.value)}
              >
                <option value="exam">考试</option>
                <option value="practice">练习</option>
                <option value="mock">模拟</option>
              </select>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleClose}>
                取消
              </Button>
              <Button
                onClick={() => setStep('types')}
                disabled={!paperName.trim()}
              >
                下一步
              </Button>
            </div>
          </div>
        )}

        {/* 第二步：选择题型 */}
        {step === 'types' && (
          <div className="space-y-4">
            <h3 className="font-medium">选择试卷包含的题型</h3>
            <div className="grid grid-cols-3 gap-4">
              {questionTypes.map(type => (
                <Card
                  key={type.value}
                  className={`cursor-pointer transition ${
                    selectedTypes.includes(type.value)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                  onClick={() => handleTypeToggle(type.value)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-lg font-medium">{type.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setStep('basic')}>
                上一步
              </Button>
              <Button
                onClick={handleInitializeRules}
                disabled={selectedTypes.length === 0}
              >
                下一步
              </Button>
            </div>
          </div>
        )}

        {/* 第三步：设置抽题规则 */}
        {step === 'rules' && (
          <div className="space-y-4">
            <h3 className="font-medium">设置各题型的抽题规则</h3>
            {extractionRules.map((rule, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-base">
                    {questionTypes.find(t => t.value === rule.type)?.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">题库</label>
                      <select
                        key={`bank-${index}`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        value={rule.bank_id !== undefined ? String(rule.bank_id) : ''}
                        onChange={(e) => {
                          const val = e.target.value ? parseInt(e.target.value) : undefined;
                          console.log('题库选择:', val, '当前值:', rule.bank_id);
                          updateRule(index, 'bank_id', val);
                        }}
                        disabled={loadingBanks}
                      >
                        <option value="">全部题库</option>
                        {questionBanks.map(bank => (
                          <option key={`${index}-bank-${bank.id}`} value={String(bank.id)}>{bank.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">难度</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        value={rule.difficulty || ''}
                        onChange={(e) => updateRule(index, 'difficulty', e.target.value || undefined)}
                      >
                        <option value="">全部难度</option>
                        {difficulties.map(d => (
                          <option key={d.value} value={d.value}>{d.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">一级知识点</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        value={rule.first_level_tag_id || ''}
                        onChange={(e) => handleFirstLevelTagChange(index, e.target.value ? parseInt(e.target.value) : undefined)}
                        disabled={loadingFirstLevelTags}
                      >
                        <option value="">全部一级知识点</option>
                        {firstLevelTags.map(tag => (
                          <option key={tag.id} value={tag.id}>{tag.tagName}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">二级知识点</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        value={rule.second_level_tag_id || ''}
                        onChange={(e) => handleSecondLevelTagChange(index, e.target.value ? parseInt(e.target.value) : undefined)}
                        disabled={!rule.first_level_tag_id || loadingSecondLevelTags[index]}
                      >
                        <option value="">全部二级知识点</option>
                        {(secondLevelTags[index] || []).map(tag => (
                          <option key={tag.id} value={tag.id}>{tag.tagName}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">三级知识点</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        value={rule.third_level_tag_id || ''}
                        onChange={(e) => handleThirdLevelTagChange(index, e.target.value ? parseInt(e.target.value) : undefined)}
                        disabled={!rule.second_level_tag_id || loadingThirdLevelTags[index]}
                      >
                        <option value="">全部三级知识点</option>
                        {(thirdLevelTags[index] || []).map(tag => (
                          <option key={tag.id} value={tag.id}>{tag.tagName}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        可用题目数
                        {ruleQueryState[index]?.loading && (
                          <Loader2 className="h-3 w-3 inline ml-1 animate-spin" />
                        )}
                      </label>
                      <div className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50">
                        {ruleQueryState[index]?.availableCount || rule.max_available_count || 0}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        抽题数量
                        {rule.max_available_count && rule.question_count > rule.max_available_count && (
                          <span className="text-red-500 text-xs ml-1">（已自动调整为最大值）</span>
                        )}
                      </label>
                      <Input
                        type="number"
                        min="1"
                        max={rule.max_available_count || undefined}
                        value={rule.question_count}
                        onChange={(e) => updateRule(index, 'question_count', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">每题分值</label>
                      <Input
                        type="number"
                        min="1"
                        value={rule.score_per_question}
                        onChange={(e) => updateRule(index, 'score_per_question', parseInt(e.target.value) || 1)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setStep('types')}>
                上一步
              </Button>
              <Button
                onClick={handleGeneratePreview}
                disabled={previewLoading}
              >
                {previewLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    生成预览中...
                  </>
                ) : (
                  '生成预览'
                )}
              </Button>
            </div>
          </div>
        )}

        {/* 第四步：预览试卷 */}
        {step === 'preview' && previewData && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">题目总数</div>
                <div className="text-2xl font-bold">{previewData.question_count}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">试卷总分</div>
                <div className="text-2xl font-bold">{previewData.total_score}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">及格分数</div>
                <div className="text-2xl font-bold">{previewData.pass_score}</div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">答题时长（分钟）</label>
                <Input
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 90)}
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setStep('rules')}>
                上一步
              </Button>
              <Button
                onClick={() => setStep('save')}
              >
                下一步
              </Button>
            </div>
          </div>
        )}

        {/* 第五步：确认保存 */}
        {step === 'save' && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded">
              <h4 className="font-medium mb-2">试卷信息确认</h4>
              <div className="space-y-1 text-sm">
                <div><span className="font-medium">试卷名称:</span> {paperName}</div>
                <div><span className="font-medium">试卷类型:</span> {paperType}</div>
                <div><span className="font-medium">题目总数:</span> {previewData?.question_count}</div>
                <div><span className="font-medium">试卷总分:</span> {previewData?.total_score}</div>
                <div><span className="font-medium">答题时长:</span> {duration} 分钟</div>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setStep('preview')}>
                上一步
              </Button>
              <Button
                onClick={handleSavePaper}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    保存中...
                  </>
                ) : (
                  '提交保存'
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FlexiblePaperDialog;

