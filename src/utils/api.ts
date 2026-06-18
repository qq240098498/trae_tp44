import type {
  JobDescriptionForm,
  JobPosition,
  Resume,
  EvaluationResult,
  InterviewQuestion,
  InterviewEvaluation,
  HiringRecommendation,
  HighPerformerProfile,
  ResumeAnalysisResult,
  SalaryEstimation,
  AttritionRiskAssessment,
  Employee,
} from '../../shared/types';

const API_BASE = '/api';

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || '请求失败');
  }

  return data.data as T;
}

export const api = {
  jobDescription: {
    generate: (form: JobDescriptionForm) =>
      request<JobPosition & { biasValidation: { isValid: boolean; warnings: string[] } }>(
        '/job-description/generate',
        {
          method: 'POST',
          body: JSON.stringify(form),
        }
      ),
    optimize: (description: string) =>
      request<{ optimized: string; suggestions: string[] }>(
        '/job-description/optimize',
        {
          method: 'POST',
          body: JSON.stringify({ description }),
        }
      ),
  },

  resume: {
    list: () => request<Resume[]>('/resume'),
    get: (id: string) => request<Resume>(`/resume/${id}`),
    upload: (content: string) =>
      request<{ resume: Resume; biasCheck: { detectedFields: string[]; maskedFields: string[]; isFair: boolean } }>(
        '/resume/upload',
        {
          method: 'POST',
          body: JSON.stringify({ content }),
        }
      ),
    evaluate: (resumeId: string, jobPositionId: string) =>
      request<EvaluationResult>('/resume/evaluate', {
        method: 'POST',
        body: JSON.stringify({ resumeId, jobPositionId }),
      }),
    batchEvaluate: (resumeIds: string[], jobPositionId: string) =>
      request<Array<{ resumeId: string; evaluation: EvaluationResult }>>(
        '/resume/batch-evaluate',
        {
          method: 'POST',
          body: JSON.stringify({ resumeIds, jobPositionId }),
        }
      ),
  },

  interviewQuestions: {
    generate: (jobPositionId: string, resumeId?: string) =>
      request<InterviewQuestion[]>('/interview-questions/generate', {
        method: 'POST',
        body: JSON.stringify({ jobPositionId, resumeId }),
      }),
    analyzeResume: (resumeId: string, jobPositionId?: string) =>
      request<ResumeAnalysisResult>('/interview-questions/analyze-resume', {
        method: 'POST',
        body: JSON.stringify({ resumeId, jobPositionId }),
      }),
    generateFollowUp: (resumeId: string, jobPositionId?: string) =>
      request<{ questions: InterviewQuestion[]; analysis: ResumeAnalysisResult }>(
        '/interview-questions/generate-follow-up',
        {
          method: 'POST',
          body: JSON.stringify({ resumeId, jobPositionId }),
        }
      ),
    getBasicQuestionBank: () =>
      request<InterviewQuestion[]>('/interview-questions/basic-question-bank'),
    generateBasicQuestions: (jobPositionId: string, resumeId?: string) =>
      request<InterviewQuestion[]>('/interview-questions/basic-questions', {
        method: 'POST',
        body: JSON.stringify({ jobPositionId, resumeId }),
      }),
    evaluateAnswer: (question: InterviewQuestion, answer: string) =>
      request<{
        score: number;
        feedback: string[];
        coveredPoints: string[];
        missingPoints: string[];
      }>('/interview-questions/evaluate-answer', {
        method: 'POST',
        body: JSON.stringify({ question, answer }),
      }),
  },

  interviewEvaluation: {
    submit: (data: Omit<InterviewEvaluation, 'id' | 'createdAt'>) =>
      request<{
        evaluation: InterviewEvaluation;
        report?: {
          summary: string;
          strengths: string[];
          improvements: string[];
          overallScore: number;
        };
      }>('/interview-evaluation/submit', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getByResume: (resumeId: string) =>
      request<InterviewEvaluation[]>(`/interview-evaluation/resume/${resumeId}`),
  },

  hiringDecision: {
    generate: (resumeId: string, jobPositionId: string) =>
      request<HiringRecommendation>('/hiring-decision/generate', {
        method: 'POST',
        body: JSON.stringify({ resumeId, jobPositionId }),
      }),
    compare: (resumeIds: string[], jobPositionId: string) =>
      request<
        Array<{
          resume: Resume;
          ranking: number;
          overallScore: number;
          recommendation: HiringRecommendation;
        }>
      >('/hiring-decision/compare', {
        method: 'POST',
        body: JSON.stringify({ resumeIds, jobPositionId }),
      }),
  },

  bias: {
    check: (content: string) =>
      request<{
        detectedFields: string[];
        maskedFields: string[];
        isFair: boolean;
      }>('/bias/check', {
        method: 'POST',
        body: JSON.stringify({ content }),
      }),
    mask: (content: string) =>
      request<{
        maskedContent: string;
        biasCheck: { detectedFields: string[]; maskedFields: string[]; isFair: boolean };
      }>('/bias/mask', {
        method: 'POST',
        body: JSON.stringify({ content }),
      }),
    validateJobDescription: (description: string) =>
      request<{ isValid: boolean; warnings: string[] }>(
        '/bias/validate-job-description',
        {
          method: 'POST',
          body: JSON.stringify({ description }),
        }
      ),
    getCategories: () =>
      request<
        Array<{ key: string; label: string; description: string }>
      >('/bias/categories'),
  },

  talentProfiles: {
    list: (params?: { department?: string; position?: string }) => {
      const query = new URLSearchParams();
      if (params?.department) query.set('department', params.department);
      if (params?.position) query.set('position', params.position);
      const queryStr = query.toString() ? `?${query.toString()}` : '';
      return request<{ profiles: HighPerformerProfile[]; total: number }>(
        `/talent-profiles${queryStr}`
      );
    },
    get: (id: string) =>
      request<HighPerformerProfile>(`/talent-profiles/${id}`),
    create: (profile: Partial<HighPerformerProfile> & { id?: string }) =>
      request<HighPerformerProfile>('/talent-profiles', {
        method: 'POST',
        body: JSON.stringify(profile),
      }),
    update: (id: string, updates: Partial<Omit<HighPerformerProfile, 'id'>>) =>
      request<HighPerformerProfile>(`/talent-profiles/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      }),
    remove: (id: string) =>
      request<{ deleted: boolean }>(`/talent-profiles/${id}`, {
        method: 'DELETE',
      }),
    bulkCreate: (profiles: Array<Partial<HighPerformerProfile> & { id?: string }>) =>
      request<{ profiles: HighPerformerProfile[]; count: number }>('/talent-profiles/bulk', {
        method: 'POST',
        body: JSON.stringify({ profiles }),
      }),
    bulkDelete: (ids: string[]) =>
      request<{ deleted: number; total: number }>('/talent-profiles/bulk', {
        method: 'DELETE',
        body: JSON.stringify({ ids }),
      }),
    reset: () =>
      request<{ reset: boolean; count: number }>('/talent-profiles/reset', {
        method: 'POST',
      }),
    replace: (profiles: HighPerformerProfile[]) =>
      request<{ profiles: HighPerformerProfile[]; count: number }>('/talent-profiles/replace', {
        method: 'POST',
        body: JSON.stringify({ profiles }),
      }),
  },

  salary: {
    estimate: (jobPositionId: string, options?: { location?: string; industry?: string }) =>
      request<SalaryEstimation>('/salary/estimate', {
        method: 'POST',
        body: JSON.stringify({ jobPositionId, ...options }),
      }),
  },

  attritionRisk: {
    listEmployees: (params?: { department?: string; position?: string }) => {
      const query = new URLSearchParams();
      if (params?.department) query.set('department', params.department);
      if (params?.position) query.set('position', params.position);
      const queryStr = query.toString() ? `?${query.toString()}` : '';
      return request<Employee[]>(`/attrition-risk/employees${queryStr}`);
    },
    assess: (employeeId: string) =>
      request<AttritionRiskAssessment>('/attrition-risk/assess', {
        method: 'POST',
        body: JSON.stringify({ employeeId }),
      }),
    listAllAssessments: () =>
      request<AttritionRiskAssessment[]>('/attrition-risk/all-assessments'),
    batchAssess: (employeeIds: string[]) =>
      request<AttritionRiskAssessment[]>('/attrition-risk/batch-assess', {
        method: 'POST',
        body: JSON.stringify({ employeeIds }),
      }),
    getDepartmentStats: (department?: string) => {
      const query = department ? `?department=${department}` : '';
      return request<{
        totalEmployees: number;
        highRiskCount: number;
        mediumRiskCount: number;
        lowRiskCount: number;
        avgRiskScore: number;
        topRisks: Array<{ name: string; count: number; percentage: number }>;
      }>(`/attrition-risk/department-stats${query}`);
    },
  },
};
