import { Users, Target, TrendingUp, Award, Zap, Briefcase, GraduationCap, Code2, Star } from 'lucide-react';
import type { TalentProfileMatchResult, FitPoint } from '../../../shared/types';

interface TalentProfileMatchProps {
  data: TalentProfileMatchResult;
}

const categoryIcons: Record<string, typeof Users> = {
  skill: Code2,
  project: Briefcase,
  career: TrendingUp,
  strength: Award,
};

const categoryLabels: Record<string, string> = {
  skill: '技能',
  project: '项目',
  career: '职业',
  strength: '特质',
};

const categoryColors: Record<string, string> = {
  skill: 'from-blue-500 to-cyan-500',
  project: 'from-emerald-500 to-teal-500',
  career: 'from-purple-500 to-violet-500',
  strength: 'from-amber-500 to-orange-500',
};

export default function TalentProfileMatch({ data }: TalentProfileMatchProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-slate-500';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-slate-400';
  };

  const FitPointCard = ({ fitPoint }: { fitPoint: FitPoint }) => {
    const Icon = categoryIcons[fitPoint.category] || Star;
    const gradient = categoryColors[fitPoint.category] || 'from-slate-500 to-slate-600';
    const label = categoryLabels[fitPoint.category] || '其他';

    return (
      <div className="p-5 bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg`}>
            <Icon size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
                {label}维度
              </span>
              <span className={`text-sm font-bold ${getScoreColor(fitPoint.confidence)}`}>
                {fitPoint.confidence}% 匹配
              </span>
            </div>
            <p className="text-base font-semibold text-primary-900 leading-relaxed mb-2">
              {fitPoint.description}
            </p>
            <p className="text-sm text-slate-500 flex items-center gap-1.5">
              <Zap size={14} className="text-amber-500 flex-shrink-0" />
              <span className="truncate">{fitPoint.evidence}</span>
            </p>
          </div>
        </div>
      </div>
    );
  };

  const MatchDimension = ({
    label,
    score,
    details,
    matchedItems,
    icon: Icon,
  }: {
    label: string;
    score: number;
    details: string;
    matchedItems: string[];
    icon: typeof Target;
  }) => (
    <div className="p-4 bg-slate-50 rounded-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
            <Icon size={16} className="text-primary-600" />
          </div>
          <span className="font-semibold text-primary-900">{label}</span>
        </div>
        <span className={`text-xl font-bold ${getScoreColor(score)}`}>
          {score}%
        </span>
      </div>
      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full ${getProgressColor(score)} transition-all duration-700 ease-out rounded-full`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-sm text-slate-600 mb-3">{details}</p>
      {matchedItems.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {matchedItems.slice(0, 5).map((item, i) => (
            <span
              key={i}
              className="text-xs px-2.5 py-1 bg-white text-primary-700 rounded-full border border-primary-100 font-medium"
            >
              {item}
            </span>
          ))}
          {matchedItems.length > 5 && (
            <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full">
              +{matchedItems.length - 5}
            </span>
          )}
        </div>
      )}
    </div>
  );

  const dimensions = [
    {
      label: '技能匹配',
      score: data.skillMatch.score,
      details: data.skillMatch.details,
      matchedItems: data.skillMatch.matchedSkills,
      icon: Code2,
    },
    {
      label: '项目匹配',
      score: data.projectMatch.score,
      details: data.projectMatch.details,
      matchedItems: data.projectMatch.matchedProjectTypes,
      icon: Briefcase,
    },
    {
      label: '职业轨迹',
      score: data.careerMatch.score,
      details: data.careerMatch.details,
      matchedItems: data.careerMatch.matchedTrajectory,
      icon: TrendingUp,
    },
    {
      label: '特质匹配',
      score: data.strengthMatch.score,
      details: data.strengthMatch.details,
      matchedItems: data.strengthMatch.matchedStrengths,
      icon: Award,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card p-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-100">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
              <Users size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold font-display text-primary-900 flex items-center gap-2">
                人才画像匹配
                <span className="text-xs font-normal px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">
                  智能分析
                </span>
              </h3>
              <p className="text-slate-500 text-sm mt-0.5">
                与公司 <span className="font-medium text-indigo-600">{data.matchedProfilePosition}</span> 绩优员工画像对比
              </p>
            </div>
          </div>
          <div className="flex-1 md:border-l md:border-indigo-200 md:pl-6">
            <div className="flex items-end gap-4">
              <div>
                <div className="text-sm text-slate-500 mb-1">匹配置信度</div>
                <div className={`text-5xl font-bold font-display ${getScoreColor(data.overallConfidence)}`}>
                  {data.overallConfidence}%
                </div>
              </div>
              <div className="flex-1 pb-2">
                <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-out rounded-full`}
                    style={{ width: `${data.overallConfidence}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-bold text-primary-900 mb-5 flex items-center gap-2">
          <Target size={20} className="text-indigo-500" />
          多维度匹配分析
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {dimensions.map((dim, i) => (
            <MatchDimension key={i} {...dim} />
          ))}
        </div>
      </div>

      {data.keyFitPoints.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-bold text-primary-900 mb-5 flex items-center gap-2">
            <Star size={20} className="text-amber-500" />
            关键契合点
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {data.keyFitPoints.map((fitPoint, i) => (
              <FitPointCard key={i} fitPoint={fitPoint} />
            ))}
          </div>
        </div>
      )}

      <div className="card p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100">
        <h3 className="text-lg font-bold text-primary-900 mb-3 flex items-center gap-2">
          <GraduationCap size={20} className="text-emerald-600" />
          成长潜力评估
        </h3>
        <p className="text-slate-700 leading-relaxed text-base">
          {data.potentialAssessment}
        </p>
      </div>
    </div>
  );
}
