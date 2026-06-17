import { Router, Request, Response } from 'express';
import type { ApiResponse } from '../../shared/types';
import { checkBias, maskSensitiveInformation, validateJobDescriptionForBias } from '../services/biasDetection';

const router = Router();

router.post('/check', (req: Request, res: Response) => {
  try {
    const { content } = req.body;

    if (!content) {
      const response: ApiResponse<null> = {
        success: false,
        error: '请提供内容',
      };
      return res.status(400).json(response);
    }

    const result = checkBias(content);

    const response: ApiResponse<typeof result> = {
      success: true,
      data: result,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '检测偏见失败',
    };
    res.status(500).json(response);
  }
});

router.post('/mask', (req: Request, res: Response) => {
  try {
    const { content } = req.body;

    if (!content) {
      const response: ApiResponse<null> = {
        success: false,
        error: '请提供内容',
      };
      return res.status(400).json(response);
    }

    const result = maskSensitiveInformation(content);

    const response: ApiResponse<typeof result> = {
      success: true,
      data: result,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '屏蔽敏感信息失败',
    };
    res.status(500).json(response);
  }
});

router.post('/validate-job-description', (req: Request, res: Response) => {
  try {
    const { description } = req.body;

    if (!description) {
      const response: ApiResponse<null> = {
        success: false,
        error: '请提供职位描述',
      };
      return res.status(400).json(response);
    }

    const result = validateJobDescriptionForBias(description);

    const response: ApiResponse<typeof result> = {
      success: true,
      data: result,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '验证职位描述失败',
    };
    res.status(500).json(response);
  }
});

router.get('/categories', (req: Request, res: Response) => {
  try {
    const categories = [
      { key: 'gender', label: '性别', description: '性别相关信息，如男、女、先生、女士等' },
      { key: 'age', label: '年龄', description: '年龄相关信息，如年龄、出生日期、出生年月等' },
      { key: 'location', label: '地域', description: '地域相关信息，如籍贯、户籍、出生地、居住地等' },
      { key: 'maritalStatus', label: '婚姻状况', description: '婚姻状况相关信息，如已婚、未婚、离异等' },
      { key: 'religion', label: '宗教信仰', description: '宗教信仰相关信息' },
      { key: 'political', label: '政治面貌', description: '政治面貌相关信息' },
      { key: 'health', label: '健康状况', description: '健康状况相关信息' },
      { key: 'ethnic', label: '民族', description: '民族相关信息' },
    ];

    const response: ApiResponse<typeof categories> = {
      success: true,
      data: categories,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '获取偏见检测类别失败',
    };
    res.status(500).json(response);
  }
});

export default router;
