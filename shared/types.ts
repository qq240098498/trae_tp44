export interface Education {
  school: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string[];
}

export interface Project {
  name: string;
  role: string;
  description: string;
  technologies: string[];
  achievements: string[];
}

export interface JobPosition {
  id: string;
  title: string;
  department: string;
  level: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  generatedDescription: string;
  createdAt: Date;
}

export interface Resume {
  id: string;
  name: string;
  education: Education[];
  experience: Experience[];
  skills: string[];
  projects: Project[];
  rawContent: string;
  maskedContent: string;
  appliedPositionId?: string;
}

export interface SkillMatchDetail {
  skill: string;
  required: boolean;
  found: boolean;
  matchLevel: 'exact' | 'partial' | 'none';
}

export interface ExperienceDetail {
  relevance: 'high' | 'medium' | 'low';
  description: string;
  years: number;
}

export interface PotentialDetail {
  factor: string;
  score: number;
  evidence: string;
}

export interface BiasCheckResult {
  detectedFields: string[];
  maskedFields: string[];
  isFair: boolean;
}

export type RedFlagType =
  | 'noQuantifiedAchievement'
  | 'frequentJobChange'
  | 'skillGap'
  | 'careerGap'
  | 'unclearResponsibility'
  | 'overqualified'
  | 'underqualified';

export interface ResumeRedFlag {
  id: string;
  type: RedFlagType;
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  evidence: string[];
  suggestion: string;
}

export type QuestionCategory =
  | 'professional'
  | 'softSkill'
  | 'culturalFit'
  | 'basicInfo'
  | 'followUp';

export interface InterviewQuestion {
  id: string;
  category: QuestionCategory;
  question: string;
  expectedPoints: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  source?: 'base' | 'jd' | 'resume' | 'redFlag';
  relatedRedFlagId?: string;
  priority?: number;
}

export interface ResumeAnalysisResult {
  resumeId: string;
  redFlags: ResumeRedFlag[];
  strengths: string[];
  concernAreas: string[];
  generatedAt: Date;
}

export interface InterviewEvaluation {
  id: string;
  resumeId: string;
  scores: {
    professional: number;
    softSkill: number;
    culturalFit: number;
  };
  notes: string;
  overallComment: string;
  createdAt: Date;
}

export interface HiringRecommendation {
  id: string;
  resumeId: string;
  recommendation: 'hire' | 'reject' | 'pending';
  reasons: string[];
  overallScore: number;
  finalDecision: string;
  createdAt: Date;
}

export interface JobDescriptionForm {
  title: string;
  department: string;
  level: 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'manager';
  industry: string;
  responsibilities: string;
  requirements: string;
  skills: string;
  teamSize?: string;
  location?: string;
  salaryRange?: string;
}

export interface HighPerformerProfile {
  id: string;
  position: string;
  level: string;
  department: string;
  coreSkills: string[];
  keyStrengths: string[];
  careerTrajectory: string[];
  projectTypes: string[];
  performanceLevel: 'top' | 'excellent' | 'good';
}

export interface FitPoint {
  category: 'skill' | 'project' | 'career' | 'strength';
  description: string;
  confidence: number;
  evidence: string;
}

export interface TalentProfileMatchResult {
  overallConfidence: number;
  skillMatch: {
    score: number;
    matchedSkills: string[];
    details: string;
  };
  projectMatch: {
    score: number;
    matchedProjectTypes: string[];
    details: string;
  };
  careerMatch: {
    score: number;
    matchedTrajectory: string[];
    details: string;
  };
  strengthMatch: {
    score: number;
    matchedStrengths: string[];
    details: string;
  };
  keyFitPoints: FitPoint[];
  potentialAssessment: string;
  matchedProfileId: string;
  matchedProfilePosition: string;
}

export interface EvaluationResult {
  resumeId: string;
  skillMatch: {
    score: number;
    details: SkillMatchDetail[];
  };
  experienceRelevance: {
    score: number;
    details: ExperienceDetail[];
  };
  potential: {
    score: number;
    details: PotentialDetail[];
  };
  talentProfileMatch?: TalentProfileMatchResult;
  overallScore: number;
  biasCheck: BiasCheckResult;
  resumeAnalysis?: ResumeAnalysisResult;
  evaluatedAt: Date;
}

export interface SalaryBreakdown {
  baseSalary: number;
  performanceBonus: number;
  yearEndBonus: number;
  stockOptions: number;
  allowances: number;
  benefitsValue: number;
}

export interface SalaryPercentile {
  percentile: '25' | '50' | '75';
  label: string;
  minSalary: number;
  maxSalary: number;
  medianSalary: number;
  monthlyCash: number;
  annualCash: number;
  annualTotalPackage: number;
  breakdown: SalaryBreakdown;
}

export interface MarketDemandInfo {
  level: 'low' | 'medium' | 'high' | 'extreme';
  label: string;
  description: string;
  premiumRange: string;
  color: string;
}

export interface SalaryBenchmarkSource {
  name: string;
  weight: number;
  description: string;
}

export interface CompensationPackage {
  name: string;
  monthlyAmount: number;
  annualAmount: number;
  percentage: number;
  description: string;
  icon: string;
}

export interface SalaryEstimation {
  id: string;
  jobPositionId: string;
  jobTitle: string;
  level: string;
  location: string;
  industry: string;
  currency: string;
  unit: string;
  percentiles: SalaryPercentile[];
  overallRange: {
    min: number;
    max: number;
    median: number;
    medianMonthlyCash: number;
    medianAnnualCash: number;
    medianTotalPackage: number;
  };
  medianPackage: CompensationPackage[];
  marketDemand: MarketDemandInfo;
  benchmarks: SalaryBenchmarkSource[];
  companyBandwidth: {
    min: number;
    max: number;
    description: string;
    minTotalPackage: number;
    maxTotalPackage: number;
  };
  negotiationTips: string[];
  generatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
