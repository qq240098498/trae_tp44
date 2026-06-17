import { create } from 'zustand';
import type {
  JobPosition,
  Resume,
  EvaluationResult,
  InterviewQuestion,
  InterviewEvaluation,
  HiringRecommendation,
  JobDescriptionForm,
} from '../../shared/types';

interface AppState {
  currentJobPosition: JobPosition | null;
  setCurrentJobPosition: (job: JobPosition | null) => void;

  currentResume: Resume | null;
  setCurrentResume: (resume: Resume | null) => void;

  resumes: Resume[];
  setResumes: (resumes: Resume[]) => void;
  addResume: (resume: Resume) => void;

  currentEvaluation: EvaluationResult | null;
  setCurrentEvaluation: (evaluation: EvaluationResult | null) => void;

  interviewQuestions: InterviewQuestion[];
  setInterviewQuestions: (questions: InterviewQuestion[]) => void;

  currentInterviewEvaluation: InterviewEvaluation | null;
  setCurrentInterviewEvaluation: (evaluation: InterviewEvaluation | null) => void;

  hiringRecommendation: HiringRecommendation | null;
  setHiringRecommendation: (recommendation: HiringRecommendation | null) => void;

  jobDescriptionForm: Partial<JobDescriptionForm>;
  setJobDescriptionForm: (form: Partial<JobDescriptionForm>) => void;

  loading: boolean;
  setLoading: (loading: boolean) => void;

  activeTab: string;
  setActiveTab: (tab: string) => void;

  resetState: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentJobPosition: null,
  setCurrentJobPosition: (job) => set({ currentJobPosition: job }),

  currentResume: null,
  setCurrentResume: (resume) => set({ currentResume: resume }),

  resumes: [],
  setResumes: (resumes) => set({ resumes }),
  addResume: (resume) =>
    set((state) => ({ resumes: [...state.resumes, resume] })),

  currentEvaluation: null,
  setCurrentEvaluation: (evaluation) => set({ currentEvaluation: evaluation }),

  interviewQuestions: [],
  setInterviewQuestions: (questions) => set({ interviewQuestions: questions }),

  currentInterviewEvaluation: null,
  setCurrentInterviewEvaluation: (evaluation) =>
    set({ currentInterviewEvaluation: evaluation }),

  hiringRecommendation: null,
  setHiringRecommendation: (recommendation) =>
    set({ hiringRecommendation: recommendation }),

  jobDescriptionForm: {},
  setJobDescriptionForm: (form) =>
    set((state) => ({ jobDescriptionForm: { ...state.jobDescriptionForm, ...form } })),

  loading: false,
  setLoading: (loading) => set({ loading }),

  activeTab: 'home',
  setActiveTab: (tab) => set({ activeTab: tab }),

  resetState: () =>
    set({
      currentEvaluation: null,
      interviewQuestions: [],
      currentInterviewEvaluation: null,
      hiringRecommendation: null,
    }),
}));
