import { Router, Request, Response } from 'express';
import type { ApiResponse, Resume, EvaluationResult } from '../../shared/types';
import { mockResumes, mockJobPositions } from '../data/mockData';
import { analyzeResume, parseResumeText } from '../services/resumeAnalyzer';
import { maskSensitiveInformation } from '../services/biasDetection';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const response: ApiResponse<Resume[]> = {
      success: true,
      data: mockResumes,
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '获取简历列表失败',
    };
    res.status(500).json(response);
  }
});

router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resume = mockResumes.find(r => r.id === id);

    if (!resume) {
      const response: ApiResponse<null> = {
        success: false,
        error: '简历不存在',
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<Resume> = {
      success: true,
      data: resume,
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '获取简历详情失败',
    };
    res.status(500).json(response);
  }
});

router.post('/upload', (req: Request, res: Response) => {
  try {
    const { content } = req.body;

    if (!content) {
      const response: ApiResponse<null> = {
        success: false,
        error: '请提供简历内容',
      };
      return res.status(400).json(response);
    }

    const parsedResume = parseResumeText(content);
    const { maskedContent, biasCheck } = maskSensitiveInformation(content);

    const resume: Resume = {
      ...parsedResume,
      maskedContent,
      rawContent: content,
    } as Resume;

    mockResumes.push(resume);

    const response: ApiResponse<{ resume: Resume; biasCheck: typeof biasCheck }> = {
      success: true,
      data: {
        resume,
        biasCheck,
      },
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '上传简历失败',
    };
    res.status(500).json(response);
  }
});

router.post('/evaluate', (req: Request, res: Response) => {
  try {
    const { resumeId, jobPositionId } = req.body;

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

    const evaluationResult = analyzeResume(resume, jobPosition);

    const response: ApiResponse<EvaluationResult> = {
      success: true,
      data: evaluationResult,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '评估简历失败',
    };
    res.status(500).json(response);
  }
});

router.post('/batch-evaluate', (req: Request, res: Response) => {
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

    const results = resumeIds.map((resumeId: string) => {
      const resume = mockResumes.find(r => r.id === resumeId);
      if (!resume) return null;
      return {
        resumeId,
        evaluation: analyzeResume(resume, jobPosition),
      };
    }).filter(Boolean);

    const response: ApiResponse<typeof results> = {
      success: true,
      data: results,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '批量评估失败',
    };
    res.status(500).json(response);
  }
});

export default router;
