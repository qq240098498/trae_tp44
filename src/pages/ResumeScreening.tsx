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
} from 'lucide-react';
import type { Resume, EvaluationResult, JobPosition } from '../../shared/types';
import { useAppStore } from '../store';
import { api } from '../utils/api';
import ScoreBadge from '../components/ui/ScoreBadge';
import ProgressBar from '../components/ui/ProgressBar';
import RadarChart from '../components/ui/RadarChart';
import { mockResumes } from '../data/mockData';

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
  } = useAppStore();

  const [resumeContent, setResumeContent] = useState('');
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [biasInfo, setBiasInfo] = useState<{ detectedFields: string[]; maskedFields: string[]; isFair: boolean } | null>(null);

  useEffect(() => {
    setResumes(mockResumes);
  }, [setResumes]);

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
  };

  const handleEvaluate = async () => {
    if (!selectedResumeId || !currentJobPosition) return;
    setLoading(true);
    try {
      const result = await api.resume.evaluate(selectedResumeId, currentJobPosition.id);
      setCurrentEvaluation(result);
      setShowEvaluation(true);
    } catch (error) {
      console.error('评估简历失败:', error);
    } finally {
      setLoading(false);
    }
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
  ] : [];

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
            <p className="text-slate-500">多维度综合评估候选人，自动屏蔽敏感信息</p>
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
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
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
              className="input-field min-h-[150px] mb-4"
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
