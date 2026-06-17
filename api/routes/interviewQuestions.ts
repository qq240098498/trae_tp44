import { Router, Request, Response } from 'express';
import type { ApiResponse, InterviewQuestion, ResumeAnalysisResult } from '../../shared/types';
import {
  generateInterviewQuestions,
  evaluateAnswer,
  generateBasicInfoQuestions,
  generateFollowUpQuestions,
  getBasicInfoQuestionBank,
} from '../services/questionGenerator';
import { analyzeResumeRedFlags } from '../services/resumeAnalyzer';
import { mockJobPositions, mockResumes } from '../data/mockData';

const router = Router();

router.post('/generate', (req: Request, res: Response) => {
  try {
    const { jobPositionId, resumeId } = req.body;

    if (!jobPositionId) {
      const response: ApiResponse<null> = {
        success: false,
        error: '请提供职位ID',
      };
      return res.status(400).json(response);
    }

    const jobPosition = mockJobPositions.find(j => j.id === jobPositionId);
    const resume = resumeId ? mockResumes.find(r => r.id === resumeId) : undefined;

    if (!jobPosition) {
      const response: ApiResponse<null> = {
        success: false,
        error: '职位不存在',
      };
      return res.status(404).json(response);
    }

    const resumeAnalysis = resume ? analyzeResumeRedFlags(resume, jobPosition) : undefined;
    const questions = generateInterviewQuestions(jobPosition, resume, resumeAnalysis);

    const response: ApiResponse<InterviewQuestion[]> = {
      success: true,
      data: questions,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '生成面试问题失败',
    };
    res.status(500).json(response);
  }
});

router.post('/analyze-resume', (req: Request, res: Response) => {
  try {
    const { resumeId, jobPositionId } = req.body;

    if (!resumeId) {
      const response: ApiResponse<null> = {
        success: false,
        error: '请提供简历ID',
      };
      return res.status(400).json(response);
    }

    const resume = mockResumes.find(r => r.id === resumeId);
    const jobPosition = jobPositionId ? mockJobPositions.find(j => j.id === jobPositionId) : undefined;

    if (!resume) {
      const response: ApiResponse<null> = {
        success: false,
        error: '简历不存在',
      };
      return res.status(404).json(response);
    }

    const analysis = analyzeResumeRedFlags(resume, jobPosition);

    const response: ApiResponse<ResumeAnalysisResult> = {
      success: true,
      data: analysis,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '分析简历失败',
    };
    res.status(500).json(response);
  }
});

router.post('/generate-follow-up', (req: Request, res: Response) => {
  try {
    const { resumeId, jobPositionId } = req.body;

    if (!resumeId) {
      const response: ApiResponse<null> = {
        success: false,
        error: '请提供简历ID',
      };
      return res.status(400).json(response);
    }

    const resume = mockResumes.find(r => r.id === resumeId);
    const jobPosition = jobPositionId ? mockJobPositions.find(j => j.id === jobPositionId) : undefined;

    if (!resume) {
      const response: ApiResponse<null> = {
        success: false,
        error: '简历不存在',
      };
      return res.status(404).json(response);
    }

    const resumeAnalysis = analyzeResumeRedFlags(resume, jobPosition);
    const questions = generateFollowUpQuestions(resumeAnalysis, resume).map((q, i) => ({
      ...q,
      id: `q-followup-${Date.now()}-${i}`,
      priority: q.priority ?? i,
    }));

    const response: ApiResponse<{ questions: InterviewQuestion[]; analysis: ResumeAnalysisResult }> = {
      success: true,
      data: { questions, analysis: resumeAnalysis },
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '生成追问题目失败',
    };
    res.status(500).json(response);
  }
});

router.get('/basic-question-bank', (req: Request, res: Response) => {
  try {
    const questions = getBasicInfoQuestionBank().map((q, i) => ({
      ...q,
      id: `q-basic-${Date.now()}-${i}`,
    }));

    const response: ApiResponse<InterviewQuestion[]> = {
      success: true,
      data: questions,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '获取基础题库失败',
    };
    res.status(500).json(response);
  }
});

router.post('/basic-questions', (req: Request, res: Response) => {
  try {
    const { jobPositionId, resumeId } = req.body;

    if (!jobPositionId) {
      const response: ApiResponse<null> = {
        success: false,
        error: '请提供职位ID',
      };
      return res.status(400).json(response);
    }

    const jobPosition = mockJobPositions.find(j => j.id === jobPositionId);
    const resume = resumeId ? mockResumes.find(r => r.id === resumeId) : undefined;

    if (!jobPosition) {
      const response: ApiResponse<null> = {
        success: false,
        error: '职位不存在',
      };
      return res.status(404).json(response);
    }

    const questions = generateBasicInfoQuestions(jobPosition, resume).map((q, i) => ({
      ...q,
      id: `q-basic-${Date.now()}-${i}`,
      priority: q.priority ?? i,
    }));

    const response: ApiResponse<InterviewQuestion[]> = {
      success: true,
      data: questions,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '生成基础问题失败',
    };
    res.status(500).json(response);
  }
});

router.post('/evaluate-answer', (req: Request, res: Response) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      const response: ApiResponse<null> = {
        success: false,
        error: '请提供问题和回答',
      };
      return res.status(400).json(response);
    }

    const result = evaluateAnswer(question, answer);

    const response: ApiResponse<typeof result> = {
      success: true,
      data: result,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '评估回答失败',
    };
    res.status(500).json(response);
  }
});

export default router;
