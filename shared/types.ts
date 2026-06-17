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
  overallScore: number;
  biasCheck: BiasCheckResult;
  evaluatedAt: Date;
}

export interface InterviewQuestion {
  id: string;
  category: 'professional' | 'softSkill' | 'culturalFit';
  question: string;
  expectedPoints: string[];
  difficulty: 'easy' | 'medium' | 'hard';
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

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
