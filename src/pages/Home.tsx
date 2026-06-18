import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Users,
  ClipboardList,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Award,
  Clock,
  BarChart3,
  Shield,
  Zap,
  AlertTriangle,
} from 'lucide-react';
import { mockResumes, mockJobPositions } from '../data/mockData';
import type { EvaluationResult } from '../../shared/types';

const features = [
  {
    icon: FileText,
    title: '智能职位描述生成',
    description: '基于岗位需求快速生成专业、规范的职位描述，自动检测并排除歧视性用语。',
    path: '/job-description',
    color: 'from-blue-500 to-blue-600',
    stats: '2分钟',
  },
  {
    icon: Users,
    title: '多维度简历评估',
    description: '综合评估技能匹配度、经验相关性和发展潜力，自动屏蔽敏感信息确保公平。',
    path: '/resume-screening',
    color: 'from-emerald-500 to-emerald-600',
    stats: '3个维度',
  },
  {
    icon: ClipboardList,
    title: '结构化面试问题',
    description: '根据职位要求和候选人背景，自动生成专业能力、软技能、文化适配三类问题。',
    path: '/interview-questions',
    color: 'from-purple-500 to-purple-600',
    stats: '12+ 问题',
  },
  {
    icon: MessageSquare,
    title: '面试评价记录',
    description: '结构化评分表帮助面试官客观记录表现，自动生成专业评估报告。',
    path: '/interview-evaluation',
    color: 'from-amber-500 to-amber-600',
    stats: '实时计算',
  },
  {
    icon: CheckCircle2,
    title: '录用决策建议',
    description: '基于全流程数据进行综合分析，给出有理有据的录用建议和决策依据。',
    path: '/hiring-decision',
    color: 'from-rose-500 to-rose-600',
    stats: 'AI 辅助',
  },
  {
    icon: AlertTriangle,
    title: '离职风险评估',
    description: '综合分析出勤变化、加班频率、沟通活跃度等行为信号，识别高风险员工并推荐保留策略。',
    path: '/attrition-risk',
    color: 'from-orange-500 to-red-600',
    stats: '智能预警',
  },
];

const advantages = [
  {
    icon: Shield,
    title: '公平性保障',
    description: '自动屏蔽性别、年龄、地域等敏感信息，消除招聘偏见，确保决策客观公正。',
  },
  {
    icon: Zap,
    title: '效率提升',
    description: '智能化处理招聘全流程，将筛选时间缩短70%，让招聘专注于深度评估。',
  },
  {
    icon: BarChart3,
    title: '数据驱动',
    description: '多维度量化评估，提供可解释的决策依据，让招聘决策更加科学。',
  },
  {
    icon: Award,
    title: '质量保证',
    description: '标准化评估流程，减少主观判断偏差，提升招聘质量和候选人体验。',
  },
];

export default function Home() {
  const [stats, setStats] = useState({
    totalResumes: 0,
    avgScore: 0,
    highPotential: 0,
    processedToday: 0,
  });

  useEffect(() => {
    const mockEvaluations: Partial<EvaluationResult>[] = [
      { overallScore: 87 },
      { overallScore: 72 },
      { overallScore: 65 },
    ];
    
    const avgScore = Math.round(
      mockEvaluations.reduce((sum, e) => sum + (e.overallScore || 0), 0) / mockEvaluations.length
    );
    const highPotential = mockEvaluations.filter(e => (e.overallScore || 0) >= 80).length;

    setStats({
      totalResumes: mockResumes.length,
      avgScore,
      highPotential,
      processedToday: 12,
    });
  }, []);

  return (
    <div className="space-y-12 animate-fade-in">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-900 via-primary-800 to-accent-blue p-12 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-blue rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm mb-6">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            系统已就绪，等待您开始招聘
          </div>
          
          <h1 className="text-5xl font-bold font-display mb-6 leading-tight">
            让招聘决策
            <span className="block bg-gradient-to-r from-emerald-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
              更公平、更高效、更科学
            </span>
          </h1>
          
          <p className="text-xl text-white/80 mb-8 leading-relaxed">
            智能招聘辅助系统通过 AI 技术实现招聘全流程的智能化，
            帮助您生成精准的职位描述，筛选优秀候选人，
            设计结构化面试，最终做出客观公正的录用决策。
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link
              to="/job-description"
              className="inline-flex items-center gap-2 bg-white text-primary-900 px-8 py-4 rounded-xl font-semibold hover:bg-white/90 transition-all hover:scale-105 hover:shadow-xl"
            >
              开始使用
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/resume-screening"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all"
            >
              查看示例简历
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: '累计处理简历', value: stats.totalResumes, suffix: '份', icon: Users, color: 'text-blue-600' },
          { label: '候选人平均分', value: stats.avgScore, suffix: '分', icon: TrendingUp, color: 'text-emerald-600' },
          { label: '高潜力人才', value: stats.highPotential, suffix: '人', icon: Award, color: 'text-purple-600' },
          { label: '今日处理', value: stats.processedToday, suffix: '份', icon: Clock, color: 'text-amber-600' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card p-6" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className={`${stat.color} mb-4`}>
                <Icon size={28} />
              </div>
              <div className="text-3xl font-bold text-primary-900 mb-1">
                {stat.value}
                <span className="text-lg text-slate-500 font-normal ml-1">{stat.suffix}</span>
              </div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          );
        })}
      </section>

      <section>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold font-display text-primary-900 mb-3">
            全流程智能招聘解决方案
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            从职位发布到录用决策，一站式智能化处理，让您专注于最重要的判断
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                to={feature.path}
                className="card p-6 group hover:border-primary-200"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                  </div>
                  <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                    {feature.stats}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-primary-900 mb-2 group-hover:text-accent-blue transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  {feature.description}
                </p>
                <div className="inline-flex items-center gap-1 text-sm font-medium text-accent-blue group-hover:gap-2 transition-all">
                  立即体验
                  <ArrowRight size={16} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="card p-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold font-display text-primary-900 mb-4">
              为什么选择智能招聘辅助系统？
            </h2>
            <p className="text-slate-600 mb-8">
              传统招聘方式往往受到主观偏见的影响，我们的系统通过科学的评估方法和自动化的偏见检测，
              确保每一位候选人都能获得公平的评估机会。
            </p>
            <div className="space-y-6">
              {advantages.map((adv, index) => {
                const Icon = adv.icon;
                return (
                  <div key={adv.title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-700 flex-shrink-0">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary-900 mb-1">
                        {adv.title}
                      </h4>
                      <p className="text-sm text-slate-600">{adv.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-primary-900/5 to-accent-blue/10 rounded-3xl flex items-center justify-center p-8">
              <div className="text-center">
                <div className="text-8xl font-bold font-display bg-gradient-to-br from-primary-900 to-accent-blue bg-clip-text text-transparent mb-4">
                  100%
                </div>
                <p className="text-xl text-slate-600 font-medium">
                  偏见信息自动屏蔽
                </p>
                <p className="text-slate-500 mt-2">
                  确保招聘过程公平公正
                </p>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 card p-4 animate-float">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Shield size={20} />
                </div>
                <div>
                  <div className="font-semibold text-primary-900">公平认证</div>
                  <div className="text-xs text-slate-500">系统已通过</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="text-center py-12">
        <div className="card p-10 bg-gradient-to-r from-primary-900 to-accent-blue text-white">
          <h2 className="text-3xl font-bold font-display mb-4">
            准备好开始了吗？
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            立即创建您的第一个职位描述，体验智能化招聘带来的效率提升和决策质量。
          </p>
          <Link
            to="/job-description"
            className="inline-flex items-center gap-2 bg-white text-primary-900 px-8 py-4 rounded-xl font-semibold hover:bg-white/90 transition-all hover:scale-105"
          >
            创建职位描述
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
