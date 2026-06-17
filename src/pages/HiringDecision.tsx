import { useState, useEffect } from 'react';
import {
  Award,
  Users,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  RefreshCw,
  Download,
  BarChart3,
  UserCheck,
  UserX,
  Clock,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { HiringRecommendation, Resume } from '../../shared/types';
import { useAppStore } from '../store';
import { api } from '../utils/api';
import ScoreBadge from '../components/ui/ScoreBadge';
import ProgressBar from '../components/ui/ProgressBar';
import { downloadFile } from '../utils/helpers';
import { mockResumes } from '../data/mockData';

const recommendationConfig = {
  hire: {
    label: '建议录用',
    icon: UserCheck,
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
  },
  reject: {
    label: '建议淘汰',
    icon: UserX,
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
  },
  pending: {
    label: '待定',
    icon: Clock,
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
  },
};

export default function HiringDecision() {
  const {
    currentJobPosition,
    setCurrentResume,
    currentResume,
    hiringRecommendation,
    setHiringRecommendation,
    setLoading,
    loading,
    resumes,
    setResumes,
    currentEvaluation,
  } = useAppStore();

  const [selectedResumes, setSelectedResumes] = useState<string[]>([]);
  const [comparisonData, setComparisonData] = useState<Array<{
    resume: Resume;
    ranking: number;
    overallScore: number;
    recommendation: HiringRecommendation;
  }>>([]);
  const [expandedCandidate, setExpandedCandidate] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'single' | 'compare'>('single');

  useEffect(() => {
    setResumes(mockResumes);
  }, [setResumes]);

  const toggleResumeSelection = (resumeId: string) => {
    setSelectedResumes(prev => {
      if (prev.includes(resumeId)) {
        return prev.filter(id => id !== resumeId);
      } else {
        return [...prev, resumeId];
      }
    });
  };

  const handleGenerateRecommendation = async (resumeId: string) => {
    if (!currentJobPosition) return;
    setLoading(true);
    try {
      const result = await api.hiringDecision.generate(resumeId, currentJobPosition.id);
      setHiringRecommendation(result);
      const resume = resumes.find(r => r.id === resumeId);
      if (resume) {
        setCurrentResume(resume);
      }
    } catch (error) {
      console.error('生成录用建议失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompareCandidates = async () => {
    if (!currentJobPosition || selectedResumes.length === 0) return;
    setLoading(true);
    try {
      const result = await api.hiringDecision.compare(selectedResumes, currentJobPosition.id);
      setComparisonData(result);
    } catch (error) {
      console.error('对比候选人失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = (candidate?: { resume: Resume; recommendation: HiringRecommendation; overallScore: number }) => {
    const targetResume = candidate?.resume || currentResume;
    const targetRecommendation = candidate?.recommendation || hiringRecommendation;
    const targetScore = candidate?.overallScore || currentEvaluation?.overallScore || 0;

    if (!targetResume || !targetRecommendation) return;

    const config = recommendationConfig[targetRecommendation.recommendation];

    const content = `
# 录用决策报告

## 基本信息
- 候选人：${targetResume.name}
- 应聘职位：${currentJobPosition?.title || '未指定'}
- 生成日期：${new Date().toLocaleDateString('zh-CN')}

## 评估结果
- 综合得分：${targetScore} 分
- 决策建议：${config.label}

## 决策理由
${targetRecommendation.reasons.map((r, i) => `${i + 1}. ${r}`).join('\n')}

## 最终结论
${targetRecommendation.finalDecision}

---

## 公平性声明
本评估过程已自动屏蔽性别、年龄、地域等敏感信息，确保招聘决策的客观性和公平性。
评估基于候选人的技能、经验、潜力等与工作相关的因素。
`.trim();

    downloadFile(content, `${targetResume.name}-录用决策报告.md`, 'text/markdown');
  };

  const getRankingBadge = (ranking: number) => {
    const colors = [
      'bg-gradient-to-br from-yellow-400 to-yellow-500',
      'bg-gradient-to-br from-slate-400 to-slate-500',
      'bg-gradient-to-br from-amber-600 to-amber-700',
    ];
    const bgColor = ranking <= 3 ? colors[ranking - 1] : 'bg-slate-300';
    return (
      <div className={`w-10 h-10 ${bgColor} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
        {ranking}
      </div>
    );
  };

  const CandidateCard = ({
    candidate,
    showDetails = false,
  }: {
    candidate: {
      resume: Resume;
      ranking: number;
      overallScore: number;
      recommendation: HiringRecommendation;
    };
    showDetails?: boolean;
  }) => {
    const { resume, ranking, overallScore, recommendation } = candidate;
    const config = recommendationConfig[recommendation.recommendation];
    const Icon = config.icon;
    const isExpanded = expandedCandidate === resume.id;

    return (
      <div className={`card p-6 border-l-4 ${config.borderColor} ${showDetails ? '' : 'cursor-pointer hover:shadow-xl transition-all'}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {showDetails && getRankingBadge(ranking)}
            <div className="w-14 h-14 bg-gradient-to-br from-primary-900 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold font-display">
              {resume.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-primary-900 text-xl">{resume.name}</h3>
              <p className="text-slate-500">{resume.experience[0]?.position}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${config.bgColor} ${config.textColor} flex items-center gap-1`}>
                  <Icon size={14} />
                  {config.label}
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <ScoreBadge score={overallScore} size="lg" />
          </div>
        </div>

        {showDetails && (
          <div className="mt-6">
            <button
              onClick={() => setExpandedCandidate(isExpanded ? null : resume.id)}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary-900 transition-colors"
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {isExpanded ? '收起详情' : '查看详情'}
            </button>

            {isExpanded && (
              <div className="mt-4 pt-4 border-t border-slate-100 animate-fade-in space-y-4">
                <div>
                  <h4 className="font-semibold text-primary-900 mb-2">决策理由</h4>
                  <ul className="space-y-2">
                    {recommendation.reasons.map((reason, i) => (
                      <li key={i} className="flex gap-3 p-3 bg-slate-50 rounded-xl">
                        <CheckCircle2 size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-gradient-to-r from-primary-900/10 to-blue-50 rounded-xl">
                  <h4 className="font-semibold text-primary-900 mb-2">最终结论</h4>
                  <p className="text-slate-700">{recommendation.finalDecision}</p>
                </div>

                <button
                  onClick={() => handleDownloadReport(candidate)}
                  className="btn-secondary w-full flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  下载决策报告
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
            <Award size={20} />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-display text-primary-900">
              录用决策
            </h1>
            <p className="text-slate-500">综合多维度评估，给出客观公正的录用建议</p>
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
                在生成录用决策之前，需要先生成目标职位的职位描述。请前往"职位描述生成"页面创建。
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="card p-6 mb-8 bg-gradient-to-br from-primary-900/5 to-blue-50">
        <div className="flex items-start gap-4">
          <ShieldCheck size={24} className="text-emerald-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-primary-900 mb-2">公平性保障机制</h3>
            <p className="text-slate-600 text-sm">
              本系统在评估过程中已自动屏蔽性别、年龄、地域、婚姻状况等敏感信息，
              所有决策均基于候选人的技能水平、工作经验、发展潜力等与工作相关的客观因素，
              确保招聘过程的公平性和客观性。
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setViewMode('single')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            viewMode === 'single'
              ? 'bg-primary-900 text-white shadow-lg'
              : 'bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          单人评估
        </button>
        <button
          onClick={() => setViewMode('compare')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            viewMode === 'compare'
              ? 'bg-primary-900 text-white shadow-lg'
              : 'bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          多人对比
        </button>
      </div>

      {viewMode === 'single' && (
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="card p-6">
              <h3 className="font-bold text-primary-900 mb-4 flex items-center gap-2">
                <Users size={18} />
                选择候选人
              </h3>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {resumes.map((resume) => (
                  <div
                    key={resume.id}
                    onClick={() => {
                      setCurrentResume(resume);
                      setHiringRecommendation(null);
                    }}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      currentResume?.id === resume.id
                        ? 'bg-primary-900 text-white shadow-lg'
                        : 'bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        currentResume?.id === resume.id
                          ? 'bg-white/20 text-white'
                          : 'bg-gradient-to-br from-primary-900 to-blue-600 text-white'
                      }`}>
                        {resume.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className={`font-semibold ${currentResume?.id === resume.id ? 'text-white' : 'text-primary-900'}`}>
                          {resume.name}
                        </div>
                        <div className={`text-sm ${currentResume?.id === resume.id ? 'text-blue-100' : 'text-slate-500'}`}>
                          {resume.experience[0]?.position}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {currentResume && (
              <button
                onClick={() => handleGenerateRecommendation(currentResume.id)}
                disabled={loading || !currentJobPosition}
                className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <RefreshCw size={20} className="animate-spin" />
                ) : (
                  <BarChart3 size={20} />
                )}
                {loading ? '生成中...' : '生成录用建议'}
              </button>
            )}
          </div>

          <div className="lg:col-span-8">
            {currentResume && hiringRecommendation ? (
              <div className="space-y-6 animate-slide-up">
                <CandidateCard
                  candidate={{
                    resume: currentResume,
                    ranking: 1,
                    overallScore: currentEvaluation?.overallScore || hiringRecommendation.overallScore,
                    recommendation: hiringRecommendation,
                  }}
                  showDetails={true}
                />

                {currentEvaluation && (
                  <div className="card p-6">
                    <h3 className="font-bold text-primary-900 text-lg mb-4">简历评估详情</h3>
                    <div className="space-y-4">
                      <ProgressBar
                        label="技能匹配度"
                        value={currentEvaluation.skillMatch.score}
                        color="blue"
                      />
                      <ProgressBar
                        label="经验相关性"
                        value={currentEvaluation.experienceRelevance.score}
                        color="emerald"
                      />
                      <ProgressBar
                        label="发展潜力"
                        value={currentEvaluation.potential.score}
                        color="purple"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : currentResume ? (
              <div className="card p-16 text-center">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart3 size={48} className="text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-primary-900 mb-2">
                  为 {currentResume.name} 生成录用建议
                </h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  点击左侧"生成录用建议"按钮，系统将综合简历评估和面试表现，给出客观公正的录用建议
                </p>
              </div>
            ) : (
              <div className="card p-16 text-center">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users size={48} className="text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-primary-900 mb-2">选择候选人</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  从左侧列表选择一位候选人，系统将为其生成专业的录用决策建议
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {viewMode === 'compare' && (
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-primary-900 text-lg flex items-center gap-2">
                <Users size={20} />
                选择对比候选人
              </h3>
              <span className="text-sm text-slate-500">
                已选择 {selectedResumes.length} 位候选人
              </span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resumes.map((resume) => {
                const isSelected = selectedResumes.includes(resume.id);
                return (
                  <div
                    key={resume.id}
                    onClick={() => toggleResumeSelection(resume.id)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                      isSelected
                        ? 'border-primary-900 bg-primary-900/5'
                        : 'border-transparent bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        isSelected
                          ? 'bg-primary-900 text-white'
                          : 'bg-gradient-to-br from-slate-300 to-slate-400 text-white'
                      }`}>
                        {isSelected ? <CheckCircle2 size={20} /> : resume.name.charAt(0)}
                      </div>
                      <div>
                        <div className={`font-semibold ${isSelected ? 'text-primary-900' : 'text-primary-900'}`}>
                          {resume.name}
                        </div>
                        <div className="text-sm text-slate-500">
                          {resume.experience[0]?.position}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleCompareCandidates}
              disabled={loading || selectedResumes.length < 2 || !currentJobPosition}
              className="btn-primary w-full mt-6 py-4 text-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <RefreshCw size={20} className="animate-spin" />
              ) : (
                <TrendingUp size={20} />
              )}
              {loading ? '对比分析中...' : `对比 ${selectedResumes.length} 位候选人`}
            </button>

            {selectedResumes.length < 2 && (
              <p className="text-center text-sm text-slate-500 mt-3">
                请至少选择 2 位候选人进行对比
              </p>
            )}
          </div>

          {comparisonData.length > 0 && (
            <div className="space-y-4 animate-slide-up">
              <div className="card p-6 bg-gradient-to-r from-emerald-50 to-teal-50">
                <div className="flex items-center gap-3">
                  <Award size={28} className="text-emerald-600" />
                  <div>
                    <h3 className="font-bold text-emerald-900 text-xl">
                      推荐录用：{comparisonData[0]?.resume.name}
                    </h3>
                    <p className="text-emerald-700">
                      综合评分 {comparisonData[0]?.overallScore} 分，排名第一
                    </p>
                  </div>
                </div>
              </div>

              {comparisonData.map((candidate) => (
                <CandidateCard
                  key={candidate.resume.id}
                  candidate={candidate}
                  showDetails={true}
                />
              ))}

              <div className="card p-6">
                <h3 className="font-bold text-primary-900 text-lg mb-4 flex items-center gap-2">
                  <FileText size={20} />
                  对比分析
                </h3>
                <div className="space-y-4">
                  {comparisonData.map((candidate) => (
                    <div key={candidate.resume.id} className="flex items-center gap-4">
                      <div className="w-20 text-sm font-medium text-primary-900">
                        {candidate.resume.name}
                      </div>
                      <div className="flex-1">
                        <ProgressBar
                          value={candidate.overallScore}
                          showValue={false}
                          color={candidate.ranking === 1 ? 'emerald' : 'blue' as any}
                        />
                      </div>
                      <div className="w-16 text-right font-bold text-primary-900">
                        {candidate.overallScore} 分
                      </div>
                      <div className="w-24 text-right">
                        {getRankingBadge(candidate.ranking)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {comparisonData.length === 0 && (
            <div className="card p-16 text-center">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 size={48} className="text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-primary-900 mb-2">多候选人对比</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                选择多位候选人后，系统将进行横向对比分析，并给出综合排名和录用建议
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
