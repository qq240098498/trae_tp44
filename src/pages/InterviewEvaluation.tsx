import { useState, useEffect } from 'react';
import {
  ClipboardList,
  Brain,
  Users,
  Target,
  Star,
  Send,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ThumbsUp,
  AlertCircle,
  Download,
  FileText,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import type { InterviewEvaluation, Resume } from '../../shared/types';
import { useAppStore } from '../store';
import { api } from '../utils/api';
import ScoreBadge from '../components/ui/ScoreBadge';
import ProgressBar from '../components/ui/ProgressBar';
import RadarChart from '../components/ui/RadarChart';
import { downloadFile } from '../utils/helpers';
import { mockResumes } from '../../api/data/mockData';

interface EvaluationFormData {
  professionalScore: number;
  softSkillScore: number;
  culturalFitScore: number;
  notes: string;
  overallComment: string;
}

const scoreDescriptors = [
  { score: 20, label: '很差', desc: '完全不符合要求' },
  { score: 40, label: '较差', desc: '基本不符合要求' },
  { score: 60, label: '一般', desc: '基本符合要求' },
  { score: 80, label: '良好', desc: '较好地符合要求' },
  { score: 100, label: '优秀', desc: '远超预期要求' },
];

const scoreCriteria = {
  professional: [
    '专业知识掌握程度',
    '技术深度和广度',
    '解决问题的能力',
    '学习能力和适应性',
    '过往项目经验质量',
  ],
  softSkill: [
    '沟通表达能力',
    '团队协作精神',
    '领导力和影响力',
    '抗压能力',
    '逻辑思维能力',
  ],
  culturalFit: [
    '价值观匹配度',
    '工作态度和积极性',
    '责任感和可靠性',
    '创新意识',
    '与团队的融合度',
  ],
};

export default function InterviewEvaluationPage() {
  const {
    currentJobPosition,
    currentResume,
    setCurrentResume,
    currentInterviewEvaluation,
    setCurrentInterviewEvaluation,
    setLoading,
    loading,
    resumes,
    setResumes,
  } = useAppStore();

  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<{
    summary: string;
    strengths: string[];
    improvements: string[];
    overallScore: number;
  } | null>(null);
  const [step, setStep] = useState<'select' | 'evaluate' | 'result'>('select');

  const { register, handleSubmit, watch, formState: { errors } } = useForm<EvaluationFormData>({
    defaultValues: {
      professionalScore: 70,
      softSkillScore: 70,
      culturalFitScore: 70,
      notes: '',
      overallComment: '',
    },
  });

  const professionalScore = watch('professionalScore');
  const softSkillScore = watch('softSkillScore');
  const culturalFitScore = watch('culturalFitScore');

  useEffect(() => {
    setResumes(mockResumes);
  }, [setResumes]);

  const handleSelectResume = (resume: Resume) => {
    setCurrentResume(resume);
    setSelectedResumeId(resume.id);
    setStep('evaluate');
  };

  const onSubmit = async (data: EvaluationFormData) => {
    if (!selectedResumeId) return;
    setLoading(true);
    try {
      const result = await api.interviewEvaluation.submit({
        resumeId: selectedResumeId,
        scores: {
          professional: data.professionalScore,
          softSkill: data.softSkillScore,
          culturalFit: data.culturalFitScore,
        },
        notes: data.notes,
        overallComment: data.overallComment,
      });
      setCurrentInterviewEvaluation(result.evaluation);
      if (result.report) {
        setEvaluationResult(result.report);
      }
      setStep('result');
    } catch (error) {
      console.error('提交面试评价失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (!evaluationResult || !currentResume) return;
    const content = `
# 面试评价报告

## 候选人信息
- 姓名：${currentResume.name}
- 面试职位：${currentJobPosition?.title || '未指定'}
- 评价日期：${new Date().toLocaleDateString('zh-CN')}

## 综合评分
- 专业能力：${professionalScore} 分
- 软技能：${softSkillScore} 分
- 文化适配：${culturalFitScore} 分
- 综合得分：${evaluationResult.overallScore} 分

## 评估摘要
${evaluationResult.summary}

## 候选人优势
${evaluationResult.strengths.map(s => `- ${s}`).join('\n')}

## 待改进方面
${evaluationResult.improvements.map(s => `- ${s}`).join('\n')}

## 总体评价
${watch('overallComment') || '无'}

## 面试记录
${watch('notes') || '无'}
`.trim();
    downloadFile(content, `${currentResume.name}-面试评价报告.md`, 'text/markdown');
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'emerald';
    if (score >= 60) return 'blue';
    if (score >= 40) return 'amber';
    return 'red';
  };

  const radarData = [
    { subject: '专业能力', score: professionalScore },
    { subject: '软技能', score: softSkillScore },
    { subject: '文化适配', score: culturalFitScore },
  ];

  const averageScore = Math.round((professionalScore + softSkillScore + culturalFitScore) / 3);

  const ScoreSlider = ({
    label,
    field,
    criteria,
    icon: Icon,
    color,
  }: {
    label: string;
    field: 'professionalScore' | 'softSkillScore' | 'culturalFitScore';
    criteria: string[];
    icon: any;
    color: string;
  }) => {
    const score = watch(field);
    return (
      <div className="p-6 bg-slate-50 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center text-white`}>
              <Icon size={20} />
            </div>
            <h4 className="font-bold text-primary-900 text-lg">{label}</h4>
          </div>
          <div className="text-3xl font-bold font-display text-primary-900">
            {score}
          </div>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          step={5}
          {...register(field, { required: true, min: 0, max: 100 })}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />

        <div className="flex justify-between mt-2 text-xs text-slate-500">
          {scoreDescriptors.map((d) => (
            <span
              key={d.score}
              className={score >= d.score && score < d.score + 20 ? 'text-primary-900 font-semibold' : ''}
            >
              {d.label}
            </span>
          ))}
        </div>

        <div className="mt-4 p-4 bg-white rounded-xl">
          <h5 className="text-sm font-semibold text-primary-900 mb-2">评估参考维度</h5>
          <ul className="space-y-1">
            {criteria.map((c, i) => (
              <li key={i} className="text-sm text-slate-600 flex gap-2">
                <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
            <ClipboardList size={20} />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-display text-primary-900">
              面试评价
            </h1>
            <p className="text-slate-500">结构化记录面试表现，生成专业评估报告</p>
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
                在进行面试评价之前，需要先生成目标职位的职位描述。请前往"职位描述生成"页面创建。
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 mb-8">
        {[
          { step: 'select', label: '选择候选人', icon: Users },
          { step: 'evaluate', label: '进行评价', icon: Star },
          { step: 'result', label: '查看报告', icon: FileText },
        ].map((item, i) => {
          const Icon = item.icon;
          const isActive = step === item.step;
          const isPast = ['select', 'evaluate', 'result'].indexOf(step) > i;
          return (
            <div key={item.step} className="flex items-center">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'bg-primary-900 text-white shadow-lg'
                    : isPast
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                <Icon size={16} />
                <span className="font-medium text-sm">{item.label}</span>
              </div>
              {i < 2 && (
                <div className={`w-8 h-0.5 mx-2 ${
                  isPast ? 'bg-emerald-500' : 'bg-slate-200'
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {step === 'select' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              onClick={() => handleSelectResume(resume)}
              className="card p-6 cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-900 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold font-display">
                  {resume.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-primary-900 text-lg">{resume.name}</h3>
                  <p className="text-sm text-slate-500">{resume.experience[0]?.position}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>工作经验</span>
                  <span className="font-medium">{resume.experience.length} 段</span>
                </div>
                <div className="flex justify-between">
                  <span>最高学历</span>
                  <span className="font-medium">{resume.education[0]?.degree}</span>
                </div>
                <div className="flex justify-between">
                  <span>技能数量</span>
                  <span className="font-medium">{resume.skills.length} 项</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex flex-wrap gap-1.5">
                  {resume.skills.slice(0, 4).map((skill, i) => (
                    <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                  {resume.skills.length > 4 && (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                      +{resume.skills.length - 4}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {step === 'evaluate' && currentResume && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                    面试职位：{currentJobPosition?.title || '未指定'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-500">当前平均分</div>
                <div className="text-4xl font-bold font-display text-primary-900">{averageScore}</div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-6 rounded-2xl">
                <RadarChart data={radarData} height={280} color="#3B82F6" />
              </div>
              <div className="space-y-4">
                <ProgressBar
                  label="专业能力"
                  value={professionalScore}
                  color={getScoreColor(professionalScore) as any}
                />
                <ProgressBar
                  label="软技能"
                  value={softSkillScore}
                  color={getScoreColor(softSkillScore) as any}
                />
                <ProgressBar
                  label="文化适配"
                  value={culturalFitScore}
                  color={getScoreColor(culturalFitScore) as any}
                />
                <div className="mt-6 p-4 bg-gradient-to-r from-primary-900 to-blue-600 rounded-xl text-white">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">综合评分</span>
                    <ScoreBadge score={averageScore} size="md" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <ScoreSlider
              label="专业能力"
              field="professionalScore"
              criteria={scoreCriteria.professional}
              icon={Brain}
              color="from-blue-500 to-blue-600"
            />
            <ScoreSlider
              label="软技能"
              field="softSkillScore"
              criteria={scoreCriteria.softSkill}
              icon={Users}
              color="from-emerald-500 to-emerald-600"
            />
            <ScoreSlider
              label="文化适配"
              field="culturalFitScore"
              criteria={scoreCriteria.culturalFit}
              icon={Target}
              color="from-purple-500 to-purple-600"
            />
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-primary-900 text-lg mb-4">面试记录</h3>
            <textarea
              {...register('notes')}
              className="input-field min-h-[150px]"
              placeholder="记录面试过程中的关键信息、候选人的回答细节、特殊表现等..."
            />
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-primary-900 text-lg mb-4">总体评价</h3>
            <textarea
              {...register('overallComment', { required: '请填写总体评价' })}
              className="input-field min-h-[120px]"
              placeholder="总结候选人的整体表现、核心优势、主要不足，以及是否推荐进入下一轮或录用..."
            />
            {errors.overallComment && (
              <p className="mt-2 text-sm text-red-500">{errors.overallComment.message}</p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setStep('select')}
              className="btn-secondary flex-1"
            >
              返回选择
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 py-4 text-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <RefreshCw size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
              {loading ? '生成中...' : '提交评价并生成报告'}
            </button>
          </div>
        </form>
      )}

      {step === 'result' && evaluationResult && currentResume && (
        <div className="space-y-6 animate-slide-up">
          <div className="card p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-900 to-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold font-display">
                  {currentResume.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-3xl font-bold font-display text-primary-900">
                    {currentResume.name}
                  </h2>
                  <p className="text-slate-500">
                    {currentJobPosition?.title} · 面试评价报告
                  </p>
                </div>
              </div>
              <div className="text-right">
                <ScoreBadge score={evaluationResult.overallScore} size="lg" />
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center justify-between p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                <div>
                  <div className="text-sm text-blue-600 font-medium">专业能力</div>
                  <div className="text-3xl font-bold text-blue-700">{professionalScore}</div>
                </div>
                <Brain size={40} className="text-blue-400" />
              </div>
              <div className="flex items-center justify-between p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl">
                <div>
                  <div className="text-sm text-emerald-600 font-medium">软技能</div>
                  <div className="text-3xl font-bold text-emerald-700">{softSkillScore}</div>
                </div>
                <Users size={40} className="text-emerald-400" />
              </div>
              <div className="flex items-center justify-between p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
                <div>
                  <div className="text-sm text-purple-600 font-medium">文化适配</div>
                  <div className="text-3xl font-bold text-purple-700">{culturalFitScore}</div>
                </div>
                <Target size={40} className="text-purple-400" />
              </div>
            </div>

            <div className="p-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl">
              <h3 className="font-bold text-primary-900 text-lg mb-3 flex items-center gap-2">
                <TrendingUp size={20} />
                评估摘要
              </h3>
              <p className="text-slate-700 leading-relaxed">{evaluationResult.summary}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="font-bold text-primary-900 text-lg mb-4 flex items-center gap-2">
                <ThumbsUp size={20} className="text-emerald-500" />
                候选人优势
              </h3>
              <ul className="space-y-3">
                {evaluationResult.strengths.map((s, i) => (
                  <li key={i} className="flex gap-3 p-3 bg-emerald-50 rounded-xl">
                    <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-6">
              <h3 className="font-bold text-primary-900 text-lg mb-4 flex items-center gap-2">
                <AlertCircle size={20} className="text-amber-500" />
                待改进方面
              </h3>
              <ul className="space-y-3">
                {evaluationResult.improvements.map((s, i) => (
                  <li key={i} className="flex gap-3 p-3 bg-amber-50 rounded-xl">
                    <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-primary-900 text-lg mb-4">雷达图分析</h3>
            <div className="max-w-md mx-auto">
              <RadarChart data={radarData} height={350} color="#3B82F6" />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep('select')}
              className="btn-secondary flex-1"
            >
              评价其他候选人
            </button>
            <button
              onClick={handleDownloadReport}
              className="btn-primary flex-1 py-4 text-lg flex items-center justify-center gap-2"
            >
              <Download size={20} />
              下载完整报告
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
