import type {
  SalaryEstimation,
  SalaryPercentile,
  MarketDemandInfo,
  SalaryBenchmarkSource,
  SalaryBreakdown,
  CompensationPackage,
} from '../../shared/types';
import { mockJobPositions } from '../data/mockData';

interface LocationCoefficient {
  city: string;
  coefficient: number;
  tier: 'tier1' | 'newTier1' | 'tier2' | 'tier3';
}

const locationCoefficients: LocationCoefficient[] = [
  { city: '北京', coefficient: 1.2, tier: 'tier1' },
  { city: '上海', coefficient: 1.18, tier: 'tier1' },
  { city: '深圳', coefficient: 1.15, tier: 'tier1' },
  { city: '广州', coefficient: 1.05, tier: 'tier1' },
  { city: '杭州', coefficient: 1.08, tier: 'newTier1' },
  { city: '成都', coefficient: 0.9, tier: 'newTier1' },
  { city: '武汉', coefficient: 0.88, tier: 'newTier1' },
  { city: '南京', coefficient: 0.92, tier: 'newTier1' },
  { city: '苏州', coefficient: 0.95, tier: 'newTier1' },
  { city: '西安', coefficient: 0.82, tier: 'newTier1' },
  { city: '重庆', coefficient: 0.8, tier: 'newTier1' },
  { city: '天津', coefficient: 0.85, tier: 'newTier1' },
];

const levelBaseSalary: Record<string, { base25: number; base50: number; base75: number }> = {
  entry: { base25: 8000, base50: 10000, base75: 12000 },
  junior: { base25: 12000, base50: 15000, base75: 18000 },
  mid: { base25: 18000, base50: 22000, base75: 28000 },
  senior: { base25: 28000, base50: 35000, base75: 45000 },
  expert: { base25: 40000, base50: 55000, base75: 70000 },
  lead: { base25: 35000, base50: 48000, base75: 60000 },
  manager: { base25: 45000, base50: 60000, base75: 80000 },
  director: { base25: 60000, base50: 85000, base75: 120000 },
};

interface CompensationStructure {
  baseRatio: number;
  performanceBonusMonths: { min: number; median: number; max: number };
  yearEndBonusMonths: { min: number; median: number; max: number };
  stockAnnualRatio: number;
  allowancesMonthly: number;
  benefitsAnnualValue: number;
}

const compensationByLevel: Record<string, CompensationStructure> = {
  entry: {
    baseRatio: 0.9,
    performanceBonusMonths: { min: 0, median: 1, max: 1.5 },
    yearEndBonusMonths: { min: 1, median: 2, max: 2 },
    stockAnnualRatio: 0,
    allowancesMonthly: 1000,
    benefitsAnnualValue: 8000,
  },
  junior: {
    baseRatio: 0.88,
    performanceBonusMonths: { min: 0.5, median: 1.5, max: 2 },
    yearEndBonusMonths: { min: 1.5, median: 2.5, max: 3 },
    stockAnnualRatio: 0,
    allowancesMonthly: 1500,
    benefitsAnnualValue: 12000,
  },
  mid: {
    baseRatio: 0.85,
    performanceBonusMonths: { min: 1, median: 2, max: 3 },
    yearEndBonusMonths: { min: 2, median: 3, max: 4 },
    stockAnnualRatio: 0.05,
    allowancesMonthly: 2000,
    benefitsAnnualValue: 18000,
  },
  senior: {
    baseRatio: 0.8,
    performanceBonusMonths: { min: 1.5, median: 2, max: 3.5 },
    yearEndBonusMonths: { min: 3, median: 4, max: 5 },
    stockAnnualRatio: 0.15,
    allowancesMonthly: 3000,
    benefitsAnnualValue: 28000,
  },
  expert: {
    baseRatio: 0.75,
    performanceBonusMonths: { min: 2, median: 2.5, max: 4 },
    yearEndBonusMonths: { min: 4, median: 5, max: 6 },
    stockAnnualRatio: 0.28,
    allowancesMonthly: 4500,
    benefitsAnnualValue: 45000,
  },
  lead: {
    baseRatio: 0.75,
    performanceBonusMonths: { min: 2, median: 3, max: 4 },
    yearEndBonusMonths: { min: 3.5, median: 5, max: 6 },
    stockAnnualRatio: 0.25,
    allowancesMonthly: 4000,
    benefitsAnnualValue: 40000,
  },
  manager: {
    baseRatio: 0.72,
    performanceBonusMonths: { min: 2.5, median: 3, max: 5 },
    yearEndBonusMonths: { min: 4, median: 5.5, max: 7 },
    stockAnnualRatio: 0.32,
    allowancesMonthly: 5000,
    benefitsAnnualValue: 55000,
  },
  director: {
    baseRatio: 0.68,
    performanceBonusMonths: { min: 3, median: 4, max: 6 },
    yearEndBonusMonths: { min: 5, median: 7, max: 10 },
    stockAnnualRatio: 0.45,
    allowancesMonthly: 8000,
    benefitsAnnualValue: 80000,
  },
};

const industryPremium: Record<string, number> = {
  '互联网': 1.15,
  '人工智能': 1.3,
  '金融科技': 1.25,
  '游戏': 1.2,
  '电商': 1.12,
  'SaaS/企业服务': 1.08,
  '教育科技': 0.95,
  '医疗健康': 1.05,
  '制造业': 0.85,
  '传统行业': 0.8,
};

const marketDemandData: Record<string, MarketDemandInfo> = {
  'React': {
    level: 'high',
    label: '高度紧缺',
    description: 'React工程师市场需求旺盛，供给相对不足，优质候选人竞争激烈',
    premiumRange: '+10% ~ +20%',
    color: 'from-orange-500 to-red-500',
  },
  'Vue': {
    level: 'medium',
    label: '需求稳定',
    description: 'Vue工程师市场需求稳定，供给充足，薪酬区间相对稳定',
    premiumRange: '+0% ~ +5%',
    color: 'from-green-500 to-emerald-500',
  },
  'TypeScript': {
    level: 'extreme',
    label: '极度紧缺',
    description: '精通TypeScript的工程师极度稀缺，企业愿意支付高额溢价',
    premiumRange: '+15% ~ +30%',
    color: 'from-red-500 to-rose-600',
  },
  'Node.js': {
    level: 'high',
    label: '高度紧缺',
    description: '全栈Node.js工程师需求旺盛，供需失衡明显',
    premiumRange: '+8% ~ +18%',
    color: 'from-orange-500 to-red-500',
  },
  '前端': {
    level: 'high',
    label: '高度紧缺',
    description: '高级前端工程师整体需求旺盛，特别是有架构经验的候选人',
    premiumRange: '+10% ~ +20%',
    color: 'from-orange-500 to-red-500',
  },
  'default': {
    level: 'medium',
    label: '需求稳定',
    description: '当前岗位市场供需基本平衡，薪酬水平相对稳定',
    premiumRange: '±5%',
    color: 'from-blue-500 to-cyan-500',
  },
};

const benchmarkSources: SalaryBenchmarkSource[] = [
  { name: '猎聘2026薪资报告', weight: 0.25, description: '覆盖互联网行业中高端岗位的季度调研数据' },
  { name: 'BOSS直聘薪酬指数', weight: 0.2, description: '基于平台实际招聘数据的实时薪酬分析' },
  { name: 'LinkedIn薪酬洞察', weight: 0.15, description: '覆盖中高端人才的全球薪酬对标数据' },
  { name: '公司内部薪酬带宽', weight: 0.25, description: '基于公司职级体系和历史录用数据' },
  { name: '行业对标调研', weight: 0.15, description: '同行业竞品公司的匿名薪酬调研数据' },
];

const negotiationTipsBase = [
  '提前了解候选人当前薪资和期望薪资，避免锚定效应',
  '对于高潜力候选人，可以适当放宽75分位上限，重点保留核心人才',
  '除了基本薪资，可以结合股票期权、签字费、年终奖等方式组合报价',
  '遇到薪酬倒挂问题时，可通过快速调薪承诺或特殊津贴解决',
  '强调非现金福利：成长空间、团队氛围、工作生活平衡等',
  '市场紧缺度高的岗位，建议在50分位以上报价以增加竞争力',
];

function getLocationCoefficient(location?: string): { coefficient: number; city: string } {
  if (!location) return { coefficient: 1.0, city: '一线城市（默认）' };
  const found = locationCoefficients.find(
    (l) => location.includes(l.city) || l.city.includes(location)
  );
  if (found) return { coefficient: found.coefficient, city: found.city };
  return { coefficient: 0.85, city: location };
}

function getIndustryPremium(industry?: string): { premium: number; industry: string } {
  if (!industry) return { premium: 1.0, industry: '互联网（默认）' };
  for (const [key, value] of Object.entries(industryPremium)) {
    if (industry.includes(key) || key.includes(industry)) {
      return { premium: value, industry: key };
    }
  }
  return { premium: 1.0, industry };
}

function getLevelBase(level: string) {
  const normalizedLevel = level.toLowerCase();
  return (
    levelBaseSalary[normalizedLevel] || {
      base25: 20000,
      base50: 28000,
      base75: 38000,
    }
  );
}

function getCompensationStructure(level: string): CompensationStructure {
  const normalizedLevel = level.toLowerCase();
  return (
    compensationByLevel[normalizedLevel] || {
      baseRatio: 0.8,
      performanceBonusMonths: { min: 1, median: 2, max: 3 },
      yearEndBonusMonths: { min: 2, median: 3, max: 4 },
      stockAnnualRatio: 0.1,
      allowancesMonthly: 2000,
      benefitsAnnualValue: 20000,
    }
  );
}

function determineMarketDemand(skills: string[], jobTitle: string): MarketDemandInfo {
  const allText = [...skills, jobTitle].join(' ').toLowerCase();
  const priorityOrder = ['TypeScript', 'React', 'Node.js', 'Vue', '前端'];

  for (const skill of priorityOrder) {
    if (allText.includes(skill.toLowerCase())) {
      return marketDemandData[skill];
    }
  }

  return marketDemandData['default'];
}

function calculateBreakdown(
  baseSalary: number,
  compStructure: CompensationStructure,
  bonusType: 'min' | 'median' | 'max'
): { breakdown: SalaryBreakdown; monthlyCash: number; annualCash: number; annualTotalPackage: number } {
  const perfBonusMonths = compStructure.performanceBonusMonths[bonusType];
  const yearEndBonusMonths = compStructure.yearEndBonusMonths[bonusType];

  const performanceBonus = (baseSalary * perfBonusMonths) / 12;
  const yearEndBonus = (baseSalary * yearEndBonusMonths) / 12;
  const monthlyAllowances = compStructure.allowancesMonthly;
  const monthlyBenefits = compStructure.benefitsAnnualValue / 12;

  const cashWithoutStock = baseSalary + performanceBonus + yearEndBonus + monthlyAllowances;
  const stockMonthly = (cashWithoutStock * 12 * compStructure.stockAnnualRatio) / 12;

  const breakdown: SalaryBreakdown = {
    baseSalary,
    performanceBonus,
    yearEndBonus,
    stockOptions: stockMonthly,
    allowances: monthlyAllowances,
    benefitsValue: monthlyBenefits,
  };

  const monthlyCash = baseSalary + performanceBonus + yearEndBonus + monthlyAllowances;
  const annualCash = monthlyCash * 12;
  const annualTotalPackage = monthlyCash * 12 + stockMonthly * 12 + compStructure.benefitsAnnualValue;

  return { breakdown, monthlyCash, annualCash, annualTotalPackage };
}

const roundTo500 = (n: number) => Math.round(n / 500) * 500;
const roundTo1000 = (n: number) => Math.round(n / 1000) * 1000;

function buildCompensationPackage(breakdown: SalaryBreakdown): CompensationPackage[] {
  const annualBase = breakdown.baseSalary * 12;
  const annualPerf = breakdown.performanceBonus * 12;
  const annualYearEnd = breakdown.yearEndBonus * 12;
  const annualStock = breakdown.stockOptions * 12;
  const annualAllowance = breakdown.allowances * 12;
  const annualBenefits = breakdown.benefitsValue * 12;
  const totalAnnual = annualBase + annualPerf + annualYearEnd + annualStock + annualAllowance + annualBenefits;

  const pkg = (
    name: string,
    monthly: number,
    annual: number,
    description: string,
    icon: string
  ): CompensationPackage => ({
    name,
    monthlyAmount: roundTo500(monthly),
    annualAmount: roundTo1000(annual),
    percentage: totalAnnual > 0 ? Math.round((annual / totalAnnual) * 100) : 0,
    description,
    icon,
  });

  return [
    pkg('基本工资', breakdown.baseSalary, annualBase, '固定月度发放，占薪酬的主要部分', '💰'),
    pkg('绩效奖金', breakdown.performanceBonus, annualPerf, '根据KPI/OKR考核发放，通常按月度或季度评估', '📊'),
    pkg('年终奖', breakdown.yearEndBonus, annualYearEnd, '年底根据公司业绩和个人表现发放，通常1-6个月', '🎯'),
    pkg('股票期权', breakdown.stockOptions, annualStock, '限制性股票单位(RSU)或期权，按归属期折算年化价值', '📈'),
    pkg('各项补贴', breakdown.allowances, annualAllowance, '交通、餐饮、通讯、住房、差旅等现金补贴', '🎁'),
    pkg('福利折算', breakdown.benefitsValue, annualBenefits, '五险一金补充、商业保险、带薪假期、体检、团建等福利折算', '✨'),
  ];
}

export function generateSalaryEstimation(
  jobPositionId: string,
  options?: { location?: string; industry?: string }
): SalaryEstimation {
  const jobPosition =
    mockJobPositions.find((j) => j.id === jobPositionId) || mockJobPositions[0];

  const { coefficient: locationCoef, city: resolvedLocation } = getLocationCoefficient(
    options?.location
  );
  const { premium: industryCoef, industry: resolvedIndustry } = getIndustryPremium(
    options?.industry
  );

  const levelBase = getLevelBase(jobPosition.level);
  const compStructure = getCompensationStructure(jobPosition.level);

  const raw25 = levelBase.base25 * locationCoef * industryCoef;
  const raw50 = levelBase.base50 * locationCoef * industryCoef;
  const raw75 = levelBase.base75 * locationCoef * industryCoef;

  const base25 = roundTo500(raw25);
  const base50 = roundTo500(raw50);
  const base75 = roundTo500(raw75);

  const calc25 = calculateBreakdown(roundTo500(base25 * (1 / compStructure.baseRatio)), compStructure, 'min');
  const calc50 = calculateBreakdown(roundTo500(base50 * (1 / compStructure.baseRatio)), compStructure, 'median');
  const calc75 = calculateBreakdown(roundTo500(base75 * (1 / compStructure.baseRatio)), compStructure, 'max');

  const p25: SalaryPercentile = {
    percentile: '25',
    label: '25分位（保守）',
    minSalary: roundTo500(base25 * 0.92),
    maxSalary: roundTo500(base25 * 1.05),
    medianSalary: base25,
    monthlyCash: roundTo500(calc25.monthlyCash),
    annualCash: roundTo1000(calc25.annualCash),
    annualTotalPackage: roundTo1000(calc25.annualTotalPackage),
    breakdown: {
      baseSalary: roundTo500(calc25.breakdown.baseSalary),
      performanceBonus: roundTo500(calc25.breakdown.performanceBonus),
      yearEndBonus: roundTo500(calc25.breakdown.yearEndBonus),
      stockOptions: roundTo500(calc25.breakdown.stockOptions),
      allowances: roundTo500(calc25.breakdown.allowances),
      benefitsValue: roundTo500(calc25.breakdown.benefitsValue),
    },
  };

  const p50: SalaryPercentile = {
    percentile: '50',
    label: '50分位（中位）',
    minSalary: roundTo500(base50 * 0.94),
    maxSalary: roundTo500(base50 * 1.06),
    medianSalary: base50,
    monthlyCash: roundTo500(calc50.monthlyCash),
    annualCash: roundTo1000(calc50.annualCash),
    annualTotalPackage: roundTo1000(calc50.annualTotalPackage),
    breakdown: {
      baseSalary: roundTo500(calc50.breakdown.baseSalary),
      performanceBonus: roundTo500(calc50.breakdown.performanceBonus),
      yearEndBonus: roundTo500(calc50.breakdown.yearEndBonus),
      stockOptions: roundTo500(calc50.breakdown.stockOptions),
      allowances: roundTo500(calc50.breakdown.allowances),
      benefitsValue: roundTo500(calc50.breakdown.benefitsValue),
    },
  };

  const p75: SalaryPercentile = {
    percentile: '75',
    label: '75分位（竞争力）',
    minSalary: roundTo500(base75 * 0.95),
    maxSalary: roundTo500(base75 * 1.1),
    medianSalary: base75,
    monthlyCash: roundTo500(calc75.monthlyCash),
    annualCash: roundTo1000(calc75.annualCash),
    annualTotalPackage: roundTo1000(calc75.annualTotalPackage),
    breakdown: {
      baseSalary: roundTo500(calc75.breakdown.baseSalary),
      performanceBonus: roundTo500(calc75.breakdown.performanceBonus),
      yearEndBonus: roundTo500(calc75.breakdown.yearEndBonus),
      stockOptions: roundTo500(calc75.breakdown.stockOptions),
      allowances: roundTo500(calc75.breakdown.allowances),
      benefitsValue: roundTo500(calc75.breakdown.benefitsValue),
    },
  };

  const marketDemand = determineMarketDemand(jobPosition.skills, jobPosition.title);

  const levelLabels: Record<string, string> = {
    entry: '初级（P4）',
    junior: '初中级（P5）',
    mid: '中级（P6）',
    senior: '高级（P7）',
    expert: '专家（P8）',
    lead: '技术负责人（M1/P8）',
    manager: '经理（M2/P9）',
    director: '总监（M3/P10）',
  };

  const resolvedLevel = levelLabels[jobPosition.level.toLowerCase()] || jobPosition.level;

  return {
    id: `salary-${Date.now()}`,
    jobPositionId: jobPosition.id,
    jobTitle: jobPosition.title,
    level: resolvedLevel,
    location: resolvedLocation,
    industry: resolvedIndustry,
    currency: 'CNY',
    unit: 'K/月（税前）',
    percentiles: [p25, p50, p75],
    overallRange: {
      min: p25.minSalary,
      max: p75.maxSalary,
      median: p50.medianSalary,
      medianMonthlyCash: p50.monthlyCash,
      medianAnnualCash: p50.annualCash,
      medianTotalPackage: p50.annualTotalPackage,
    },
    medianPackage: buildCompensationPackage(p50.breakdown),
    marketDemand,
    benchmarks: benchmarkSources,
    companyBandwidth: {
      min: roundTo500(p25.minSalary * 0.95),
      max: roundTo500(p75.maxSalary * 1.15),
      minTotalPackage: roundTo1000(p25.annualTotalPackage * 0.92),
      maxTotalPackage: roundTo1000(p75.annualTotalPackage * 1.2),
      description:
        '公司薪酬带宽覆盖从保守到极具竞争力的全范围区间，保留了根据候选人特殊情况进行灵活调整的空间',
    },
    negotiationTips: negotiationTipsBase,
    generatedAt: new Date(),
  };
}
