import { Router, Request, Response } from 'express';
import type { ApiResponse, HighPerformerProfile } from '../../shared/types';
import {
  talentProfileStore,
  getTalentProfiles,
  getTalentProfileById,
  getTalentProfilesByDepartment,
} from '../services/talentProfileStore';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const { department, position } = req.query;
    let profiles: HighPerformerProfile[];

    if (department) {
      profiles = getTalentProfilesByDepartment(String(department));
    } else if (position) {
      profiles = talentProfileStore.getByPosition(String(position));
    } else {
      profiles = getTalentProfiles();
    }

    const response: ApiResponse<{ profiles: HighPerformerProfile[]; total: number }> = {
      success: true,
      data: {
        profiles,
        total: profiles.length,
      },
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '获取人才画像列表失败',
    };
    res.status(500).json(response);
  }
});

router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const profile = getTalentProfileById(id);

    if (!profile) {
      const response: ApiResponse<null> = {
        success: false,
        error: '人才画像不存在',
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<HighPerformerProfile> = {
      success: true,
      data: profile,
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '获取人才画像详情失败',
    };
    res.status(500).json(response);
  }
});

router.post('/', (req: Request, res: Response) => {
  try {
    const profileData = req.body as Partial<HighPerformerProfile> & { id?: string };

    if (!profileData.position || !profileData.department) {
      const response: ApiResponse<null> = {
        success: false,
        error: '职位和部门为必填字段',
      };
      return res.status(400).json(response);
    }

    const newProfile = talentProfileStore.create(profileData as Omit<HighPerformerProfile, 'id'> & { id?: string });

    const response: ApiResponse<HighPerformerProfile> = {
      success: true,
      data: newProfile,
    };
    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '创建人才画像失败',
    };
    res.status(500).json(response);
  }
});

router.put('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body as Partial<Omit<HighPerformerProfile, 'id'>>;

    const updatedProfile = talentProfileStore.update(id, updates);

    const response: ApiResponse<HighPerformerProfile> = {
      success: true,
      data: updatedProfile,
    };
    res.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : '更新人才画像失败';
    const status = message.includes('not found') ? 404 : 500;
    const response: ApiResponse<null> = {
      success: false,
      error: message,
    };
    res.status(status).json(response);
  }
});

router.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = talentProfileStore.delete(id);

    if (!deleted) {
      const response: ApiResponse<null> = {
        success: false,
        error: '人才画像不存在',
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<{ deleted: boolean }> = {
      success: true,
      data: { deleted: true },
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '删除人才画像失败',
    };
    res.status(500).json(response);
  }
});

router.post('/bulk', (req: Request, res: Response) => {
  try {
    const { profiles } = req.body as {
      profiles: Array<Partial<HighPerformerProfile> & { id?: string }>;
    };

    if (!profiles || !Array.isArray(profiles)) {
      const response: ApiResponse<null> = {
        success: false,
        error: '请提供有效的画像数据数组',
      };
      return res.status(400).json(response);
    }

    const validProfiles = profiles as Array<Omit<HighPerformerProfile, 'id'> & { id?: string }>;
    const createdProfiles = talentProfileStore.bulkCreate(validProfiles);

    const response: ApiResponse<{ profiles: HighPerformerProfile[]; count: number }> = {
      success: true,
      data: {
        profiles: createdProfiles,
        count: createdProfiles.length,
      },
    };
    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '批量创建人才画像失败',
    };
    res.status(500).json(response);
  }
});

router.delete('/bulk', (req: Request, res: Response) => {
  try {
    const { ids } = req.body as { ids: string[] };

    if (!ids || !Array.isArray(ids)) {
      const response: ApiResponse<null> = {
        success: false,
        error: '请提供有效的ID数组',
      };
      return res.status(400).json(response);
    }

    const deletedCount = talentProfileStore.bulkDelete(ids);

    const response: ApiResponse<{ deleted: number; total: number }> = {
      success: true,
      data: {
        deleted: deletedCount,
        total: ids.length,
      },
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '批量删除人才画像失败',
    };
    res.status(500).json(response);
  }
});

router.post('/reset', (req: Request, res: Response) => {
  try {
    talentProfileStore.clear();

    const response: ApiResponse<{ reset: boolean; count: number }> = {
      success: true,
      data: {
        reset: true,
        count: talentProfileStore.count(),
      },
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '重置人才画像失败',
    };
    res.status(500).json(response);
  }
});

router.post('/replace', (req: Request, res: Response) => {
  try {
    const { profiles } = req.body as { profiles: HighPerformerProfile[] };

    if (!profiles || !Array.isArray(profiles)) {
      const response: ApiResponse<null> = {
        success: false,
        error: '请提供有效的画像数据数组',
      };
      return res.status(400).json(response);
    }

    talentProfileStore.replaceAll(profiles);

    const response: ApiResponse<{ profiles: HighPerformerProfile[]; count: number }> = {
      success: true,
      data: {
        profiles: talentProfileStore.getAll(),
        count: talentProfileStore.count(),
      },
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '替换人才画像失败',
    };
    res.status(500).json(response);
  }
});

export default router;
