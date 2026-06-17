import { Router, Request, Response } from 'express';
import type { ApiResponse, InterviewEvaluation } from '../../shared/types';
import { generateInterviewEvaluationReport } from '../services/evaluationEngine';
import { mockResumes, mockJobPositions } from '../data/mockData';

const evaluations: InterviewEvaluation[] = [];

const router = Router();

router.post('/submit', (req: Request, res: Response) => {
  try {
    const evaluationData = req.body as Omit<InterviewEvaluation, 'id' | 'createdAt'>;

    if (!evaluationData.resumeId) {
      const response: ApiResponse<null> = {
        success: false,
        error: '请提供简历ID',
      };
      return res.status(400).json(response);
    }

    const evaluation: InterviewEvaluation = {
      ...evaluationData,
      id: `eval-${Date.now()}`,
      createdAt: new Date(),
    };

    evaluations.push(evaluation);

    const resume = mockResumes.find(r => r.id === evaluation.resumeId);
    const jobPosition = resume?.appliedPositionId
      ? mockJobPositions.find(j => j.id === resume.appliedPositionId)
      : mockJobPositions[0];

    let report = null;
    if (resume && jobPosition) {
      report = generateInterviewEvaluationReport(evaluation, resume, jobPosition);
    }

    const response: ApiResponse<{ evaluation: InterviewEvaluation; report?: typeof report }> = {
      success: true,
      data: {
        evaluation,
        report,
      },
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '提交面试评价失败',
    };
    res.status(500).json(response);
  }
});

router.get('/resume/:resumeId', (req: Request, res: Response) => {
  try {
    const { resumeId } = req.params;
    const resumeEvaluations = evaluations.filter(e => e.resumeId === resumeId);

    const response: ApiResponse<InterviewEvaluation[]> = {
      success: true,
      data: resumeEvaluations,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '获取面试评价失败',
    };
    res.status(500).json(response);
  }
});

export default router;
