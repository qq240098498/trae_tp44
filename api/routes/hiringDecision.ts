import { Router, Request, Response } from 'express';
import type { ApiResponse, HiringRecommendation } from '../../shared/types';
import { generateHiringRecommendation, compareCandidates } from '../services/evaluationEngine';
import { mockResumes, mockJobPositions } from '../data/mockData';
import { analyzeResume } from '../services/resumeAnalyzer';

const router = Router();

router.post('/generate', (req: Request, res: Response) => {
  try {
    const { resumeId, jobPositionId, includeInterviewEvaluation } = req.body;

    if (!resumeId || !jobPositionId) {
      const response: ApiResponse<null> = {
        success: false,
        error: '请提供简历ID和职位ID',
      };
      return res.status(400).json(response);
    }

    const resume = mockResumes.find(r => r.id === resumeId);
    const jobPosition = mockJobPositions.find(j => j.id === jobPositionId);

    if (!resume) {
      const response: ApiResponse<null> = {
        success: false,
        error: '简历不存在',
      };
      return res.status(404).json(response);
    }

    if (!jobPosition) {
      const response: ApiResponse<null> = {
        success: false,
        error: '职位不存在',
      };
      return res.status(404).json(response);
    }

    const resumeEvaluation = analyzeResume(resume, jobPosition);

    const recommendation = generateHiringRecommendation(
      resume,
      jobPosition,
      resumeEvaluation,
      includeInterviewEvaluation ? undefined : undefined
    );

    const response: ApiResponse<HiringRecommendation> = {
      success: true,
      data: recommendation,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '生成录用建议失败',
    };
    res.status(500).json(response);
  }
});

router.post('/compare', (req: Request, res: Response) => {
  try {
    const { resumeIds, jobPositionId } = req.body;

    if (!resumeIds || !jobPositionId) {
      const response: ApiResponse<null> = {
        success: false,
        error: '请提供简历ID列表和职位ID',
      };
      return res.status(400).json(response);
    }

    const jobPosition = mockJobPositions.find(j => j.id === jobPositionId);

    if (!jobPosition) {
      const response: ApiResponse<null> = {
        success: false,
        error: '职位不存在',
      };
      return res.status(404).json(response);
    }

    const candidates = resumeIds.map((resumeId: string) => {
      const resume = mockResumes.find(r => r.id === resumeId);
      if (!resume) return null;
      const evaluation = analyzeResume(resume, jobPosition);
      return {
        resume,
        evaluation,
      };
    }).filter(Boolean) as Array<{
      resume: typeof mockResumes[0];
      evaluation: ReturnType<typeof analyzeResume>;
    }>;

    const comparison = compareCandidates(candidates, jobPosition);

    const response: ApiResponse<typeof comparison> = {
      success: true,
      data: comparison,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '对比候选人失败',
    };
    res.status(500).json(response);
  }
});

export default router;
