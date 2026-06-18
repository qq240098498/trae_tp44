import { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Users,
  TrendingDown,
  TrendingUp,
  Clock,
  MessageSquare,
  Target,
  Shield,
  Sparkles,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  BarChart3,
  UserCircle,
  Building2,
  Calendar,
  TrendingUp as TrendingUpIcon,
  AlertCircle,
  CheckCircle2,
  Zap,
  Heart,
  DollarSign,
  Brain,
  Award,
  Users as UsersIcon,
  ArrowRight,
  Activity,
  Info,
  Lightbulb,
} from 'lucide-react';
import { useAppStore } from '../store';
import { mockEmployees, generateMockRiskAssessment, generateAllMockRiskAssessments } from '../data/mockData';
import type { AttritionRiskAssessment, RiskLevel, RetentionStrategy } from '../../shared/types';

const riskLevelConfig: Record<RiskLevel, { label: string; color: string; bgColor: string; borderColor: string; textColor: string; iconColor: string }> = {
  low: {
    label: '低风险',
    color: 'from-emerald-500 to-green-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
    iconColor: 'text-emerald-500',
  },
  medium: {
    label: '中风险',
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
    iconColor: 'text-amber-500',
  },
  high: {
    label: '高风险',
    color: 'from-orange-500 to-red-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-700',
    iconColor: 'text-orange-500',
  },
  critical: {
    label: '极高风险',
    color: 'from-red-500 to-rose-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-700',
    iconColor: 'text-red-500',
  },
};

const signalCategoryConfig: Record<string, { label: string; icon: typeof Clock; color: string; bgColor: string }> = {
  attendance: {
    label: '出勤变化',
    icon: Calendar,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
  },
  overtime: {
    label: '加班频率',
    icon: Clock,
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
  },
  communication: {
    label: '沟通活跃度',
    icon: MessageSquare,
    color: 'from-violet-500 to-violet-600',
    bgColor: 'bg-violet-50',
  },
  project: {
    label: '项目参与度',
    icon: Target,
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-50',
  },
};

const strategyCategoryConfig: Record<RetentionStrategy['category'], { label: string; icon: typeof Brain; color: string; bgColor: string }> = {
  challenge: {
    label: '工作挑战',
    icon: Zap,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
  },
  growth: {
    label: '成长发展',
    icon: TrendingUpIcon,
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-50',
  },
  compensation: {
    label: '薪酬激励',
    icon: DollarSign,
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-50',
  },
  culture: {
    label: '团队文化',
    icon: Heart,
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-50',
  },
  worklife: {
    label: '工作生活平衡',
    icon: Shield,
    color: 'from-teal-500 to-teal-600',
    bgColor: 'bg-teal-50',
  },
  recognition: {
    label: '认可激励',
    icon: Award,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
  },
};

const priorityConfig: Record<RetentionStrategy['priority'], { label: string; color: string; badge: string }> = {
  immediate: {
    label: '立即执行',
    color: 'text-red-600',
    badge: 'bg-red-100 text-red-700 border-red-200',
  },
  short_term: {
    label: '短期推进',
    color: 'text-orange-600',
    badge: 'bg-orange-100 text-orange-700 border-orange-200',
  },
  medium_term: {
    label: '中期规划',
    color: 'text-amber-600',
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  long_term: {
    label: '长期机制',
    color: 'text-blue-600',
    badge: 'bg-blue-100 text-blue-700 border-blue-200',
  },
};

function RiskGauge({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' | 'lg' }) {
  const radius = size === 'sm' ? 36 : size === 'md' ? 60 : 80;
  const stroke = size === 'sm' ? 6 : size === 'md' ? 10 : 12;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const getColor = () => {
    if (score < 30) return '#10b981';
    if (score < 55) return '#f59e0b';
    if (score < 80) return '#f97316';
    return '#ef4444';
  };

  return (
    <div className={`relative flex items-center justify-center ${size === 'sm' ? 'w-20 h-20' : size === 'md' ? 'w-32 h-32' : 'w-44 h-44'}`}>
      <svg className="transform -rotate-90" width={radius * 2 + stroke * 2} height={radius * 2 + stroke * 2}>
        <circle
          cx={radius + stroke}
          cy={radius + stroke}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={stroke}
        />
        <circle
          cx={radius + stroke}
          cy={radius + stroke}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className={`font-bold ${size === 'sm' ? 'text-xl' : size === 'md' ? 'text-3xl' : 'text-5xl'}`} style={{ color: getColor() }}>
          {score}
        </span>
        <span className={`${size === 'sm' ? 'text-[10px]' : 'text-xs'} text-slate-500`}>风险分</span>
      </div>
    </div>
  );
}

function SparklineChart({ data, color = '#6366f1', height = 40 }: { data: Array<{ period: string; value: number }>; color?: string; height?: number }) {
  const max = Math.max(...data.map(d => d.value));
  const min = Math.min(...data.map(d => d.value));
  const range = max - min || 1;
  const width = 120;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d.value - min) / range) * (height - 8) - 4;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="relative w-full">
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="overflow-visible">
        <defs>
          <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline
          points={`0,${height} ${points} ${width},${height}`}
          fill={`url(#spark-${color.replace('#', '')})`}
        />
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="flex justify-between text-[10px] text-slate-400 mt-1">
        <span>{data[0]?.period}</span>
        <span>{data[data.length - 1]?.period}</span>
      </div>
    </div>
  );
}

function RiskBreakdownChart({ breakdown }: { breakdown: AttritionRiskAssessment['riskBreakdown'] }) {
  const items = [
    { key: 'attendance', label: '出勤风险', color: 'from-blue-400 to-blue-600', value: breakdown.attendance },
    { key: 'overtime', label: '加班风险', color: 'from-orange-400 to-orange-600', value: breakdown.overtime },
    { key: 'communication', label: '沟通风险', color: 'from-violet-400 to-violet-600', value: breakdown.communication },
    { key: 'project', label: '项目风险', color: 'from-indigo-400 to-indigo-600', value: breakdown.project },
    { key: 'performance', label: '绩效风险', color: 'from-amber-400 to-amber-600', value: breakdown.performance },
    { key: 'career', label: '发展风险', color: 'from-rose-400 to-rose-600', value: breakdown.career },
  ];

  return (
    <div className="space-y-3">
      {items.map(item => (
        <div key={item.key}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-slate-600">{item.label}</span>
            <span className={`text-xs font-bold ${item.value >= 70 ? 'text-red-600' : item.value >= 50 ? 'text-orange-600' : 'text-emerald-600'}`}>
              {item.value}分
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-700`}
              style={{ width: `${Math.min(item.value, 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AttritionRisk() {
  const {
    loading,
    setLoading,
    employees,
    setEmployees,
    selectedEmployeeId,
    setSelectedEmployeeId,
    attritionRiskAssessment,
    setAttritionRiskAssessment,
    riskAssessments,
    setRiskAssessments,
  } = useAppStore();

  const [viewMode, setViewMode] = useState<'overview' | 'detail'>('overview');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterRiskLevel, setFilterRiskLevel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'riskScore' | 'tenure'>('riskScore');
  const [expandedSignals, setExpandedSignals] = useState<Set<string>>(new Set());
  const [expandedStrategies, setExpandedStrategies] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState({
    totalEmployees: 0,
    highRiskCount: 0,
    mediumRiskCount: 0,
    lowRiskCount: 0,
    avgRiskScore: 0,
  });

  useEffect(() => {
    setEmployees(mockEmployees);
    const allAssessments = generateAllMockRiskAssessments();
    setRiskAssessments(allAssessments);

    const highRisk = allAssessments.filter(a => a.overallRiskLevel === 'high' || a.overallRiskLevel === 'critical').length;
    const mediumRisk = allAssessments.filter(a => a.overallRiskLevel === 'medium').length;
    const lowRisk = allAssessments.filter(a => a.overallRiskLevel === 'low').length;
    const avgScore = Math.round(allAssessments.reduce((sum, a) => sum + a.riskScore, 0) / allAssessments.length);

    setStats({
      totalEmployees: allAssessments.length,
      highRiskCount: highRisk,
      mediumRiskCount: mediumRisk,
      lowRiskCount: lowRisk,
      avgRiskScore: avgScore,
    });
  }, [setEmployees, setRiskAssessments]);

  const handleSelectEmployee = async (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const assessment = generateMockRiskAssessment(employeeId);
    setAttritionRiskAssessment(assessment);
    setViewMode('detail');
    setLoading(false);
  };

  const handleRefreshAll = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const allAssessments = generateAllMockRiskAssessments();
    setRiskAssessments(allAssessments);

    const highRisk = allAssessments.filter(a => a.overallRiskLevel === 'high' || a.overallRiskLevel === 'critical').length;
    const mediumRisk = allAssessments.filter(a => a.overallRiskLevel === 'medium').length;
    const lowRisk = allAssessments.filter(a => a.overallRiskLevel === 'low').length;
    const avgScore = Math.round(allAssessments.reduce((sum, a) => sum + a.riskScore, 0) / allAssessments.length);

    setStats({
      totalEmployees: allAssessments.length,
      highRiskCount: highRisk,
      mediumRiskCount: mediumRisk,
      lowRiskCount: lowRisk,
      avgRiskScore: avgScore,
    });
    setLoading(false);
  };

  const toggleSignal = (id: string) => {
    const newSet = new Set(expandedSignals);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedSignals(newSet);
  };

  const toggleStrategy = (id: string) => {
    const newSet = new Set(expandedStrategies);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedStrategies(newSet);
  };

  const departments = Array.from(new Set(mockEmployees.map(e => e.department)));

  const filteredAssessments = riskAssessments
    .filter(a => filterDepartment === 'all' || a.department === filterDepartment)
    .filter(a => filterRiskLevel === 'all' || a.overallRiskLevel === filterRiskLevel)
    .sort((a, b) => sortBy === 'riskScore' ? b.riskScore - a.riskScore : b.tenure - a.tenure);

  const currentAssessment = attritionRiskAssessment;

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-red-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h1 className="text-3xl font-bold font-display text-primary-900">
                  离职风险评估
                </h1>
                <p className="text-slate-500">
                  综合分析行为信号，识别高风险员工，推荐保留策略
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefreshAll}
              disabled={loading}
              className="btn-secondary flex items-center gap-2"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              刷新评估
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-lg">
              <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-rose-700">
                智能监控已启用
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card p-5 bg-gradient-to-br from-slate-50 to-white border-slate-200">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              <Users size={20} />
            </div>
            <BarChart3 size={16} className="text-slate-400" />
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">{stats.totalEmployees}</div>
          <div className="text-sm text-slate-500">评估员工总数</div>
        </div>

        <div className="card p-5 bg-gradient-to-br from-red-50 to-rose-50 border-red-100">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
              <AlertTriangle size={20} />
            </div>
            <TrendingUp size={16} className="text-red-500" />
          </div>
          <div className="text-3xl font-bold text-red-700 mb-1">{stats.highRiskCount}</div>
          <div className="text-sm text-red-600">高/极高风险</div>
        </div>

        <div className="card p-5 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
              <AlertCircle size={20} />
            </div>
            <Activity size={16} className="text-amber-500" />
          </div>
          <div className="text-3xl font-bold text-amber-700 mb-1">{stats.mediumRiskCount}</div>
          <div className="text-sm text-amber-600">中风险</div>
        </div>

        <div className="card p-5 bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Shield size={20} />
            </div>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <div className="text-3xl font-bold text-emerald-700 mb-1">{stats.lowRiskCount}</div>
          <div className="text-sm text-emerald-600">低风险 · 安全</div>
        </div>
      </div>

      {viewMode === 'overview' ? (
        <>
          <div className="card p-6 mb-6 bg-gradient-to-br from-blue-50 via-violet-50 to-pink-50 border-blue-100">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} className="text-blue-600" />
              <h3 className="font-bold text-slate-900">整体风险态势分析</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center justify-center p-4 bg-white/70 rounded-xl">
                <RiskGauge score={stats.avgRiskScore} size="lg" />
                <p className="mt-3 text-sm text-slate-600 text-center">
                  团队整体平均风险分数
                </p>
              </div>
              <div className="flex flex-col justify-center space-y-3 p-4 bg-white/70 rounded-xl">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-1.5">
                    <Info size={14} className="text-blue-500" />
                    风险分布（按部门）
                  </h4>
                  <div className="space-y-2">
                    {departments.map(dept => {
                      const deptAssess = riskAssessments.filter(a => a.department === dept);
                      const avgRisk = Math.round(deptAssess.reduce((s, a) => s + a.riskScore, 0) / (deptAssess.length || 1));
                      return (
                        <div key={dept} className="flex items-center gap-3">
                          <div className="w-20 text-xs font-medium text-slate-600">{dept}</div>
                          <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden flex">
                            {deptAssess.map(a => (
                              <div
                                key={a.id}
                                className={`h-full bg-gradient-to-r ${riskLevelConfig[a.overallRiskLevel].color}`}
                                style={{ width: `${100 / deptAssess.length}%` }}
                                title={`${a.employeeName}: ${riskLevelConfig[a.overallRiskLevel].label}`}
                              />
                            ))}
                          </div>
                          <div className={`w-12 text-right text-xs font-bold ${avgRisk >= 70 ? 'text-red-600' : avgRisk >= 50 ? 'text-orange-600' : 'text-emerald-600'}`}>
                            {avgRisk}分
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center p-4 bg-white/70 rounded-xl">
                <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-1.5">
                  <Zap size={14} className="text-violet-500" />
                  关键洞察
                </h4>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">!</span>
                    <p>识别出 <span className="font-bold text-rose-600">{stats.highRiskCount}名</span> 高风险员工，建议本周内启动干预措施</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">!</span>
                    <p>过度加班与成长停滞是 <span className="font-bold text-amber-600">Top2</span> 风险驱动因素</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">i</span>
                    <p>预计实施保留策略可降低 <span className="font-bold text-blue-600">60-70%</span> 离职概率</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6 mb-6">
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
              <h3 className="font-bold text-primary-900 text-lg flex items-center gap-2">
                <UsersIcon size={20} />
                员工风险清单
              </h3>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-slate-600">部门：</label>
                  <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                  >
                    <option value="all">全部部门</option>
                    {departments.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-slate-600">风险：</label>
                  <select
                    value={filterRiskLevel}
                    onChange={(e) => setFilterRiskLevel(e.target.value)}
                    className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                  >
                    <option value="all">全部等级</option>
                    <option value="critical">极高风险</option>
                    <option value="high">高风险</option>
                    <option value="medium">中风险</option>
                    <option value="low">低风险</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-slate-600">排序：</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'riskScore' | 'tenure')}
                    className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                  >
                    <option value="riskScore">按风险分数</option>
                    <option value="tenure">按在职年限</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">员工</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">部门/岗位</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">在职年限</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">风险等级</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">风险分数</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">触发指标数</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssessments.map((assessment, idx) => {
                    const riskConfig = riskLevelConfig[assessment.overallRiskLevel];
                    const triggeredCount = assessment.riskIndicators.filter(i => i.triggered).length;
                    return (
                      <tr
                        key={assessment.id}
                        className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                        style={{ animationDelay: `${idx * 30}ms` }}
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${riskConfig.color} flex items-center justify-center text-white font-bold shadow-sm`}>
                              {assessment.employeeName.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900">{assessment.employeeName}</div>
                              <div className="text-xs text-slate-500">{assessment.level === 'expert' ? '专家级' : assessment.level === 'senior' ? '高级' : assessment.level === 'mid' ? '中级' : '初级'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-slate-800 font-medium">{assessment.position}</div>
                          <div className="text-xs text-slate-500">{assessment.department}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-slate-800">{assessment.tenure}年</div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${riskConfig.bgColor} ${riskConfig.textColor} border ${riskConfig.borderColor}`}>
                            <span className={`w-1.5 h-1.5 rounded-full bg-current animate-pulse`}></span>
                            {riskConfig.label}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <RiskGauge score={assessment.riskScore} size="sm" />
                            <div className="text-xs text-slate-500">
                              <div>部门均值: {assessment.peerComparison.departmentAvgRiskScore}分</div>
                              <div>分位值: P{assessment.peerComparison.percentile}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 rounded-lg text-sm font-bold ${triggeredCount >= 4 ? 'bg-red-100 text-red-700' : triggeredCount >= 2 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                              {triggeredCount}/{assessment.riskIndicators.length}
                            </span>
                            <span className="text-xs text-slate-500">项触发</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => handleSelectEmployee(assessment.employeeId)}
                            className="inline-flex items-center gap-1 px-4 py-2 bg-primary-900 text-white text-sm font-medium rounded-lg hover:bg-primary-800 transition-colors"
                          >
                            查看详情
                            <ChevronRight size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : currentAssessment ? (
        <div className="space-y-6">
          <div className="card p-6 bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setViewMode('overview')}
                  className="p-2 hover:bg-white rounded-lg transition-colors text-slate-500 hover:text-slate-700"
                >
                  <ChevronRight size={20} className="rotate-180" />
                </button>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${riskLevelConfig[currentAssessment.overallRiskLevel].color} flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
                  {currentAssessment.employeeName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">{currentAssessment.employeeName}</h2>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <Building2 size={14} className="text-slate-400" />
                      {currentAssessment.department} · {currentAssessment.position}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <Calendar size={14} className="text-slate-400" />
                      在职 {currentAssessment.tenure} 年
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <UserCircle size={14} className="text-slate-400" />
                      {currentAssessment.level === 'expert' ? '专家级' : currentAssessment.level === 'senior' ? '高级' : currentAssessment.level === 'mid' ? '中级' : '初级'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <RiskGauge score={currentAssessment.riskScore} size="lg" />
                <div className="space-y-2">
                  <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold ${riskLevelConfig[currentAssessment.overallRiskLevel].bgColor} ${riskLevelConfig[currentAssessment.overallRiskLevel].textColor} border ${riskLevelConfig[currentAssessment.overallRiskLevel].borderColor}`}>
                    <AlertTriangle size={16} />
                    {riskLevelConfig[currentAssessment.overallRiskLevel].label}
                  </span>
                  <div className="text-xs text-slate-500 space-y-1">
                    <div>评估时间：{currentAssessment.assessmentDate.toLocaleDateString('zh-CN')}</div>
                    <div>有效期至：{currentAssessment.validUntil.toLocaleDateString('zh-CN')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              <div className="card p-6">
                <h3 className="font-bold text-primary-900 mb-5 flex items-center gap-2 text-lg">
                  <Activity size={20} className="text-blue-600" />
                  行为信号分析（6大维度）
                </h3>
                <div className="space-y-3">
                  {currentAssessment.behaviorSignals.map(signal => {
                    const config = signalCategoryConfig[signal.category] || signalCategoryConfig.attendance;
                    const Icon = config.icon;
                    const isExpanded = expandedSignals.has(signal.id);
                    const valueColor = signal.isAbnormal
                      ? signal.trend === 'down' && signal.category !== 'overtime' ? 'text-red-600'
                        : signal.trend === 'up' && signal.category === 'overtime' ? 'text-red-600'
                        : signal.trend === 'up' ? 'text-red-600' : 'text-orange-600'
                      : 'text-emerald-600';

                    return (
                      <div
                        key={signal.id}
                        className={`border rounded-xl overflow-hidden transition-all ${signal.isAbnormal ? 'border-red-100 bg-red-50/30' : 'border-emerald-100 bg-emerald-50/20'}`}
                      >
                        <div
                          className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/50"
                          onClick={() => toggleSignal(signal.id)}
                        >
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center text-white flex-shrink-0 shadow-sm`}>
                              <Icon size={18} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-slate-800">{signal.name}</span>
                                {signal.isAbnormal && (
                                  <span className="text-[10px] px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-semibold">
                                    异常
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-500 truncate">{signal.description}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-6 flex-shrink-0">
                            <div className="w-32">
                              <SparklineChart
                                data={signal.historicalData}
                                color={signal.isAbnormal ? '#ef4444' : '#10b981'}
                              />
                            </div>
                            <div className="text-right w-32">
                              <div className={`text-xl font-bold ${valueColor}`}>
                                {signal.currentValue.toFixed(signal.unit === '%' && signal.currentValue < 1 ? 2 : 0)}
                                <span className="text-sm font-normal text-slate-400 ml-1">{signal.unit}</span>
                              </div>
                              <div className={`text-xs font-medium flex items-center justify-end gap-1 ${signal.trend === 'down' && signal.category !== 'overtime' ? 'text-red-500' : signal.trend === 'up' && signal.category === 'overtime' ? 'text-red-500' : signal.trend === 'up' ? 'text-red-500' : 'text-emerald-500'}`}>
                                {signal.trend === 'up' ? <TrendingUp size={12} /> : signal.trend === 'down' ? <TrendingDown size={12} /> : <Activity size={12} />}
                                {signal.changeRate > 0 ? '+' : ''}{signal.changeRate.toFixed(0)}%
                              </div>
                            </div>
                            <div className="text-slate-400 hover:text-slate-600 transition-colors">
                              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </div>
                          </div>
                        </div>
                        {isExpanded && (
                          <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-white/60 animate-fade-in">
                            <div className="grid md:grid-cols-3 gap-4">
                              <div className="p-3 bg-slate-50 rounded-lg">
                                <div className="text-xs text-slate-500 mb-1">当前值</div>
                                <div className={`text-lg font-bold ${valueColor}`}>
                                  {signal.currentValue.toFixed(1)}{signal.unit}
                                </div>
                              </div>
                              <div className="p-3 bg-slate-50 rounded-lg">
                                <div className="text-xs text-slate-500 mb-1">基准值 / 阈值</div>
                                <div className="text-lg font-bold text-slate-700">
                                  {signal.baselineValue.toFixed(1)}{signal.unit}
                                </div>
                                <div className="text-[11px] text-slate-500 mt-1">
                                  预警线: {signal.threshold.warning} · 警戒线: {signal.threshold.critical}
                                </div>
                              </div>
                              <div className="p-3 bg-slate-50 rounded-lg">
                                <div className="text-xs text-slate-500 mb-1">权重占比</div>
                                <div className="text-lg font-bold text-indigo-600">
                                  {(signal.weight * 100).toFixed(0)}%
                                </div>
                                <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full"
                                    style={{ width: `${signal.weight * 100 * 5}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="card p-6 bg-gradient-to-br from-amber-50/50 via-white to-rose-50/50 border-amber-100">
                <h3 className="font-bold text-primary-900 mb-5 flex items-center gap-2 text-lg">
                  <AlertTriangle size={20} className="text-amber-600" />
                  风险指标详情 · 多项触发预警
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {currentAssessment.riskIndicators.map((indicator, idx) => {
                    const sevConfig = riskLevelConfig[indicator.severity];
                    return (
                      <div
                        key={indicator.id}
                        className="p-5 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${sevConfig.color} flex items-center justify-center text-white flex-shrink-0 shadow-sm`}>
                              <AlertTriangle size={18} />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 mb-1">{indicator.name}</div>
                              <div className="text-xs text-slate-500">{indicator.category}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-2xl font-bold ${sevConfig.textColor}`}>
                              {indicator.score}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${sevConfig.bgColor} ${sevConfig.textColor}`}>
                              {sevConfig.label}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 mb-4">{indicator.description}</p>
                        <div className="space-y-2 mb-4">
                          <div className="text-xs font-semibold text-slate-700">证据支持：</div>
                          {indicator.evidence.map((ev, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                              <CheckCircle2 size={12} className="text-red-400 flex-shrink-0 mt-0.5" />
                              <span>{ev}</span>
                            </div>
                          ))}
                        </div>
                        <div className={`p-3 rounded-lg ${sevConfig.bgColor} border ${sevConfig.borderColor}`}>
                          <div className="flex items-start gap-2">
                            <Lightbulb size={14} className={`${sevConfig.iconColor} flex-shrink-0 mt-0.5`} />
                            <p className={`text-xs ${sevConfig.textColor} leading-relaxed`}>
                              <span className="font-semibold">建议：</span>{indicator.suggestion}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="card p-6 bg-gradient-to-br from-slate-50 to-indigo-50 border-indigo-100">
                <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
                  <BarChart3 size={18} className="text-indigo-600" />
                  风险维度分解
                </h3>
                <RiskBreakdownChart breakdown={currentAssessment.riskBreakdown} />
                <div className="mt-5 pt-4 border-t border-indigo-100">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span>部门平均分位</span>
                    <span>该员工分位</span>
                  </div>
                  <div className="relative h-8 bg-slate-200 rounded-full overflow-hidden">
                    <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 via-amber-400 to-red-400" style={{ width: '100%' }} />
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-white shadow-lg rounded"
                      style={{ left: `${currentAssessment.peerComparison.departmentAvgRiskScore}%` }}
                    >
                      <div className="absolute -top-6 -translate-x-1/2 text-[10px] font-bold text-slate-700 whitespace-nowrap bg-white px-1.5 py-0.5 rounded shadow-sm">
                        部门均值 {currentAssessment.peerComparison.departmentAvgRiskScore}
                      </div>
                    </div>
                    <div
                      className="absolute top-0 bottom-0 w-1.5 bg-primary-900 shadow-lg rounded"
                      style={{ left: `${currentAssessment.riskScore}%` }}
                    >
                      <div className="absolute -bottom-6 -translate-x-1/2 text-[10px] font-bold text-primary-900 whitespace-nowrap bg-white px-1.5 py-0.5 rounded shadow-sm border border-primary-200">
                        该员工 {currentAssessment.riskScore}
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 text-center text-sm font-semibold text-slate-700">
                    风险分位值：<span className="text-indigo-600 text-lg">P{currentAssessment.peerComparison.percentile}</span>
                    <span className="text-xs font-normal text-slate-500 ml-2">（高于 {currentAssessment.peerComparison.percentile}% 同事）</span>
                  </div>
                </div>
              </div>

              <div className="card p-6 bg-gradient-to-br from-slate-900 to-indigo-900 text-white">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Sparkles size={18} className="text-yellow-300" />
                  AI 综合分析摘要
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-semibold text-yellow-300/90 mb-2 flex items-center gap-1.5">
                      <Zap size={12} /> 核心发现
                    </div>
                    <ul className="space-y-2">
                      {currentAssessment.summary.keyFindings.map((f, i) => (
                        <li key={i} className="text-sm text-slate-200 leading-relaxed pl-4 relative">
                          <span className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-yellow-400" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-3 border-t border-white/10">
                    <div className="text-xs font-semibold text-red-300/90 mb-2 flex items-center gap-1.5">
                      <AlertTriangle size={12} /> 紧急关注
                    </div>
                    <ul className="space-y-2">
                      {currentAssessment.summary.immediateConcerns.map((f, i) => (
                        <li key={i} className="text-sm text-slate-200 leading-relaxed pl-4 relative">
                          <span className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-red-400" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-3 border-t border-white/10">
                    <div className="text-xs font-semibold text-emerald-300/90 mb-2 flex items-center gap-1.5">
                      <CheckCircle2 size={12} /> 积极信号
                    </div>
                    <ul className="space-y-2">
                      {currentAssessment.summary.positiveSignals.map((f, i) => (
                        <li key={i} className="text-sm text-slate-200 leading-relaxed pl-4 relative">
                          <span className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 border-emerald-100">
            <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
              <div>
                <h3 className="font-bold text-primary-900 text-xl mb-2 flex items-center gap-2">
                  <Shield size={22} className="text-emerald-600" />
                  保留策略推荐 · 多维度干预方案
                </h3>
                <p className="text-sm text-slate-600">
                  基于风险诊断结果，推荐6大维度的系统性保留策略，按优先级排列执行顺序
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg border border-red-200">
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  立即执行 {currentAssessment.retentionStrategies.filter(s => s.priority === 'immediate').length}
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg border border-orange-200">
                  <span className="w-2 h-2 bg-orange-500 rounded-full" />
                  短期推进 {currentAssessment.retentionStrategies.filter(s => s.priority === 'short_term').length}
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg border border-blue-200">
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                  中长期 {currentAssessment.retentionStrategies.filter(s => s.priority !== 'immediate' && s.priority !== 'short_term').length}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {currentAssessment.retentionStrategies.map((strategy, idx) => {
                const catConfig = strategyCategoryConfig[strategy.category];
                const prioConfig = priorityConfig[strategy.priority];
                const Icon = catConfig.icon;
                const isExpanded = expandedStrategies.has(strategy.id);
                return (
                  <div
                    key={strategy.id}
                    className={`bg-white rounded-2xl border overflow-hidden shadow-sm transition-all ${isExpanded ? 'shadow-md' : 'hover:shadow-md'} ${
                      strategy.priority === 'immediate' ? 'border-red-200' :
                      strategy.priority === 'short_term' ? 'border-orange-200' : 'border-blue-200'
                    }`}
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    <div
                      className="p-5 cursor-pointer"
                      onClick={() => toggleStrategy(strategy.id)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${catConfig.color} flex items-center justify-center text-white flex-shrink-0 shadow-md`}>
                            <Icon size={26} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <h4 className="font-bold text-slate-900 text-lg">{strategy.title}</h4>
                              <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${prioConfig.badge}`}>
                                {prioConfig.label}
                              </span>
                              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${catConfig.bgColor} text-slate-700 border border-slate-200`}>
                                {catConfig.label}维度
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">{strategy.description}</p>
                            <div className="flex items-center gap-6 mt-3 text-xs text-slate-500 flex-wrap">
                              <div className="flex items-center gap-1.5">
                                <Calendar size={12} className="text-slate-400" />
                                时间线：<span className="font-semibold text-slate-700">{strategy.timeline}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <UsersIcon size={12} className="text-slate-400" />
                                责任人：<span className="font-semibold text-slate-700">{strategy.responsibleRole}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <CheckCircle2 size={12} className="text-emerald-500" />
                                预期影响：<span className="font-semibold text-emerald-700">{strategy.expectedImpact}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={`p-2 rounded-xl transition-colors ${isExpanded ? 'bg-slate-100 text-slate-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}>
                          {isExpanded ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
                        </div>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="px-5 pb-5 border-t border-slate-100 bg-gradient-to-br from-slate-50/50 to-white animate-fade-in">
                        <div className="pt-5 grid md:grid-cols-2 gap-5">
                          <div>
                            <div className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                              <CheckCircle2 size={16} className="text-blue-600" />
                              具体行动计划 ({strategy.actions.length}项)
                            </div>
                            <div className="space-y-2">
                              {strategy.actions.map((action, i) => (
                                <div
                                  key={i}
                                  className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-colors"
                                >
                                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                                    {i + 1}
                                  </div>
                                  <p className="text-sm text-slate-700 leading-relaxed">{action}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                              <div className="flex items-center gap-2 mb-2">
                                <TrendingUpIcon size={16} className="text-emerald-600" />
                                <div className="text-sm font-bold text-emerald-900">预期效果评估</div>
                              </div>
                              <p className="text-sm text-emerald-800 leading-relaxed">{strategy.expectedImpact}</p>
                              <div className="mt-3 pt-3 border-t border-emerald-200 grid grid-cols-3 gap-3 text-center">
                                <div>
                                  <div className="text-2xl font-bold text-emerald-700">
                                    {strategy.priority === 'immediate' ? '24h' : strategy.priority === 'short_term' ? '1w' : '1m'}
                                  </div>
                                  <div className="text-[10px] text-emerald-600 font-medium">启动时效</div>
                                </div>
                                <div>
                                  <div className="text-2xl font-bold text-teal-700">高</div>
                                  <div className="text-[10px] text-teal-600 font-medium">影响程度</div>
                                </div>
                                <div>
                                  <div className="text-2xl font-bold text-cyan-700">
                                    {strategy.actions.length * 20}%
                                  </div>
                                  <div className="text-[10px] text-cyan-600 font-medium">完成度</div>
                                </div>
                              </div>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-200">
                              <div className="flex items-center gap-2 mb-2">
                                <Brain size={16} className="text-violet-600" />
                                <div className="text-sm font-bold text-violet-900">策略实施要点</div>
                              </div>
                              <ul className="space-y-1.5 text-xs text-violet-800">
                                <li className="flex items-start gap-2">
                                  <ArrowRight size={12} className="flex-shrink-0 mt-0.5" />
                                  建议与员工进行坦诚沟通，获取对方案的反馈
                                </li>
                                <li className="flex items-start gap-2">
                                  <ArrowRight size={12} className="flex-shrink-0 mt-0.5" />
                                  设定阶段性里程碑，每2周回顾进展
                                </li>
                                <li className="flex items-start gap-2">
                                  <ArrowRight size={12} className="flex-shrink-0 mt-0.5" />
                                  与其他策略组合执行，形成叠加效应
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-6 bg-white rounded-2xl border-2 border-dashed border-emerald-300 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Sparkles size={18} className="text-emerald-600" />
                <div className="text-sm font-bold text-emerald-800">组合策略预期效果</div>
              </div>
              <p className="text-sm text-slate-600 max-w-2xl mx-auto mb-4">
                预计通过以上多维度保留策略的系统实施，可将该员工的离职风险评分从
                <span className="font-bold text-red-600 mx-1 text-lg">{currentAssessment.riskScore}</span>
                降低至
                <span className="font-bold text-emerald-600 mx-1 text-lg">
                  {Math.max(Math.round(currentAssessment.riskScore * 0.35), 15)}-{Math.max(Math.round(currentAssessment.riskScore * 0.5), 25)}
                </span>
                区间，离职概率降低约
                <span className="font-bold text-blue-600 mx-1">60-75%</span>
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <button className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md hover:shadow-lg">
                  一键生成干预计划
                </button>
                <button className="px-6 py-2.5 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:border-primary-300 hover:text-primary-700 transition-colors">
                  导出完整报告
                </button>
                <button className="px-6 py-2.5 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:border-blue-300 hover:text-blue-700 transition-colors">
                  安排1对1沟通
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}


