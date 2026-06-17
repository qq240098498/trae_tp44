import { Router, Request, Response } from 'express';
import type { JobDescriptionForm, ApiResponse } from '../../shared/types';
import { generateJobDescription, optimizeJobDescription } from '../services/jobDescriptionGenerator';

const router = Router();

router.post('/generate', (req: Request, res: Response) => {
  try {
    const form = req.body as JobDescriptionForm;
    const { jobPosition, biasValidation } = generateJobDescription(form);

    const response: ApiResponse<typeof jobPosition> = {
      success: true,
      data: {
        ...jobPosition,
        biasValidation,
      } as any,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '生成职位描述失败',
    };
    res.status(500).json(response);
  }
});

router.post('/optimize', (req: Request, res: Response) => {
  try {
    const { description } = req.body;
    const result = optimizeJobDescription(description);

    const response: ApiResponse<typeof result> = {
      success: true,
      data: result,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '优化职位描述失败',
    };
    res.status(500).json(response);
  }
});

export default router;
