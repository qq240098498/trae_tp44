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
  DollarSign,
  TrendingUp,
  MapPin,
  Building2,
  BarChart3,
  Shield,
  Sparkles,
  Info,
} from 'lucide-react';
import type { InterviewQuestion, JobPosition, Resume, SalaryEstimation } from '../../shared/types';
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

const cityOptions = [
  '北京', '上海', '深圳', '广州', '杭州', '成都', '武汉', '南京', '苏州', '西安', '重庆', '天津',
];

const industryOptions = [
  '互联网', '人工智能', '金融科技', '游戏', '电商', 'SaaS/企业服务', '教育科技', '医疗健康', '制造业', '传统行业',
];

const formatSalary = (num: number): string => {
  if (num >= 10000) {
    return `${(num / 1000).toFixed(0)}K`;
  }
  return num.toLocaleString();
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
    salaryEstimation,
    setSalaryEstimation,
    generateSalaryEstimation,
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
  const [salaryLocation, setSalaryLocation] = useState<string>('北京');
  const [salaryIndustry, setSalaryIndustry] = useState<string>('互联网');
  const [showSalarySection, setShowSalarySection] = useState<boolean>(false);

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

  const handleGenerateSalaryEstimation = async () => {
    if (!currentJobPosition) return;
    await generateSalaryEstimation(currentJobPosition.id, {
      location: salaryLocation,
      industry: salaryIndustry,
    });
    setShowSalarySection(true);
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

          <div className="card p-6 bg-gradient-to-br from-amber-50 to-orange-50">
            <h3 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
              <DollarSign size={18} className="text-amber-600" />
              薪酬区间估算
            </h3>
            <p className="text-sm text-amber-800 mb-4">
              结合岗位级别、城市、行业和市场数据，为您提供科学的薪酬参考
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2 flex items-center gap-1">
                  <MapPin size={14} />
                  工作城市
                </label>
                <select
                  value={salaryLocation}
                  onChange={(e) => setSalaryLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-amber-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  {cityOptions.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2 flex items-center gap-1">
                  <Building2 size={14} />
                  所属行业
                </label>
                <select
                  value={salaryIndustry}
                  onChange={(e) => setSalaryIndustry(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-amber-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  {industryOptions.map((industry) => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleGenerateSalaryEstimation}
                disabled={loading || !currentJobPosition}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  <TrendingUp size={18} />
                )}
                {loading ? '计算中...' : '生成薪酬建议'}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          {showSalarySection && salaryEstimation && (
            <div className="card p-6 animate-fade-in bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50 border-2 border-amber-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">薪酬区间估算</h2>
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={12} />
                        {salaryEstimation.location}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Building2 size={12} />
                        {salaryEstimation.industry}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <BarChart3 size={12} />
                        {salaryEstimation.level}
                      </span>
                    </p>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-xl text-white font-semibold bg-gradient-to-r ${salaryEstimation.marketDemand.color} shadow-md`}>
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} />
                    <span>{salaryEstimation.marketDemand.label}</span>
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                      溢价 {salaryEstimation.marketDemand.premiumRange}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {salaryEstimation.percentiles.map((p, idx) => {
                  const colors = [
                    { bg: 'from-slate-400 to-slate-500', bar: 'bg-slate-400', text: 'text-slate-700', badge: 'bg-slate-100 text-slate-700' },
                    { bg: 'from-blue-500 to-blue-600', bar: 'bg-blue-500', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700' },
                    { bg: 'from-emerald-500 to-teal-600', bar: 'bg-emerald-500', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700' },
                  ];
                  const color = colors[idx];
                  return (
                    <div key={p.percentile} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                      <div className={`w-full h-1.5 rounded-full bg-gradient-to-r ${color.bg} mb-4`} />
                      <div className={`text-sm font-semibold ${color.text} mb-3 flex items-center gap-1`}>
                        <Info size={14} />
                        {p.label}
                      </div>
                      <div className="text-2xl font-bold text-slate-900 mb-1">
                        {formatSalary(p.medianSalary)}
                        <span className="text-sm font-normal text-slate-500 ml-1">
                          {salaryEstimation.unit}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mb-3">
                        基本薪资范围 {formatSalary(p.minSalary)} - {formatSalary(p.maxSalary)}
                      </div>
                      <div className="space-y-2 pt-3 border-t border-slate-100">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">月度现金收入</span>
                          <span className={`font-bold px-2 py-0.5 rounded-full ${color.badge}`}>
                            {formatSalary(p.monthlyCash)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">年度现金</span>
                          <span className="font-bold text-slate-700">
                            {formatSalary(p.annualCash)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">年度总包(Total)</span>
                          <span className={`font-bold ${color.text}`}>
                            {formatSalary(p.annualTotalPackage)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid lg:grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-xl p-5 border border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <TrendingUp size={18} className="text-amber-600" />
                    年度总包对比
                  </h3>
                  <div className="relative">
                    <div className="flex items-end gap-3 h-40">
                      {(() => {
                        const min = salaryEstimation.percentiles[0].annualTotalPackage;
                        const max = salaryEstimation.percentiles[2].annualTotalPackage;
                        const range = max - min;
                        return salaryEstimation.percentiles.map((p, idx) => {
                          const heights = range > 0
                            ? ((p.annualTotalPackage - min) / range) * 70 + 30
                            : 50;
                          const colors = ['bg-slate-400', 'bg-blue-500', 'bg-emerald-500'];
                          const labels = ['保守', '中位', '竞争力'];
                          return (
                            <div key={p.percentile} className="flex-1 flex flex-col items-center justify-end gap-2">
                              <div className="text-xs font-bold text-slate-800 mb-1">
                                {formatSalary(p.annualTotalPackage)}
                                <span className="text-slate-400 font-normal">/年</span>
                              </div>
                              <div
                                className={`w-full rounded-t-lg ${colors[idx]} transition-all hover:opacity-80 relative group`}
                                style={{ height: `${heights}%` }}
                              >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                  {labels[idx]}：{formatSalary(p.annualTotalPackage)}
                                </div>
                              </div>
                              <div className="text-xs font-semibold text-slate-600">
                                P{p.percentile}
                              </div>
                              <div className="text-xs text-slate-400">
                                {formatSalary(p.monthlyCash)}/月现金
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                    <div className="absolute left-0 bottom-0 w-full h-0.5 bg-slate-200" />
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <BarChart3 size={18} className="text-indigo-600" />
                    中位薪酬构成占比
                  </h3>
                  <div className="space-y-3">
                    {salaryEstimation.medianPackage.map((pkg, idx) => {
                      const colors = [
                        'from-sky-400 to-blue-500',
                        'from-violet-400 to-purple-500',
                        'from-amber-400 to-orange-500',
                        'from-rose-400 to-red-500',
                        'from-emerald-400 to-teal-500',
                        'from-pink-400 to-fuchsia-500',
                      ];
                      const color = colors[idx % colors.length];
                      return (
                        <div key={idx} className="group">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="font-medium text-slate-700 flex items-center gap-1.5">
                              <span className="text-base">{pkg.icon}</span>
                              {pkg.name}
                            </span>
                            <span className="text-slate-500 text-xs">
                              {formatSalary(pkg.monthlyAmount)}/月 · <span className="font-bold text-slate-700">{formatSalary(pkg.annualAmount)}/年</span>
                              <span className="ml-1 font-semibold text-slate-800">({pkg.percentage}%)</span>
                            </span>
                          </div>
                          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${color} rounded-full transition-all group-hover:brightness-110`}
                              style={{ width: `${Math.max(pkg.percentage, 3)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50 -mx-5 -mb-5 px-5 py-3 rounded-b-xl">
                    <span className="font-bold text-slate-800">年度总包合计</span>
                    <span className="text-xl font-bold text-orange-600">
                      {formatSalary(salaryEstimation.overallRange.medianTotalPackage)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-5 mb-6 border border-blue-100">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Sparkles size={18} className="text-blue-600" />
                  中位水平薪酬构成明细（50分位）
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {salaryEstimation.medianPackage.map((pkg, idx) => {
                    const cardColors = [
                      'from-sky-50 to-blue-100 border-sky-200',
                      'from-violet-50 to-purple-100 border-violet-200',
                      'from-amber-50 to-orange-100 border-amber-200',
                      'from-rose-50 to-red-100 border-rose-200',
                      'from-emerald-50 to-teal-100 border-emerald-200',
                      'from-pink-50 to-fuchsia-100 border-pink-200',
                    ];
                    const cardColor = cardColors[idx % cardColors.length];
                    return (
                      <div
                        key={idx}
                        className={`rounded-xl p-4 bg-gradient-to-br ${cardColor} border hover:shadow-md transition-shadow`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{pkg.icon}</span>
                          <div className="font-bold text-slate-800">{pkg.name}</div>
                        </div>
                        <div className="text-2xl font-bold text-slate-900 mb-0.5">
                          {formatSalary(pkg.monthlyAmount)}
                          <span className="text-xs font-normal text-slate-500 ml-0.5">/月</span>
                        </div>
                        <div className="text-sm font-semibold text-slate-700 mb-2">
                          年 {formatSalary(pkg.annualAmount)}
                          <span className="ml-1.5 text-xs bg-white/70 px-1.5 py-0.5 rounded font-bold">
                            占 {pkg.percentage}%
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {pkg.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                  <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <Shield size={18} />
                    公司薪酬带宽
                  </h3>
                  <div className="mb-3">
                    <div className="text-xs font-semibold text-blue-800 mb-1">月度基本工资</div>
                    <div className="text-xl font-bold text-blue-700">
                      {formatSalary(salaryEstimation.companyBandwidth.min)} - {formatSalary(salaryEstimation.companyBandwidth.max)}
                      <span className="text-sm font-normal ml-1">K/月</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-blue-200 mb-2">
                    <div className="text-xs font-semibold text-indigo-800 mb-1">年度总包范围</div>
                    <div className="text-2xl font-bold text-indigo-700">
                      {formatSalary(salaryEstimation.companyBandwidth.minTotalPackage)}
                      <span className="mx-1 text-indigo-400">~</span>
                      {formatSalary(salaryEstimation.companyBandwidth.maxTotalPackage)}
                      <span className="text-sm font-normal ml-1">/年</span>
                    </div>
                  </div>
                  <p className="text-xs text-blue-800 leading-relaxed pt-2">
                    {salaryEstimation.companyBandwidth.description}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-5 border border-rose-100">
                  <h3 className="font-bold text-rose-900 mb-3 flex items-center gap-2">
                    <Sparkles size={18} />
                    市场紧缺度分析
                  </h3>
                  <div className="text-lg font-bold text-rose-700 mb-2">
                    {salaryEstimation.marketDemand.label}
                    <span className="ml-2 text-sm bg-rose-200 text-rose-800 px-2 py-0.5 rounded-full">
                      溢价 {salaryEstimation.marketDemand.premiumRange}
                    </span>
                  </div>
                  <p className="text-sm text-rose-800 leading-relaxed">
                    {salaryEstimation.marketDemand.description}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 mb-6 border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <BarChart3 size={18} className="text-slate-600" />
                  数据来源说明（加权综合）
                </h3>
                <div className="space-y-3">
                  {salaryEstimation.benchmarks.map((bench, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-40 text-sm font-medium text-slate-700 truncate">
                        {bench.name}
                      </div>
                      <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all"
                          style={{ width: `${bench.weight * 100}%` }}
                        />
                      </div>
                      <div className="w-16 text-right text-sm font-bold text-orange-600">
                        {(bench.weight * 100).toFixed(0)}%
                      </div>
                      <div className="hidden lg:block w-64 text-xs text-slate-500 truncate" title={bench.description}>
                        {bench.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-5 border border-violet-100">
                <h3 className="font-bold text-violet-900 mb-4 flex items-center gap-2">
                  <Lightbulb size={18} className="text-violet-600" />
                  谈薪策略建议
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {salaryEstimation.negotiationTips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-white/70 rounded-lg hover:bg-white transition-colors">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-sm text-violet-900 leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

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
