import { useState, useEffect } from 'react';
import {
  MessageSquare,
  Brain,
  Users,
  Target,
  Lightbulb,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Download,
  Copy,
  CheckCircle2,
  AlertTriangle,
  Send,
  Star,
  BookOpen,
} from 'lucide-react';
import type { InterviewQuestion, JobPosition, Resume } from '../../shared/types';
import { useAppStore } from '../store';
import { api } from '../utils/api';
import ScoreBadge from '../components/ui/ScoreBadge';
import { copyToClipboard, downloadFile } from '../utils/helpers';
import { mockResumes } from '../data/mockData';

const categoryConfig = {
  basicInfo: {
    label: '基础信息',
    icon: BookOpen,
    color: 'from-slate-500 to-slate-600',
    bgColor: 'bg-slate-50',
    textColor: 'text-slate-700',
    borderColor: 'border-slate-200',
  },
  professional: {
    label: '专业能力',
    icon: Brain,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
  },
  softSkill: {
    label: '软技能',
    icon: Users,
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
  },
  culturalFit: {
    label: '文化适配',
    icon: Target,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
  },
  followUp: {
    label: '针对性追问',
    icon: AlertTriangle,
    color: 'from-rose-500 to-rose-600',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-700',
    borderColor: 'border-rose-200',
  },
};

const difficultyConfig = {
  easy: { label: '简单', color: 'bg-emerald-100 text-emerald-700' },
  medium: { label: '中等', color: 'bg-amber-100 text-amber-700' },
  hard: { label: '困难', color: 'bg-red-100 text-red-700' },
};

export default function InterviewQuestions() {
  const {
    currentJobPosition,
    currentResume,
    setCurrentResume,
    interviewQuestions,
    setInterviewQuestions,
    setLoading,
    loading,
    resumes,
    setResumes,
  } = useAppStore();

  const [activeCategory, setActiveCategory] = useState<'all' | 'basicInfo' | 'professional' | 'softSkill' | 'culturalFit' | 'followUp'>('all');
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [answerInputs, setAnswerInputs] = useState<Record<string, string>>({});
  const [evaluations, setEvaluations] = useState<Record<string, {
    score: number;
    feedback: string[];
    coveredPoints: string[];
    missingPoints: string[];
  }>>({});

  useEffect(() => {
    setResumes(mockResumes);
  }, [setResumes]);

  const handleGenerateQuestions = async () => {
    if (!currentJobPosition) return;
    setLoading(true);
    try {
      const result = await api.interviewQuestions.generate(
        currentJobPosition.id,
        selectedResumeId || undefined
      );
      setInterviewQuestions(result);
    } catch (error) {
      console.error('生成面试问题失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectResume = (resume: Resume) => {
    setCurrentResume(resume);
    setSelectedResumeId(resume.id);
  };

  const toggleQuestion = (id: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedQuestions(newExpanded);
  };

  const handleCopyQuestion = async (question: InterviewQuestion) => {
    await copyToClipboard(question.question);
    setCopiedId(question.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleEvaluateAnswer = async (question: InterviewQuestion) => {
    const answer = answerInputs[question.id];
    if (!answer?.trim()) return;
    setLoading(true);
    try {
      const result = await api.interviewQuestions.evaluateAnswer(question, answer);
      setEvaluations(prev => ({ ...prev, [question.id]: result }));
    } catch (error) {
      console.error('评估答案失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAll = () => {
    if (interviewQuestions.length === 0) return;
    const content = interviewQuestions.map(q => {
      const config = categoryConfig[q.category];
      return `【${config.label}】${q.question}\n\n考察要点：\n${q.expectedPoints.map(p => `• ${p}`).join('\n')}\n\n`;
    }).join('\n---\n\n');
    downloadFile(content, '面试问题列表.md', 'text/markdown');
  };

  const filteredQuestions = activeCategory === 'all'
    ? interviewQuestions
    : interviewQuestions.filter(q => q.category === activeCategory);

  const categoryStats = {
    basicInfo: interviewQuestions.filter(q => q.category === 'basicInfo').length,
    professional: interviewQuestions.filter(q => q.category === 'professional').length,
    softSkill: interviewQuestions.filter(q => q.category === 'softSkill').length,
    culturalFit: interviewQuestions.filter(q => q.category === 'culturalFit').length,
    followUp: interviewQuestions.filter(q => q.category === 'followUp').length,
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
            <MessageSquare size={20} />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-display text-primary-900">
              结构化面试问题
            </h1>
            <p className="text-slate-500">
              根据职位和候选人背景，生成专业能力、软技能、文化适配三类问题
            </p>
          </div>
        </div>
      </div>

      {!currentJobPosition && (
        <div className="card p-8 mb-8 bg-amber-50 border-amber-200">
          <div className="flex items-start gap-4">
            <AlertTriangle size={24} className="text-amber-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-amber-800 mb-2">请先创建职位描述</h3>
              <p className="text-amber-700 text-sm">
                在生成面试问题之前，需要先生成目标职位的职位描述。请前往"职位描述生成"页面创建。
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="card p-6">
            <h3 className="font-bold text-primary-900 mb-4 flex items-center gap-2">
              <Target size={18} />
              目标职位
            </h3>
            {currentJobPosition ? (
              <div className="p-4 bg-gradient-to-br from-primary-900/10 to-blue-50 rounded-xl">
                <div className="font-bold text-primary-900">{currentJobPosition.title}</div>
                <div className="text-sm text-slate-500">{currentJobPosition.department}</div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {currentJobPosition.skills.slice(0, 4).map((skill, i) => (
                    <span key={i} className="px-2 py-0.5 bg-white text-primary-900 rounded text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                暂无职位信息
              </div>
            )}
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-primary-900 mb-4 flex items-center gap-2">
              <Users size={18} />
              选择候选人 (可选)
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              选择特定候选人后，系统将根据其背景生成个性化问题
            </p>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  onClick={() => handleSelectResume(resume)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedResumeId === resume.id
                      ? 'bg-primary-900 text-white shadow-md'
                      : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className={`font-medium ${selectedResumeId === resume.id ? 'text-white' : 'text-primary-900'}`}>
                    {resume.name}
                  </div>
                  <div className={`text-xs ${selectedResumeId === resume.id ? 'text-blue-100' : 'text-slate-500'}`}>
                    {resume.experience[0]?.position}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerateQuestions}
            disabled={loading || !currentJobPosition}
            className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <RefreshCw size={20} className="animate-spin" />
            ) : (
              <Lightbulb size={20} />
            )}
            {loading ? '生成中...' : '生成面试问题'}
          </button>

          {interviewQuestions.length > 0 && (
            <div className="card p-6 bg-gradient-to-br from-emerald-50 to-teal-50">
              <h3 className="font-bold text-emerald-900 mb-4">问题统计</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-800">基础信息</span>
                  <span className="font-bold text-emerald-600">{categoryStats.basicInfo} 题</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-800">专业能力</span>
                  <span className="font-bold text-emerald-600">{categoryStats.professional} 题</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-800">软技能</span>
                  <span className="font-bold text-emerald-600">{categoryStats.softSkill} 题</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-800">文化适配</span>
                  <span className="font-bold text-emerald-600">{categoryStats.culturalFit} 题</span>
                </div>
                {categoryStats.followUp > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-rose-700">针对性追问</span>
                    <span className="font-bold text-rose-600">{categoryStats.followUp} 题</span>
                  </div>
                )}
                <div className="border-t border-emerald-200 pt-3 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-900">总计</span>
                    <span className="font-bold text-emerald-600">{interviewQuestions.length} 题</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-8 space-y-6">
          {interviewQuestions.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {(['all', 'basicInfo', 'professional', 'softSkill', 'culturalFit', 'followUp'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        activeCategory === cat
                          ? 'bg-primary-900 text-white'
                          : 'bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {cat === 'all' ? '全部' : categoryConfig[cat].label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleDownloadAll}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-sm font-medium"
                >
                  <Download size={16} />
                  下载全部
                </button>
              </div>

              <div className="space-y-4">
                {filteredQuestions.map((question, index) => {
                  const config = categoryConfig[question.category];
                  const Icon = config.icon;
                  const isExpanded = expandedQuestions.has(question.id);
                  const evaluation = evaluations[question.id];

                  return (
                    <div
                      key={question.id}
                      className={`card p-6 border-l-4 ${config.borderColor} animate-slide-up`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-8 h-8 bg-gradient-to-br ${config.color} rounded-lg flex items-center justify-center text-white`}>
                              <Icon size={16} />
                            </div>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${config.bgColor} ${config.textColor}`}>
                              {config.label}
                            </span>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${difficultyConfig[question.difficulty].color}`}>
                              {difficultyConfig[question.difficulty].label}
                            </span>
                          </div>

                          <h4 className="text-lg font-semibold text-primary-900 mb-3">
                            {question.question}
                          </h4>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleCopyQuestion(question)}
                              className="flex items-center gap-1 text-sm text-slate-500 hover:text-primary-900 transition-colors"
                            >
                              {copiedId === question.id ? (
                                <CheckCircle2 size={14} className="text-emerald-500" />
                              ) : (
                                <Copy size={14} />
                              )}
                              {copiedId === question.id ? '已复制' : '复制问题'}
                            </button>
                            <button
                              onClick={() => toggleQuestion(question.id)}
                              className="flex items-center gap-1 text-sm text-slate-500 hover:text-primary-900 transition-colors"
                            >
                              {isExpanded ? (
                                <><ChevronUp size={14} /> 收起详情</>
                              ) : (
                                <><ChevronDown size={14} /> 展开详情</>
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-slate-400">
                          {[1, 2, 3].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              className={star <= (question.difficulty === 'easy' ? 1 : question.difficulty === 'medium' ? 2 : 3)
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-300'
                              }
                            />
                          ))}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-6 pt-6 border-t border-slate-100 space-y-6 animate-fade-in">
                          <div>
                            <h5 className="font-semibold text-primary-900 mb-3 flex items-center gap-2">
                              <BookOpen size={16} />
                              考察要点
                            </h5>
                            <ul className="space-y-2">
                              {question.expectedPoints.map((point, i) => (
                                <li key={i} className="flex gap-3 text-slate-600">
                                  <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h5 className="font-semibold text-primary-900 mb-3 flex items-center gap-2">
                              <MessageSquare size={16} />
                              答案评估
                            </h5>
                            <textarea
                              value={answerInputs[question.id] || ''}
                              onChange={(e) => setAnswerInputs(prev => ({ ...prev, [question.id]: e.target.value }))}
                              className="input-field min-h-[100px] mb-3"
                              placeholder="输入候选人的回答，系统将自动评估..."
                            />
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleEvaluateAnswer(question)}
                                disabled={loading || !answerInputs[question.id]?.trim()}
                                className="btn-secondary flex items-center gap-2"
                              >
                                <Send size={16} />
                                评估回答
                              </button>
                            </div>

                            {evaluation && (
                              <div className="mt-4 p-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl animate-fade-in">
                                <div className="flex items-center justify-between mb-4">
                                  <h6 className="font-semibold text-primary-900">评估结果</h6>
                                  <ScoreBadge score={evaluation.score} size="sm" />
                                </div>

                                {evaluation.coveredPoints.length > 0 && (
                                  <div className="mb-3">
                                    <div className="text-sm font-medium text-emerald-700 mb-2">✓ 已覆盖要点</div>
                                    <div className="flex flex-wrap gap-2">
                                      {evaluation.coveredPoints.map((point, i) => (
                                        <span key={i} className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded">
                                          {point}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {evaluation.missingPoints.length > 0 && (
                                  <div className="mb-3">
                                    <div className="text-sm font-medium text-amber-700 mb-2">⚠ 未覆盖要点</div>
                                    <div className="flex flex-wrap gap-2">
                                      {evaluation.missingPoints.map((point, i) => (
                                        <span key={i} className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded">
                                          {point}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                <div>
                                  <div className="text-sm font-medium text-slate-700 mb-2">评估反馈</div>
                                  <ul className="space-y-1 text-sm text-slate-600">
                                    {evaluation.feedback.map((fb, i) => (
                                      <li key={i} className="flex gap-2">
                                        <span className="text-accent-blue">•</span>
                                        {fb}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {interviewQuestions.length === 0 && (
            <div className="card p-16 text-center">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lightbulb size={48} className="text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-primary-900 mb-2">生成面试问题</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                选择目标职位和候选人后，点击"生成面试问题"按钮，系统将自动生成结构化的面试问题
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
