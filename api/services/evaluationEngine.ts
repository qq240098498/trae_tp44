import type {
  EvaluationResult,
  InterviewEvaluation,
  HiringRecommendation,
  Resume,
  JobPosition,
  HighPerformerProfile,
  TalentProfileMatchResult,
  FitPoint,
} from '../../shared/types';
import { analyzeResume } from './resumeAnalyzer';
import { highPerformerProfiles } from '../data/mockData';

export function generateHiringRecommendation(
  resume: Resume,
  jobPosition: JobPosition,
  resumeEvaluation: EvaluationResult,
  interviewEvaluation?: InterviewEvaluation
): HiringRecommendation {
  const scores: number[] = [];
  const reasons: string[] = [];

  scores.push(resumeEvaluation.overallScore);

  if (resumeEvaluation.skillMatch.score >= 80) {
    reasons.push('技能匹配度高，核心技能全部覆盖');
  } else if (resumeEvaluation.skillMatch.score >= 60) {
    reasons.push('技能基本匹配，部分技能可通过培训掌握');
  } else {
    reasons.push('技能匹配度较低，需要较多培训投入');
  }

  if (resumeEvaluation.experienceRelevance.score >= 80) {
    reasons.push('相关工作经验丰富，能够快速上手');
  } else if (resumeEvaluation.experienceRelevance.score >= 60) {
    reasons.push('有一定相关经验，需要适应期');
  } else {
    reasons.push('相关经验不足，需要较长学习周期');
  }

  if (resumeEvaluation.potential.score >= 80) {
    reasons.push('发展潜力大，具备良好的成长空间');
  } else if (resumeEvaluation.potential.score >= 60) {
    reasons.push('有一定发展潜力，需要适当引导');
  } else {
    reasons.push('发展潜力评估一般');
  }

  let interviewScore = 0;
  if (interviewEvaluation) {
    interviewScore = Math.round(
      (interviewEvaluation.scores.professional * 0.5 +
        interviewEvaluation.scores.softSkill * 0.3 +
        interviewEvaluation.scores.culturalFit * 0.2)
    );
    scores.push(interviewScore);

    if (interviewEvaluation.scores.professional >= 80) {
      reasons.push('专业能力面试表现优秀');
    } else if (interviewEvaluation.scores.professional >= 60) {
      reasons.push('专业能力面试表现良好');
    } else {
      reasons.push('专业能力面试表现有待提升');
    }

    if (interviewEvaluation.scores.softSkill >= 80) {
      reasons.push('软技能面试表现突出');
    } else if (interviewEvaluation.scores.softSkill >= 60) {
      reasons.push('软技能面试表现良好');
    } else {
      reasons.push('软技能需要进一步考察');
    }

    if (interviewEvaluation.scores.culturalFit >= 80) {
      reasons.push('与公司文化高度契合');
    } else if (interviewEvaluation.scores.culturalFit >= 60) {
      reasons.push('与公司文化基本适配');
    } else {
      reasons.push('文化适配度需要进一步评估');
    }
  }

  const weights = interviewEvaluation ? [0.6, 0.4] : [1];
  const overallScore = Math.round(
    scores.reduce((sum, score, index) => sum + score * weights[index], 0)
  );

  let recommendation: 'hire' | 'reject' | 'pending';
  let finalDecision: string;

  if (!resumeEvaluation.biasCheck.isFair) {
    reasons.unshift('⚠️ 注意：简历中检测到敏感信息，已自动屏蔽。请基于屏蔽后的内容进行评估，确保招聘公平性。');
  }

  if (overallScore >= 80) {
    recommendation = 'hire';
    finalDecision = '强烈推荐录用';
    reasons.push(`综合评分 ${overallScore} 分，候选人各方面表现优秀，强烈推荐录用`);
  } else if (overallScore >= 70) {
    recommendation = 'hire';
    finalDecision = '推荐录用';
    reasons.push(`综合评分 ${overallScore} 分，候选人整体表现良好，推荐录用`);
  } else if (overallScore >= 60) {
    recommendation = 'pending';
    finalDecision = '待定，建议进一步考察';
    reasons.push(`综合评分 ${overallScore} 分，候选人基本符合要求，建议进行第二轮面试或背景调查`);
  } else if (overallScore >= 50) {
    recommendation = 'pending';
    finalDecision = '待定，可作为备选';
    reasons.push(`综合评分 ${overallScore} 分，与岗位要求有一定差距，可作为备选人选`);
  } else {
    recommendation = 'reject';
    finalDecision = '不推荐录用';
    reasons.push(`综合评分 ${overallScore} 分，与岗位要求差距较大，不推荐录用`);
  }

  if (!interviewEvaluation) {
    reasons.push('*注：此建议基于简历评估，最终决策请结合面试表现综合判断');
  }

  return {
    id: `rec-${Date.now()}`,
    resumeId: resume.id,
    recommendation,
    reasons,
    overallScore,
    finalDecision,
    createdAt: new Date(),
  };
}

export function generateInterviewEvaluationReport(
  evaluation: InterviewEvaluation,
  resume: Resume,
  jobPosition: JobPosition
): {
  summary: string;
  strengths: string[];
  improvements: string[];
  overallScore: number;
} {
  const strengths: string[] = [];
  const improvements: string[] = [];

  const overallScore = Math.round(
    (evaluation.scores.professional * 0.5 +
      evaluation.scores.softSkill * 0.3 +
      evaluation.scores.culturalFit * 0.2)
  );

  if (evaluation.scores.professional >= 80) {
    strengths.push('专业能力突出，技术功底扎实');
  } else if (evaluation.scores.professional >= 60) {
    strengths.push('专业能力符合岗位要求');
  } else {
    improvements.push('专业能力需要进一步提升');
  }

  if (evaluation.scores.softSkill >= 80) {
    strengths.push('沟通表达能力强，逻辑思维清晰');
  } else if (evaluation.scores.softSkill >= 60) {
    strengths.push('软技能表现良好');
  } else {
    improvements.push('沟通表达和逻辑思维能力需要加强');
  }

  if (evaluation.scores.culturalFit >= 80) {
    strengths.push('与公司文化高度契合，价值观匹配');
  } else if (evaluation.scores.culturalFit >= 60) {
    strengths.push('文化适配度良好');
  } else {
    improvements.push('文化适配度需要进一步观察');
  }

  if (evaluation.overallComment) {
    if (evaluation.overallComment.includes('优秀') || evaluation.overallComment.includes('突出')) {
      strengths.push('面试官整体评价优秀');
    } else if (evaluation.overallComment.includes('良好')) {
      strengths.push('面试官整体评价良好');
    }
  }

  let summary = '';
  if (overallScore >= 80) {
    summary = `${resume.name}在本次面试中表现优秀，专业能力、软技能和文化适配度均达到较高水平，完全符合${jobPosition.title}岗位要求。`;
  } else if (overallScore >= 70) {
    summary = `${resume.name}在本次面试中表现良好，整体符合${jobPosition.title}岗位要求，建议录用。`;
  } else if (overallScore >= 60) {
    summary = `${resume.name}在本次面试中表现基本符合${jobPosition.title}岗位要求，部分能力需要进一步考察，建议进行第二轮面试。`;
  } else {
    summary = `${resume.name}在本次面试中的表现与${jobPosition.title}岗位要求有一定差距，建议慎重考虑。`;
  }

  return {
    summary,
    strengths,
    improvements,
    overallScore,
  };
}

export function compareCandidates(
  candidates: Array<{
    resume: Resume;
    evaluation: EvaluationResult;
    interviewEvaluation?: InterviewEvaluation;
  }>,
  jobPosition: JobPosition
): Array<{
  resume: Resume;
  ranking: number;
  overallScore: number;
  recommendation: HiringRecommendation;
}> {
  const results = candidates.map(candidate => {
    const recommendation = generateHiringRecommendation(
      candidate.resume,
      jobPosition,
      candidate.evaluation,
      candidate.interviewEvaluation
    );

    return {
      resume: candidate.resume,
      overallScore: recommendation.overallScore,
      recommendation,
    };
  });

  results.sort((a, b) => b.overallScore - a.overallScore);

  return results.map((result, index) => ({
    ...result,
    ranking: index + 1,
  }));
}

export function getScoreLevel(score: number): {
  level: string;
  color: string;
  description: string;
} {
  if (score >= 90) {
    return {
      level: 'S',
      color: 'text-purple-600',
      description: '极其优秀'
    };
  } else if (score >= 80) {
    return {
      level: 'A',
      color: 'text-emerald-600',
      description: '优秀'
    };
  } else if (score >= 70) {
    return {
      level: 'B',
      color: 'text-blue-600',
      description: '良好'
    };
  } else if (score >= 60) {
    return {
      level: 'C',
      color: 'text-amber-600',
      description: '合格'
    };
  } else if (score >= 50) {
    return {
      level: 'D',
      color: 'text-orange-600',
      description: '待改进'
    };
  } else {
    return {
      level: 'E',
      color: 'text-red-600',
      description: '不合格'
    };
  }
}

export function matchTalentProfile(
  resume: Resume,
  jobPosition: JobPosition
): TalentProfileMatchResult {
  const relevantProfiles = highPerformerProfiles.filter(
    p => p.department === jobPosition.department
  );

  const targetProfile = relevantProfiles.length > 0
    ? relevantProfiles.reduce((best, current) => {
        const bestMatch = calculateProfileMatchScore(resume, best);
        const currentMatch = calculateProfileMatchScore(resume, current);
        return currentMatch > bestMatch ? current : best;
      })
    : highPerformerProfiles[0];

  const skillMatch = calculateSkillProfileMatch(resume, targetProfile);
  const projectMatch = calculateProjectProfileMatch(resume, targetProfile);
  const careerMatch = calculateCareerProfileMatch(resume, targetProfile);
  const strengthMatch = calculateStrengthProfileMatch(resume, targetProfile);

  const overallConfidence = Math.round(
    skillMatch.score * 0.35 +
    projectMatch.score * 0.3 +
    careerMatch.score * 0.2 +
    strengthMatch.score * 0.15
  );

  const keyFitPoints = generateKeyFitPoints(
    resume,
    targetProfile,
    skillMatch,
    projectMatch,
    careerMatch,
    strengthMatch
  );

  const potentialAssessment = generatePotentialAssessment(
    overallConfidence,
    keyFitPoints,
    targetProfile
  );

  return {
    overallConfidence,
    skillMatch,
    projectMatch,
    careerMatch,
    strengthMatch,
    keyFitPoints,
    potentialAssessment,
    matchedProfileId: targetProfile.id,
    matchedProfilePosition: targetProfile.position,
  };
}

function calculateProfileMatchScore(
  resume: Resume,
  profile: HighPerformerProfile
): number {
  const skillOverlap = resume.skills.filter(s =>
    profile.coreSkills.some(ps => s.toLowerCase().includes(ps.toLowerCase()) ||
      ps.toLowerCase().includes(s.toLowerCase()))
  ).length;
  const skillScore = (skillOverlap / profile.coreSkills.length) * 100;

  return Math.min(skillScore, 100);
}

function calculateSkillProfileMatch(
  resume: Resume,
  profile: HighPerformerProfile
): { score: number; matchedSkills: string[]; details: string } {
  const matchedSkills: string[] = [];
  const resumeSkillsLower = resume.skills.map(s => s.toLowerCase());

  profile.coreSkills.forEach(coreSkill => {
    const coreSkillLower = coreSkill.toLowerCase();
    const match = resumeSkillsLower.find(rs =>
      rs.includes(coreSkillLower) || coreSkillLower.includes(rs)
    );
    if (match) {
      const originalSkill = resume.skills[resumeSkillsLower.indexOf(match)];
      matchedSkills.push(originalSkill);
    }
  });

  const additionalSkills = resume.skills.filter(s =>
    !matchedSkills.includes(s) &&
    profile.coreSkills.some(ps =>
      s.toLowerCase().includes(ps.toLowerCase()) ||
      ps.toLowerCase().includes(s.toLowerCase())
    )
  );

  const score = Math.round(
    ((matchedSkills.length + additionalSkills.length * 0.5) / profile.coreSkills.length) * 100
  );

  const details = `候选人掌握 ${matchedSkills.length}/${profile.coreSkills.length} 项绩优员工核心技能${
    additionalSkills.length > 0 ? `，另有 ${additionalSkills.length} 项相关技能` : ''
  }`;

  return {
    score: Math.min(score, 100),
    matchedSkills: [...new Set([...matchedSkills, ...additionalSkills])],
    details,
  };
}

function calculateProjectProfileMatch(
  resume: Resume,
  profile: HighPerformerProfile
): { score: number; matchedProjectTypes: string[]; details: string } {
  const matchedProjectTypes: string[] = [];
  const resumeProjectText = resume.projects
    .map(p => `${p.name} ${p.description} ${p.technologies.join(' ')}`)
    .join(' ')
    .toLowerCase();

  const resumeExperienceText = resume.experience
    .map(e => `${e.description} ${e.achievements.join(' ')}`)
    .join(' ')
    .toLowerCase();

  const fullText = `${resumeProjectText} ${resumeExperienceText}`;

  profile.projectTypes.forEach(projectType => {
    const typeLower = projectType.toLowerCase();
    if (fullText.includes(typeLower)) {
      matchedProjectTypes.push(projectType);
    }
  });

  const synonymMap: Record<string, string[]> = {
    '电商平台': ['电商', '商城', '交易', '订单', '购物'],
    'SaaS系统': ['saas', '企业级', '中后台', '管理系统', '平台'],
    '微前端架构': ['微前端', 'qiankun', 'micro', '模块联邦'],
    '性能优化': ['性能', '优化', '提速', '加载', '首屏'],
    '组件库建设': ['组件库', 'ui库', '组件', '设计系统'],
    '低代码平台': ['低代码', '可视化', '拖拽', '配置化'],
    '中台系统': ['中台', '中间件', '基础平台'],
    '技术基础设施': ['基础设施', '工程化', '脚手架', 'ci/cd'],
  };

  profile.projectTypes.forEach(projectType => {
    if (!matchedProjectTypes.includes(projectType)) {
      const synonyms = synonymMap[projectType] || [];
      const hasSynonym = synonyms.some(s => fullText.includes(s.toLowerCase()));
      if (hasSynonym) {
        matchedProjectTypes.push(projectType);
      }
    }
  });

  const score = Math.round(
    (matchedProjectTypes.length / profile.projectTypes.length) * 100
  );

  const details = `候选人有 ${matchedProjectTypes.length}/${profile.projectTypes.length} 类与绩优员工相似的项目经验`;

  return {
    score: Math.min(score, 100),
    matchedProjectTypes,
    details,
  };
}

function calculateCareerProfileMatch(
  resume: Resume,
  profile: HighPerformerProfile
): { score: number; matchedTrajectory: string[]; details: string } {
  const matchedTrajectory: string[] = [];
  const positions = resume.experience.map(e => e.position);

  const careerKeywords: Record<string, string[]> = {
    '初级工程师': ['初级', '实习生', '助理', 'junior'],
    '中级工程师': ['中级', '工程师', '开发工程师', 'mid'],
    '高级工程师': ['高级', '资深', 'senior', '高级工程师'],
    '技术负责人': ['负责人', '技术leader', '技术主管', 'lead'],
    '技术专家': ['专家', '技术专家', '架构师', 'expert'],
    '核心开发': ['核心', '主力', '骨干'],
  };

  profile.careerTrajectory.forEach(trajectory => {
    const keywords = careerKeywords[trajectory] || [trajectory];
    const match = positions.some(pos =>
      keywords.some(kw => pos.toLowerCase().includes(kw.toLowerCase()))
    );
    if (match) {
      matchedTrajectory.push(trajectory);
    }
  });

  const hasProgression = checkCareerProgression(resume);
  let score = Math.round(
    (matchedTrajectory.length / profile.careerTrajectory.length) * 100
  );

  if (hasProgression) {
    score = Math.min(score + 15, 100);
  }

  const details = `候选人职业轨迹覆盖 ${matchedTrajectory.length}/${profile.careerTrajectory.length} 个绩优员工发展阶段${
    hasProgression ? '，呈现明显上升趋势' : ''
  }`;

  return {
    score: Math.min(score, 100),
    matchedTrajectory,
    details,
  };
}

function checkCareerProgression(resume: Resume): boolean {
  const seniorityLevels: Record<string, number> = {
    '初级': 1, '实习': 1, '助理': 1,
    '中级': 2, '工程师': 2,
    '高级': 3, '资深': 3,
    '专家': 4, '架构师': 4,
    '负责人': 5, '主管': 5, '经理': 5, 'leader': 5,
  };

  const levels = resume.experience.map(exp => {
    const pos = exp.position.toLowerCase();
    for (const [keyword, level] of Object.entries(seniorityLevels)) {
      if (pos.includes(keyword.toLowerCase())) {
        return level;
      }
    }
    return 2;
  });

  for (let i = 1; i < levels.length; i++) {
    if (levels[i] > levels[i - 1]) {
      return true;
    }
  }

  return false;
}

function calculateStrengthProfileMatch(
  resume: Resume,
  profile: HighPerformerProfile
): { score: number; matchedStrengths: string[]; details: string } {
  const matchedStrengths: string[] = [];
  const resumeText = `${
    resume.experience.map(e => `${e.description} ${e.achievements.join(' ')}`).join(' ')
  } ${
    resume.projects.map(p => `${p.description} ${p.achievements.join(' ')}`).join(' ')
  }`.toLowerCase();

  const strengthEvidenceMap: Record<string, string[]> = {
    '技术领导力': ['主导', '带领', '负责', '推动', '建立', '制定'],
    '问题解决能力': ['解决', '优化', '改进', '修复', '攻克', '突破'],
    '跨团队协作': ['跨团队', '协作', '配合', '沟通', '协调', '联动'],
    '持续学习': ['学习', '研究', '探索', '引入', '新技术', '创新'],
    '代码质量把控': ['代码质量', '规范', 'review', '重构', '可维护'],
    '技术创新': ['创新', '首创', '专利', '论文', '开源', '突破'],
    '架构设计能力': ['架构', '设计', '方案', '规划', '顶层设计'],
    '团队培养': ['培养', '指导', 'mentor', '带教', '分享', '培训'],
    '复杂问题拆解': ['拆解', '分而治之', '模块化', '解耦', '抽象'],
    '跨部门协作': ['跨部门', '对齐', '同步', '推动', '协调'],
    '快速学习': ['快速上手', '短时间', '学习能力', '迅速掌握'],
    '执行力强': ['按时交付', '高质量完成', '高效', '落地', '执行'],
    '主动承担': ['主动', '积极', '自愿', '挺身而出', '主动请缨'],
  };

  profile.keyStrengths.forEach(strength => {
    const evidenceKeywords = strengthEvidenceMap[strength] || [strength];
    const hasEvidence = evidenceKeywords.some(kw =>
      resumeText.includes(kw.toLowerCase())
    );
    if (hasEvidence) {
      matchedStrengths.push(strength);
    }
  });

  const score = Math.round(
    (matchedStrengths.length / profile.keyStrengths.length) * 100
  );

  const details = `候选人展现出 ${matchedStrengths.length}/${profile.keyStrengths.length} 项绩优员工关键特质`;

  return {
    score: Math.min(score, 100),
    matchedStrengths,
    details,
  };
}

function generateKeyFitPoints(
  resume: Resume,
  profile: HighPerformerProfile,
  skillMatch: { score: number; matchedSkills: string[]; details: string },
  projectMatch: { score: number; matchedProjectTypes: string[]; details: string },
  careerMatch: { score: number; matchedTrajectory: string[]; details: string },
  strengthMatch: { score: number; matchedStrengths: string[]; details: string }
): FitPoint[] {
  const fitPoints: FitPoint[] = [];

  if (skillMatch.score >= 70 && skillMatch.matchedSkills.length > 0) {
    const topSkills = skillMatch.matchedSkills.slice(0, 3);
    fitPoints.push({
      category: 'skill',
      description: `技能组合与绩优画像高度匹配，核心技能覆盖度达 ${skillMatch.score}%`,
      confidence: skillMatch.score,
      evidence: `掌握 ${topSkills.join('、')} 等关键技术栈`,
    });
  }

  if (projectMatch.score >= 70 && projectMatch.matchedProjectTypes.length > 0) {
    const topProjects = projectMatch.matchedProjectTypes.slice(0, 2);
    fitPoints.push({
      category: 'project',
      description: `项目经历与绩优画像匹配度达 ${projectMatch.score}%`,
      confidence: projectMatch.score,
      evidence: `具备 ${topProjects.join('、')} 等相关项目经验`,
    });
  }

  if (strengthMatch.matchedStrengths.length > 0) {
    const topStrengths = strengthMatch.matchedStrengths.slice(0, 3);
    const strengthConfidence = Math.round(
      (topStrengths.length / profile.keyStrengths.length) * 100
    );
    fitPoints.push({
      category: 'strength',
      description: `该候选人的${topStrengths.join('、')}特质与绩优员工画像匹配度达 ${strengthConfidence}%`,
      confidence: strengthMatch.score,
      evidence: `从简历中识别出 ${strengthMatch.matchedStrengths.length} 项绩优特质`,
    });
  }

  if (careerMatch.score >= 60 && careerMatch.matchedTrajectory.length > 0) {
    fitPoints.push({
      category: 'career',
      description: `职业发展轨迹与绩优员工成长路径契合度达 ${careerMatch.score}%`,
      confidence: careerMatch.score,
      evidence: `经历了 ${careerMatch.matchedTrajectory.join(' → ')} 的发展阶段`,
    });
  }

  return fitPoints.sort((a, b) => b.confidence - a.confidence);
}

function generatePotentialAssessment(
  overallConfidence: number,
  fitPoints: FitPoint[],
  profile: HighPerformerProfile
): string {
  const topFitPoint = fitPoints[0];

  if (overallConfidence >= 85) {
    return `该候选人与公司${profile.position}绩优员工画像高度契合（置信度 ${overallConfidence}%），${
      topFitPoint ? topFitPoint.description : '各维度均表现优秀'
    }。预计具备极高的成长潜力，能够快速融入团队并创造价值。`;
  } else if (overallConfidence >= 70) {
    return `该候选人与公司${profile.position}绩优员工画像较为匹配（置信度 ${overallConfidence}%），${
      topFitPoint ? topFitPoint.description : '关键维度表现良好'
    }。具备良好的成长潜力，建议重点关注。`;
  } else if (overallConfidence >= 55) {
    return `该候选人与公司${profile.position}绩优员工画像有一定匹配度（置信度 ${overallConfidence}%），部分维度存在差距。在适当的培养下具备成长潜力，建议结合面试深入评估。`;
  } else {
    return `该候选人与公司${profile.position}绩优员工画像匹配度较低（置信度 ${overallConfidence}%），成长潜力有待观察。建议在面试中重点考察学习能力和适应性。`;
  }
}

export function evaluateResumeWithTalentMatch(
  resume: Resume,
  jobPosition: JobPosition
): EvaluationResult {
  const baseEvaluation = analyzeResume(resume, jobPosition);
  const talentProfileMatch = matchTalentProfile(resume, jobPosition);

  const talentBonus = talentProfileMatch.overallConfidence >= 70 ? 5 : 0;

  return {
    ...baseEvaluation,
    talentProfileMatch,
    overallScore: Math.min(baseEvaluation.overallScore + talentBonus, 100),
  };
}
