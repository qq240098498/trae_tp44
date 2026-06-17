import { Router, Request, Response } from 'express';
import type { ApiResponse, InterviewQuestion } from '../../shared/types';
import { generateInterviewQuestions, evaluateAnswer } from '../services/questionGenerator';
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

    const questions = generateInterviewQuestions(jobPosition, resume);

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
