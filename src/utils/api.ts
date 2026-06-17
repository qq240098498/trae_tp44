import type {
  JobDescriptionForm,
  JobPosition,
  Resume,
  EvaluationResult,
  InterviewQuestion,
  InterviewEvaluation,
  HiringRecommendation,
  ApiResponse,
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
};
