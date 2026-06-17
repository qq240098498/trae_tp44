import { useState, useEffect } from 'react';
import {
  FileSearch,
  Upload,
  User,
  Briefcase,
  GraduationCap,
  Code2,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  ChevronRight,
  Eye,
  AlertCircle,
  Zap,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  BookOpen,
  Target,
  Flag,
  Copy,
  Sparkles,
} from 'lucide-react';
import type { Resume, ResumeRedFlag, InterviewQuestion } from '../../shared/types';
import { useAppStore } from '../store';
import { api } from '../utils/api';
import ScoreBadge from '../components/ui/ScoreBadge';
import ProgressBar from '../components/ui/ProgressBar';
import RadarChart from '../components/ui/RadarChart';
import TalentProfileMatch from '../components/ui/TalentProfileMatch';
import { mockResumes } from '../data/mockData';
import { copyToClipboard } from '../utils/helpers';

const severityConfig = {
  high: { label: '高风险', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200', dotColor: 'bg-red-500' },
  medium: { label: '中风险', color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-200', dotColor: 'bg-amber-500' },
  low: { label: '低风险', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', dotColor: 'bg-blue-500' },
};

const redFlagTypeLabel: Record<string, string> = {
  noQuantifiedAchievement: '成就未量化',
  frequentJobChange: '频繁跳槽',
  skillGap: '技能缺口',
  careerGap: '职业空窗',
  unclearResponsibility: '职责不清',
  overqualified: '资历过高',
  underqualified: '资历不足',
};

const categoryConfig = {
  basicInfo: {
    label: '基础信息',
    icon: User,
    color: 'from-slate-500 to-slate-600',
    bgColor: 'bg-slate-50',
    textColor: 'text-slate-700',
    borderColor: 'border-slate-200',
  },
  followUp: {
    label: '针对性追问',
    icon: Zap,
    color: 'from-rose-500 to-rose-600',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-700',
    borderColor: 'border-rose-200',
  },
  professional: {
    label: '专业能力',
    icon: Code2,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
  },
  softSkill: {
    label: '软技能',
    icon: User,
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
};

const difficultyConfig = {
  easy: { label: '简单', color: 'bg-emerald-100 text-emerald-700' },
  medium: { label: '中等', color: 'bg-amber-100 text-amber-700' },
  hard: { label: '困难', color: 'bg-red-100 text-red-700' },
};

const sourceLabel: Record<string, string> = {
  base: '基础题库',
  jd: '职位匹配',
  resume: '简历匹配',
  redFlag: '疑点追问',
};

export default function ResumeScreening() {
  const {
    currentJobPosition,
    setCurrentResume,
    currentResume,
    currentEvaluation,
    setCurrentEvaluation,
    setLoading,
    loading,
    resumes,
    setResumes,
    talentProfilesLoaded,
    loadTalentProfiles,
    setResumeAnalysis,
    setFollowUpQuestions,
    setBasicInfoQuestions,
    resumeAnalysis,
    followUpQuestions,
    basicInfoQuestions,
  } = useAppStore();

  const [resumeContent, setResumeContent] = useState('');
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [biasInfo, setBiasInfo] = useState<{ detectedFields: string[]; maskedFields: string[]; isFair: boolean } | null>(null);
  const [expandedRedFlags, setExpandedRedFlags] = useState<Set<string>>(new Set());
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [copiedQuestionId, setCopiedQuestionId] = useState<string | null>(null);
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const [showAllQuestions, setShowAllQuestions] = useState(false);

  useEffect(() => {
    setResumes(mockResumes);
  }, [setResumes]);

  useEffect(() => {
    if (!talentProfilesLoaded) {
      loadTalentProfiles();
    }
  }, [talentProfilesLoaded, loadTalentProfiles]);

  const handleUpload = async () => {
    if (!resumeContent.trim()) return;
    setLoading(true);
    try {
      const result = await api.resume.upload(resumeContent);
      setCurrentResume(result.resume);
      setBiasInfo(result.biasCheck);
      setSelectedResumeId(result.resume.id);
    } catch (error) {
      console.error('上传简历失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectResume = (resume: Resume) => {
    setCurrentResume(resume);
    setSelectedResumeId(resume.id);
    setBiasInfo(null);
    setShowEvaluation(false);
    setResumeAnalysis(null);
    setFollowUpQuestions([]);
    setBasicInfoQuestions([]);
    setExpandedRedFlags(new Set());
    setExpandedQuestions(new Set());
  };

  const handleEvaluate = async () => {
    if (!selectedResumeId || !currentJobPosition) return;
    setLoading(true);
    try {
      const result = await api.resume.evaluate(selectedResumeId, currentJobPosition.id);
      setCurrentEvaluation(result);
      if (result.resumeAnalysis) {
        setResumeAnalysis(result.resumeAnalysis);
      }
      setShowEvaluation(true);
    } catch (error) {
      console.error('评估简历失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFollowUp = async () => {
    if (!selectedResumeId) return;
    setGeneratingQuestions(true);
    try {
      const result = await api.interviewQuestions.generateFollowUp(
        selectedResumeId,
        currentJobPosition?.id
      );
      setFollowUpQuestions(result.questions);
      setResumeAnalysis(result.analysis);
    } catch (error) {
      console.error('生成追问题目失败:', error);
    } finally {
      setGeneratingQuestions(false);
    }
  };

  const handleGenerateBasicQuestions = async () => {
    if (!currentJobPosition) return;
    setGeneratingQuestions(true);
    try {
      const questions = await api.interviewQuestions.generateBasicQuestions(
        currentJobPosition.id,
        selectedResumeId || undefined
      );
      setBasicInfoQuestions(questions);
    } catch (error) {
      console.error('生成基础问题失败:', error);
    } finally {
      setGeneratingQuestions(false);
    }
  };

  const toggleRedFlag = (id: string) => {
    const newSet = new Set(expandedRedFlags);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedRedFlags(newSet);
  };

  const toggleQuestion = (id: string) => {
    const newSet = new Set(expandedQuestions);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedQuestions(newSet);
  };

  const handleCopyQuestion = async (question: InterviewQuestion) => {
    await copyToClipboard(question.question);
    setCopiedQuestionId(question.id);
    setTimeout(() => setCopiedQuestionId(null), 2000);
  };

  const getSkillMatchColor = (matchLevel: string) => {
    switch (matchLevel) {
      case 'exact': return 'text-emerald-600';
      case 'partial': return 'text-amber-600';
      default: return 'text-slate-400';
    }
  };

  const getSkillMatchIcon = (matchLevel: string) => {
    switch (matchLevel) {
      case 'exact': return <CheckCircle2 size={16} className="text-emerald-500" />;
      case 'partial': return <AlertTriangle size={16} className="text-amber-500" />;
      default: return <div className="w-4 h-4 rounded-full border-2 border-slate-300" />;
    }
  };

  const radarData = currentEvaluation ? [
    { subject: '技能匹配', score: currentEvaluation.skillMatch.score },
    { subject: '经验相关', score: currentEvaluation.experienceRelevance.score },
    { subject: '发展潜力', score: currentEvaluation.potential.score },
    ...(currentEvaluation.talentProfileMatch ? [
      { subject: '人才画像', score: currentEvaluation.talentProfileMatch.overallConfidence },
    ] : []),
  ] : [];

  const allQuestions = [
    ...basicInfoQuestions,
    ...followUpQuestions,
  ];

  const displayQuestions = showAllQuestions ? allQuestions : allQuestions.slice(0, 6);

  const renderRedFlagCard = (redFlag: ResumeRedFlag) => {
    const config = severityConfig[redFlag.severity];
    const isExpanded = expandedRedFlags.has(redFlag.id);

    return (
      <div
        key={redFlag.id}
        className={`p-4 rounded-xl border-l-4 ${config.borderColor} ${config.bgColor} transition-all`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${config.dotColor}`} />
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-white ${config.color}`}>
                {config.label}
              </span>
              <span className="text-xs text-slate-500">
                {redFlagTypeLabel[redFlag.type] || redFlag.type}
              </span>
            </div>
            <h4 className="font-semibold text-slate-800">{redFlag.title}</h4>
            <p className="text-sm text-slate-600 mt-1">{redFlag.description}</p>
          </div>
          <button
            onClick={() => toggleRedFlag(redFlag.id)}
            className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-200 animate-fade-in space-y-4">
            {redFlag.evidence.length > 0 && (
              <div>
                <h5 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Flag size={14} />
                  证据依据
                </h5>
                <ul className="space-y-1">
                  {redFlag.evidence.map((ev, i) => (
                    <li key={i} className="text-sm text-slate-600 flex gap-2">
                      <span className="text-accent-blue">•</span>
                      {ev}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <h5 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Lightbulb size={14} />
                面试建议
              </h5>
              <p className="text-sm text-slate-600 bg-white/60 p-3 rounded-lg">
                {redFlag.suggestion}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderQuestionCard = (question: InterviewQuestion, index: number) => {
    const config = categoryConfig[question.category as keyof typeof categoryConfig] || categoryConfig.professional;
    const Icon = config.icon;
    const isExpanded = expandedQuestions.has(question.id);

    return (
      <div
        key={question.id}
        className={`card p-5 border-l-4 ${config.borderColor} animate-slide-up`}
        style={{ animationDelay: `${index * 40}ms` }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <div className={`w-7 h-7 bg-gradient-to-br ${config.color} rounded-lg flex items-center justify-center text-white`}>
                <Icon size={14} />
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.bgColor} ${config.textColor}`}>
                {config.label}
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${difficultyConfig[question.difficulty].color}`}>
                {difficultyConfig[question.difficulty].label}
              </span>
              {question.source && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {sourceLabel[question.source] || question.source}
                </span>
              )}
            </div>
            <h4 className="font-semibold text-primary-900 text-sm">{question.question}</h4>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleCopyQuestion(question)}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-primary-900 transition-colors"
              >
                {copiedQuestionId === question.id ? (
                  <><CheckCircle2 size={12} className="text-emerald-500" /> 已复制</>
                ) : (
                  <><Copy size={12} /> 复制</>
                )}
              </button>
              <button
                onClick={() => toggleQuestion(question.id)}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-primary-900 transition-colors"
              >
                {isExpanded ? (
                  <><ChevronUp size={12} /> 收起</>
                ) : (
                  <><ChevronDown size={12} /> 展开要点</>
                )}
              </button>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-100 animate-fade-in">
            <h5 className="text-sm font-semibold text-primary-900 mb-2 flex items-center gap-2">
              <BookOpen size={14} />
              考察要点
            </h5>
            <ul className="space-y-1">
              {question.expectedPoints.map((point, i) => (
                <li key={i} className="text-sm text-slate-600 flex gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  {point}
                </li>
              ))}
            </ul>
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
            <FileSearch size={20} />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-display text-primary-900">
              简历筛选评估
            </h1>
            <p className="text-slate-500">多维度综合评估候选人，自动识别疑点并生成针对性追问题目</p>
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
                在评估简历之前，需要先生成目标职位的职位描述。请前往"职位描述生成"页面创建。
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="card p-6">
            <h3 className="font-bold text-primary-900 mb-4 flex items-center gap-2">
              <User size={18} />
              候选人列表
            </h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  onClick={() => handleSelectResume(resume)}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    selectedResumeId === resume.id
                      ? 'bg-primary-900 text-white shadow-lg'
                      : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`font-semibold ${selectedResumeId === resume.id ? 'text-white' : 'text-primary-900'}`}>
                        {resume.name}
                      </div>
                      <div className={`text-sm ${selectedResumeId === resume.id ? 'text-blue-100' : 'text-slate-500'}`}>
                        {resume.experience[0]?.position || '待解析'}
                      </div>
                    </div>
                    <ChevronRight size={18} className={selectedResumeId === resume.id ? 'text-white' : 'text-slate-400'} />
                  </div>
                  {resume.education[0] && (
                    <div className={`text-xs mt-1 ${selectedResumeId === resume.id ? 'text-blue-200' : 'text-slate-400'}`}>
                      {resume.education[0].school} · {resume.education[0].degree}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-primary-900 mb-4 flex items-center gap-2">
              <Upload size={18} />
              上传新简历
            </h3>
            <textarea
              value={resumeContent}
              onChange={(e) => setResumeContent(e.target.value)}
              className="input-field min-h-[120px] mb-4"
              placeholder="粘贴简历内容，系统将自动解析并屏蔽敏感信息..."
            />
            <button
              onClick={handleUpload}
              disabled={loading || !resumeContent.trim()}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw size={16} className="animate-spin" /> : <Upload size={16} />}
              解析简历
            </button>
          </div>

          <div className="card p-6 bg-gradient-to-br from-primary-900/5 to-blue-50">
            <h3 className="font-bold text-primary-900 mb-4 flex items-center gap-2">
              <ShieldCheck size={18} />
              公平性保障
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              系统自动屏蔽候选人的敏感信息，确保评估过程客观公正。
            </p>
            <div className="space-y-2">
              {['性别', '年龄', '出生日期', '婚姻状况', '籍贯/户口'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span className="text-slate-600">{item} 已屏蔽</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          {currentResume && (
            <>
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-900 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold font-display">
                      {currentResume.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold font-display text-primary-900">
                        {currentResume.name}
                      </h2>
                      <p className="text-slate-500">
                        {currentResume.experience[0]?.position} · {currentResume.experience.length} 段工作经历
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleEvaluate}
                    disabled={loading || !currentJobPosition}
                    className="btn-primary flex items-center gap-2"
                  >
                    {loading ? (
                      <RefreshCw size={18} className="animate-spin" />
                    ) : (
                      <Eye size={18} />
                    )}
                    {loading ? '评估中...' : '开始评估'}
                  </button>
                </div>

                {biasInfo && biasInfo.detectedFields.length > 0 && (
                  <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex gap-3">
                      <AlertTriangle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-amber-800 mb-2">敏感信息已屏蔽</h4>
                        <p className="text-sm text-amber-700">
                          已检测并屏蔽以下字段：{biasInfo.detectedFields.join('、')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-primary-900 mb-3 flex items-center gap-2">
                      <Briefcase size={16} />
                      工作经历
                    </h4>
                    <div className="space-y-4">
                      {currentResume.experience.map((exp, i) => (
                        <div key={i} className="p-4 bg-slate-50 rounded-xl">
                          <div className="font-medium text-primary-900">{exp.position}</div>
                          <div className="text-sm text-slate-500">{exp.company}</div>
                          <div className="text-xs text-slate-400 mt-1">{exp.startDate} - {exp.endDate}</div>
                          {exp.achievements.length > 0 && (
                            <ul className="mt-2 space-y-1 text-sm text-slate-600">
                              {exp.achievements.slice(0, 2).map((ach, j) => (
                                <li key={j} className="flex gap-2">
                                  <span className="text-accent-blue">•</span>
                                  {ach}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-primary-900 mb-3 flex items-center gap-2">
                      <GraduationCap size={16} />
                      教育背景
                    </h4>
                    <div className="space-y-4">
                      {currentResume.education.map((edu, i) => (
                        <div key={i} className="p-4 bg-slate-50 rounded-xl">
                          <div className="font-medium text-primary-900">{edu.school}</div>
                          <div className="text-sm text-slate-500">{edu.degree} · {edu.major}</div>
                          <div className="text-xs text-slate-400 mt-1">{edu.startDate} - {edu.endDate}</div>
                        </div>
                      ))}
                    </div>

                    <h4 className="font-semibold text-primary-900 mb-3 mt-6 flex items-center gap-2">
                      <Code2 size={16} />
                      技能标签
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {currentResume.skills.map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {resumeAnalysis && resumeAnalysis.redFlags.length > 0 && (
                <div className="card p-6 bg-gradient-to-br from-rose-50/50 to-amber-50/50 border-rose-100">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-lg font-bold font-display text-primary-900 flex items-center gap-2">
                        <AlertCircle size={20} className="text-rose-500" />
                        简历疑点分析
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        检测到 {resumeAnalysis.redFlags.length} 处需要关注的疑点，建议面试中重点追问
                      </p>
                    </div>
                    <button
                      onClick={handleGenerateFollowUp}
                      disabled={generatingQuestions}
                      className="btn-secondary flex items-center gap-2 text-sm"
                    >
                      {generatingQuestions ? (
                        <RefreshCw size={16} className="animate-spin" />
                      ) : (
                        <Sparkles size={16} />
                      )}
                      {generatingQuestions ? '生成中...' : '生成追问题目'}
                    </button>
                  </div>

                  {resumeAnalysis.strengths.length > 0 && (
                    <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <h4 className="text-sm font-semibold text-emerald-800 mb-2 flex items-center gap-2">
                        <Sparkles size={14} />
                        候选人亮点
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {resumeAnalysis.strengths.map((s, i) => (
                          <span key={i} className="px-2 py-1 bg-white text-emerald-700 rounded text-xs font-medium border border-emerald-200">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {resumeAnalysis.redFlags.map(renderRedFlagCard)}
                  </div>
                </div>
              )}

              {!resumeAnalysis && currentResume && (
                <div className="card p-6 bg-gradient-to-br from-slate-50 to-blue-50/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold font-display text-primary-900 flex items-center gap-2">
                        <Sparkles size={20} className="text-blue-500" />
                        智能面试题库
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        点击下方按钮，系统将自动分析简历疑点并生成针对性追问题目
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleGenerateBasicQuestions}
                        disabled={generatingQuestions || !currentJobPosition}
                        className="btn-secondary flex items-center gap-2 text-sm"
                      >
                        <BookOpen size={16} />
                        基础问题
                      </button>
                      <button
                        onClick={handleGenerateFollowUp}
                        disabled={generatingQuestions || !currentResume}
                        className="btn-primary flex items-center gap-2 text-sm"
                      >
                        {generatingQuestions ? (
                          <RefreshCw size={16} className="animate-spin" />
                        ) : (
                          <Sparkles size={16} />
                        )}
                        {generatingQuestions ? '生成中...' : '智能生成'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {allQuestions.length > 0 && (
                <div className="space-y-6 animate-slide-up">
                  <div className="card p-6">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h3 className="text-lg font-bold font-display text-primary-900 flex items-center gap-2">
                          <Lightbulb size={20} className="text-amber-500" />
                          智能面试题库
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                          共 {allQuestions.length} 道题目
                          {basicInfoQuestions.length > 0 && ` · 基础信息 ${basicInfoQuestions.length} 题`}
                          {followUpQuestions.length > 0 && ` · 针对性追问 ${followUpQuestions.length} 题`}
                        </p>
                      </div>
                      {allQuestions.length > 6 && (
                        <button
                          onClick={() => setShowAllQuestions(!showAllQuestions)}
                          className="text-sm text-primary-900 hover:underline flex items-center gap-1"
                        >
                          {showAllQuestions ? (
                            <><ChevronUp size={14} /> 收起</>
                          ) : (
                            <><ChevronDown size={14} /> 查看全部</>
                          )}
                        </button>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {displayQuestions.map((q, i) => renderQuestionCard(q, i))}
                    </div>
                  </div>
                </div>
              )}

              {showEvaluation && currentEvaluation && (
                <div className="space-y-6 animate-slide-up">
                  <div className="card p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold font-display text-primary-900 flex items-center gap-2">
                        <TrendingUp size={22} />
                        综合评估结果
                      </h3>
                      <ScoreBadge score={currentEvaluation.overallScore} size="lg" />
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                      <div>
                        <RadarChart data={radarData} height={280} color="#3B82F6" />
                      </div>
                      <div className="space-y-6">
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
                  </div>

                  <div className="card p-6">
                    <h3 className="text-lg font-bold text-primary-900 mb-4">技能匹配详情</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {currentEvaluation.skillMatch.details.map((detail, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          {getSkillMatchIcon(detail.matchLevel)}
                          <span className={`font-medium ${getSkillMatchColor(detail.matchLevel)}`}>
                            {detail.skill}
                          </span>
                          {detail.required && (
                            <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                              必备
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card p-6">
                    <h3 className="text-lg font-bold text-primary-900 mb-4">发展潜力评估</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {currentEvaluation.potential.details.map((detail, i) => (
                        <div key={i} className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-primary-900">{detail.factor}</span>
                            <span className="text-purple-600 font-bold">{detail.score} 分</span>
                          </div>
                          <p className="text-sm text-slate-600">{detail.evidence}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {currentEvaluation.experienceRelevance.details.length > 0 && (
                    <div className="card p-6">
                      <h3 className="text-lg font-bold text-primary-900 mb-4">经验相关性分析</h3>
                      <div className="space-y-3">
                        {currentEvaluation.experienceRelevance.details.map((detail, i) => (
                          <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              detail.relevance === 'high' ? 'bg-emerald-100 text-emerald-700' :
                              detail.relevance === 'medium' ? 'bg-amber-100 text-amber-700' :
                              'bg-slate-200 text-slate-600'
                            }`}>
                              {detail.relevance === 'high' ? '高度相关' :
                               detail.relevance === 'medium' ? '中等相关' : '一般'}
                            </div>
                            <div>
                              <p className="text-slate-700">{detail.description}</p>
                              <p className="text-sm text-slate-500 mt-1">{detail.years} 年相关经验</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentEvaluation.talentProfileMatch && (
                    <TalentProfileMatch data={currentEvaluation.talentProfileMatch} />
                  )}
                </div>
              )}
            </>
          )}

          {!currentResume && (
            <div className="card p-16 text-center">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileSearch size={48} className="text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-primary-900 mb-2">选择候选人</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                从左侧列表选择一位候选人，或上传新的简历进行解析和评估
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
