import { Router, Request, Response } from 'express';
import type { ApiResponse } from '../../shared/types';
import { generateSalaryEstimation } from '../services/salaryEstimator';

const router = Router();

router.post('/estimate', (req: Request, res: Response) => {
  try {
    const { jobPositionId, location, industry } = req.body;

    if (!jobPositionId) {
      const response: ApiResponse<null> = {
        success: false,
        error: '缺少职位ID',
      };
      return res.status(400).json(response);
    }

    const result = generateSalaryEstimation(jobPositionId, { location, industry });

    const response: ApiResponse<typeof result> = {
      success: true,
      data: result,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '生成薪酬估算失败',
    };
    res.status(500).json(response);
  }
});

export default router;
