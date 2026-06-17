import type {
  Resume,
  JobPosition,
  EvaluationResult,
  SkillMatchDetail,
  ExperienceDetail,
  PotentialDetail,
  ResumeAnalysisResult,
  ResumeRedFlag,
} from '../../shared/types';
import { maskSensitiveInformation } from './biasDetection';

export function analyzeResume(
  resume: Resume,
  jobPosition: JobPosition
): EvaluationResult {
  const { biasCheck } = maskSensitiveInformation(resume.rawContent);

  const skillMatch = analyzeSkillMatch(resume, jobPosition);
  const experienceRelevance = analyzeExperienceRelevance(resume, jobPosition);
  const potential = analyzePotential(resume, jobPosition);
  const resumeAnalysis = analyzeResumeRedFlags(resume, jobPosition);

  const skillWeight = 0.4;
  const experienceWeight = 0.35;
  const potentialWeight = 0.25;

  const overallScore = Math.round(
    skillMatch.score * skillWeight +
    experienceRelevance.score * experienceWeight +
    potential.score * potentialWeight
  );

  return {
    resumeId: resume.id,
    skillMatch,
    experienceRelevance,
    potential,
    overallScore,
    biasCheck,
    resumeAnalysis,
    evaluatedAt: new Date(),
  };
}

export function analyzeResumeRedFlags(
  resume: Resume,
  jobPosition?: JobPosition
): ResumeAnalysisResult {
  const redFlags: ResumeRedFlag[] = [];
  const strengths: string[] = [];
  const concernAreas: string[] = [];

  const noQuantifiedFlags = detectNoQuantifiedAchievements(resume);
  redFlags.push(...noQuantifiedFlags);

  const jobChangeFlags = detectFrequentJobChanges(resume);
  redFlags.push(...jobChangeFlags);

  const gapFlags = detectCareerGaps(resume);
  redFlags.push(...gapFlags);

  if (jobPosition) {
    const skillGapFlags = detectSkillGaps(resume, jobPosition);
    redFlags.push(...skillGapFlags);
  }

  const unclearFlags = detectUnclearResponsibility(resume);
  redFlags.push(...unclearFlags);

  const strengthsList = extractStrengths(resume);
  strengths.push(...strengthsList);

  if (noQuantifiedFlags.length > 0) {
    concernAreas.push('成就描述缺少量化数据');
  }
  if (jobChangeFlags.length > 0) {
    concernAreas.push('职业稳定性存疑');
  }
  if (gapFlags.length > 0) {
    concernAreas.push('存在职业空窗期');
  }

  return {
    resumeId: resume.id,
    redFlags: redFlags.sort((a, b) => {
      const severityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    }),
    strengths,
    concernAreas,
    generatedAt: new Date(),
  };
}

function detectNoQuantifiedAchievements(resume: Resume): ResumeRedFlag[] {
  const flags: ResumeRedFlag[] = [];
  const evidence: string[] = [];

  const leaderKeywords = /主导|负责|带领|推动|建立|牵头|统筹|组织|主导完成/;
  const quantRegex = /\d+%|\d+倍|\d+人|\d+万|\d+\+|\d+个|\d+项|\d+年|\d+天|\d+小时/;

  resume.experience.forEach((exp) => {
    exp.achievements.forEach((ach) => {
      if (leaderKeywords.test(ach) && !quantRegex.test(ach)) {
        evidence.push(`【${exp.position}】${ach}`);
      }
    });
  });

  resume.projects.forEach((proj) => {
    if (leaderKeywords.test(proj.role) || leaderKeywords.test(proj.description)) {
      const hasQuantified = proj.achievements.some(a => quantRegex.test(a));
      if (!hasQuantified) {
        evidence.push(`【项目${proj.name}】角色为${proj.role}，但成果未量化`);
      }
    }
  });

  if (evidence.length > 0) {
    flags.push({
      id: `redflag-noquant-${resume.id}`,
      type: 'noQuantifiedAchievement',
      severity: evidence.length >= 3 ? 'high' : evidence.length >= 2 ? 'medium' : 'low',
      title: '成就描述缺乏量化数据',
      description: `简历中有 ${evidence.length} 处提到"主导/负责"等关键词，但未提供具体的数据支撑（如提升比例、用户规模、团队大小等），建议面试中重点追问具体数据。`,
      evidence,
      suggestion: '重点追问：具体的数据指标、团队规模、项目预算、业务影响范围等',
    });
  }

  return flags;
}

function detectFrequentJobChanges(resume: Resume): ResumeRedFlag[] {
  const flags: ResumeRedFlag[] = [];
  const evidence: string[] = [];

  if (resume.experience.length < 2) return flags;

  let shortTenureCount = 0;
  resume.experience.forEach((exp) => {
    const years = calculateYears(exp.startDate, exp.endDate);
    if (years < 1.5 && exp.endDate !== '至今') {
      shortTenureCount++;
      evidence.push(`【${exp.company}】${exp.position}，任职 ${years.toFixed(1)} 年`);
    }
  });

  const totalYears = resume.experience.reduce(
    (sum, exp) => sum + calculateYears(exp.startDate, exp.endDate),
    0
  );
  const avgTenure = totalYears / resume.experience.length;

  if (shortTenureCount >= 2 || avgTenure < 1.8) {
    flags.push({
      id: `redflag-jobchange-${resume.id}`,
      type: 'frequentJobChange',
      severity: shortTenureCount >= 3 || avgTenure < 1.2 ? 'high' : 'medium',
      title: '频繁跳槽 / 职业稳定性存疑',
      description: `平均每份工作任职 ${avgTenure.toFixed(1)} 年，其中有 ${shortTenureCount} 份工作任职不足 1.5 年，需要关注候选人的职业稳定性和离职原因。`,
      evidence,
      suggestion: '重点追问：每段经历的离职原因、职业规划、对稳定工作的期望',
    });
  }

  return flags;
}

function detectCareerGaps(resume: Resume): ResumeRedFlag[] {
  const flags: ResumeRedFlag[] = [];
  const evidence: string[] = [];

  const sortedExps = [...resume.experience].sort((a, b) => {
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  for (let i = 1; i < sortedExps.length; i++) {
    const prevEnd = new Date(sortedExps[i - 1].endDate === '至今' ? Date.now() : sortedExps[i - 1].endDate);
    const currStart = new Date(sortedExps[i].startDate);
    const gapMonths = (currStart.getTime() - prevEnd.getTime()) / (1000 * 60 * 60 * 24 * 30);

    if (gapMonths >= 3) {
      evidence.push(
        `${sortedExps[i - 1].endDate} 至 ${sortedExps[i].startDate}，空窗约 ${Math.round(gapMonths)} 个月`
      );
    }
  }

  if (evidence.length > 0) {
    flags.push({
      id: `redflag-careergap-${resume.id}`,
      type: 'careerGap',
      severity: evidence.some(e => /6个月|7个月|8个月|9个月|10个月|11个月|1年/.test(e)) ? 'medium' : 'low',
      title: '存在职业空窗期',
      description: `简历中存在 ${evidence.length} 段职业空窗期，需要了解空窗期的原因和候选人在此期间的状态。`,
      evidence,
      suggestion: '重点追问：空窗期的原因、是否保持学习、对职业连续性的看法',
    });
  }

  return flags;
}

function detectSkillGaps(resume: Resume, jobPosition: JobPosition): ResumeRedFlag[] {
  const flags: ResumeRedFlag[] = [];
  const evidence: string[] = [];

  const resumeSkills = resume.skills.map(s => s.toLowerCase());
  const missingSkills = jobPosition.skills.filter(skill => {
    const skillLower = skill.toLowerCase();
    return !resumeSkills.some(rs => rs.includes(skillLower) || skillLower.includes(rs));
  });

  if (missingSkills.length > 0) {
    missingSkills.slice(0, 5).forEach(skill => {
      evidence.push(`职位要求「${skill}」但简历未提及`);
    });
    if (missingSkills.length > 5) {
      evidence.push(`...还有 ${missingSkills.length - 5} 项技能未覆盖`);
    }
    flags.push({
      id: `redflag-skillgap-${resume.id}`,
      type: 'skillGap',
      severity: missingSkills.length >= 4 ? 'high' : missingSkills.length >= 2 ? 'medium' : 'low',
      title: '关键技能存在缺口',
      description: `与目标职位相比，候选人缺少 ${missingSkills.length} 项关键技能，需要评估学习能力和技能迁移潜力。`,
      evidence,
      suggestion: '重点追问：对缺失技能的了解程度、学习计划、相关迁移经验',
    });
  }

  return flags;
}

function detectUnclearResponsibility(resume: Resume): ResumeRedFlag[] {
  const flags: ResumeRedFlag[] = [];
  const evidence: string[] = [];

  resume.experience.forEach((exp) => {
    if (!exp.description && exp.achievements.length === 0) {
      evidence.push(`【${exp.company}】${exp.position}，无职责描述和成就`);
    } else if (exp.achievements.length === 0) {
      evidence.push(`【${exp.company}】${exp.position}，缺少具体成就描述`);
    }
  });

  if (evidence.length > 0) {
    flags.push({
      id: `redflag-unclear-${resume.id}`,
      type: 'unclearResponsibility',
      severity: evidence.length >= 2 ? 'medium' : 'low',
      title: '职责和成就描述不清晰',
      description: `有 ${evidence.length} 段工作经历缺少具体的职责或成就描述，需要了解候选人的实际工作内容和产出。`,
      evidence,
      suggestion: '重点追问：具体职责范围、团队中的角色、代表性项目和产出',
    });
  }

  return flags;
}

function extractStrengths(resume: Resume): string[] {
  const strengths: string[] = [];

  const allAchievements = resume.experience.flatMap(e => e.achievements);
  const quantRegex = /\d+%|\d+倍|\d+人|\d+万|\d+\+|\d+个|\d+项/;
  const quantifiedCount = allAchievements.filter(a => quantRegex.test(a)).length;
  if (quantifiedCount >= 3) {
    strengths.push(`善于量化成果，有 ${quantifiedCount} 项可数据化的成就`);
  }

  const leaderKeywords = /主导|负责|带领|推动|建立|牵头|统筹/;
  const leaderCount = allAchievements.filter(a => leaderKeywords.test(a)).length;
  if (leaderCount >= 2) {
    strengths.push('具备领导力和项目主导经验');
  }

  if (resume.skills.length >= 8) {
    strengths.push(`技能覆盖面广，掌握 ${resume.skills.length} 项技能`);
  }

  const totalYears = resume.experience.reduce(
    (sum, exp) => sum + calculateYears(exp.startDate, exp.endDate),
    0
  );
  if (totalYears >= 5) {
    strengths.push(`拥有 ${totalYears.toFixed(1)} 年行业经验`);
  }

  const highestDegree = resume.education.reduce((highest, edu) => {
    const degreeOrder: Record<string, number> = { '博士': 4, '硕士': 3, '本科': 2, '大专': 1 };
    const order = degreeOrder[edu.degree] || 0;
    return order > highest ? order : highest;
  }, 0);
  if (highestDegree >= 3) {
    strengths.push('教育背景优秀');
  }

  if (resume.projects.length >= 2) {
    strengths.push(`项目经验丰富，参与过 ${resume.projects.length} 个项目`);
  }

  return strengths.length > 0 ? strengths : ['需要面试进一步了解优势'];
}

function analyzeSkillMatch(
  resume: Resume,
  jobPosition: JobPosition
): {
  score: number;
  details: SkillMatchDetail[];
} {
  const requiredSkills = jobPosition.skills;
  const resumeSkills = resume.skills.map(s => s.toLowerCase());

  const details: SkillMatchDetail[] = [];
  let matchedCount = 0;
  let partialCount = 0;

  requiredSkills.forEach(skill => {
    const skillLower = skill.toLowerCase();
    const found = resumeSkills.some(rs => rs.includes(skillLower) || skillLower.includes(rs));
    const exactMatch = resumeSkills.some(rs => rs === skillLower);

    let matchLevel: 'exact' | 'partial' | 'none' = 'none';
    if (exactMatch) {
      matchLevel = 'exact';
      matchedCount++;
    } else if (found) {
      matchLevel = 'partial';
      partialCount++;
    }

    details.push({
      skill,
      required: true,
      found: exactMatch || found,
      matchLevel,
    });
  });

  const bonusSkills = resume.skills.filter(skill => {
    const skillLower = skill.toLowerCase();
    return !requiredSkills.some(rs => rs.toLowerCase() === skillLower);
  });

  bonusSkills.forEach(skill => {
    details.push({
      skill,
      required: false,
      found: true,
      matchLevel: 'exact',
    });
  });

  const baseScore = requiredSkills.length > 0
    ? ((matchedCount * 100 + partialCount * 50) / (requiredSkills.length * 100)) * 100
    : 0;

  const bonusScore = Math.min(bonusSkills.length * 5, 15);

  const score = Math.round(Math.min(baseScore + bonusScore, 100));

  return {
    score,
    details,
  };
}

function analyzeExperienceRelevance(
  resume: Resume,
  jobPosition: JobPosition
): {
  score: number;
  details: ExperienceDetail[];
} {
  const details: ExperienceDetail[] = [];
  let totalYears = 0;
  let relevantYears = 0;

  const jobKeywords = extractKeywords(jobPosition.title + ' ' + jobPosition.responsibilities.join(' '));
  const jobLevel = jobPosition.level;

  resume.experience.forEach(exp => {
    const years = calculateYears(exp.startDate, exp.endDate);
    totalYears += years;

    const expText = `${exp.position} ${exp.description} ${exp.achievements.join(' ')}`;
    const expKeywords = extractKeywords(expText);

    const matchedKeywords = jobKeywords.filter(k =>
      expKeywords.includes(k)
    );

    let relevance: 'high' | 'medium' | 'low' = 'low';
    if (matchedKeywords.length >= 3) {
      relevance = 'high';
      relevantYears += years;
    } else if (matchedKeywords.length >= 1) {
      relevance = 'medium';
      relevantYears += years * 0.5;
    }

    details.push({
      relevance,
      description: `${exp.position} at ${exp.company}`,
      years,
    });
  });

  const yearsScore = calculateYearsScore(totalYears, jobLevel);
  const relevanceScore = totalYears > 0 ? (relevantYears / totalYears) * 100 : 0;

  const score = Math.round((yearsScore * 0.5 + relevanceScore * 0.5));

  return {
    score,
    details,
  };
}

function analyzePotential(
  resume: Resume,
  _jobPosition: JobPosition
): {
  score: number;
  details: PotentialDetail[];
} {
  const details: PotentialDetail[] = [];

  const educationScore = analyzeEducation(resume);
  details.push({
    factor: '教育背景',
    score: educationScore,
    evidence: resume.education.map(e => `${e.degree} · ${e.major}`).join('; '),
  });

  const achievementScore = analyzeAchievements(resume);
  details.push({
    factor: '成就导向',
    score: achievementScore,
    evidence: resume.experience.flatMap(e => e.achievements).slice(0, 3).join('; '),
  });

  const skillDepthScore = analyzeSkillDepth(resume);
  details.push({
    factor: '技能深度',
    score: skillDepthScore,
    evidence: `掌握 ${resume.skills.length} 项技能，覆盖 ${countSkillCategories(resume.skills)} 个领域`,
  });

  const careerProgressionScore = analyzeCareerProgression(resume);
  details.push({
    factor: '职业发展',
    score: careerProgressionScore,
    evidence: getCareerPath(resume),
  });

  const projectScore = analyzeProjectExperience(resume);
  details.push({
    factor: '项目经验',
    score: projectScore,
    evidence: `参与过 ${resume.projects.length} 个项目，其中主导 ${countLeadingProjects(resume)} 个`,
  });

  const learningScore = analyzeLearningAbility(resume);
  details.push({
    factor: '学习能力',
    score: learningScore,
    evidence: getLearningEvidence(resume),
  });

  const totalScore = Math.round(
    details.reduce((sum, d) => sum + d.score, 0) / details.length
  );

  return {
    score: totalScore,
    details,
  };
}

function extractKeywords(text: string): string[] {
  const keywords = text.toLowerCase()
    .replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length >= 2);
  return [...new Set(keywords)];
}

function calculateYears(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = end === '至今' || !end ? new Date() : new Date(end);
  const years = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
  return Math.max(0, Math.round(years * 10) / 10);
}

function calculateYearsScore(years: number, level: string): number {
  const levelRequirements: Record<string, number> = {
    entry: 1,
    junior: 3,
    mid: 5,
    senior: 7,
    lead: 10,
    manager: 12,
  };
  const required = levelRequirements[level] || 5;
  const ratio = years / required;
  if (ratio >= 1.5) return 100;
  if (ratio >= 1) return 90;
  if (ratio >= 0.8) return 75;
  if (ratio >= 0.6) return 60;
  if (ratio >= 0.4) return 45;
  if (ratio >= 0.2) return 30;
  return 15;
}

function analyzeEducation(resume: Resume): number {
  let score = 60;
  const highestDegree = resume.education.reduce((highest, edu) => {
    const degreeOrder: Record<string, number> = {
      '博士': 4,
      '硕士': 3,
      '本科': 2,
      '大专': 1,
    };
    const order = degreeOrder[edu.degree] || 0;
    return order > highest ? order : highest;
  }, 0);

  if (highestDegree >= 4) score = 100;
  else if (highestDegree >= 3) score = 90;
  else if (highestDegree >= 2) score = 80;
  else if (highestDegree >= 1) score = 60;

  const majorKeywords = ['计算机', '软件', '技术', '工程'];
  const hasRelevantMajor = resume.education.some(edu =>
    majorKeywords.some(k => edu.major.includes(k))
  );
  if (hasRelevantMajor) score = Math.min(score + 10, 100);

  return score;
}

function analyzeAchievements(resume: Resume): number {
  const allAchievements = resume.experience.flatMap(e => e.achievements);
  if (allAchievements.length === 0) return 50;

  let score = 60;

  const hasQuantified = allAchievements.some(a => /\d+%|\d+倍|\d+%|\d\+/.test(a));
  if (hasQuantified) score += 15;

  const hasLeading = allAchievements.some(a =>
    /主导|负责|带领|推动|建立/.test(a)
  );
  if (hasLeading) score += 15;

  const hasInnovation = allAchievements.some(a =>
    /创新|优化|提升|改进|重构|专利|论文/.test(a)
  );
  if (hasInnovation) score += 10;

  return Math.min(score, 100);
}

function analyzeSkillDepth(resume: Resume): number {
  const skillCount = resume.skills.length;
  if (skillCount === 0) return 50;

  let score = 60;

  const categories = countSkillCategories(resume.skills);
  if (categories >= 5) score += 20;
  else if (categories >= 4) score += 15;
  else if (categories >= 3) score += 10;

  const hasAdvancedSkills = resume.skills.some(s =>
    /架构|设计|优化|性能|微前端|低代码|工程化/.test(s)
  );
  if (hasAdvancedSkills) score += 15;

  return Math.min(score, 100);
}

function countSkillCategories(skills: string[]): number {
  const categories = new Set<string>();
  const categoryMap: Record<string, string[]> = {
    frontend: ['react', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css'],
    backend: ['node', 'java', 'python', 'go', 'spring', 'django'],
    database: ['mysql', 'mongodb', 'redis', 'postgresql', '数据库'],
    devops: ['docker', 'kubernetes', 'ci/cd', 'nginx', 'linux'],
    architecture: ['架构', '设计', '微服务', '微前端', '低代码'],
    tools: ['webpack', 'vite', 'git', 'rollup'],
  };

  skills.forEach(skill => {
    const skillLower = skill.toLowerCase();
    for (const [category, keywords] of Object.entries(categoryMap)) {
      if (keywords.some(k => skillLower.includes(k))) {
        categories.add(category);
      }
    }
  });

  return categories.size;
}

function analyzeCareerProgression(resume: Resume): number {
  if (resume.experience.length < 2) return 70;

  let score = 60;

  const positions = resume.experience.map(e => e.position);
  const hasProgression = positions.some(p =>
    /高级|资深|专家|主管|经理|负责人/.test(p)
  );
  if (hasProgression) score += 20;

  const avgTenure = resume.experience.reduce((sum, exp) => {
    return sum + calculateYears(exp.startDate, exp.endDate);
  }, 0) / resume.experience.length;

  if (avgTenure >= 2) score += 10;
  else if (avgTenure >= 1) score += 5;

  return Math.min(score, 100);
}

function getCareerPath(resume: Resume): string {
  return resume.experience.map(e => e.position).join(' → ');
}

function analyzeProjectExperience(resume: Resume): number {
  if (resume.projects.length === 0) return 50;

  let score = 60;

  const leadingCount = countLeadingProjects(resume);
  if (leadingCount >= 2) score += 25;
  else if (leadingCount >= 1) score += 15;

  const hasComplexProject = resume.projects.some(p =>
    /重构|架构|平台|系统/.test(p.name) ||
    p.technologies.length >= 4
  );
  if (hasComplexProject) score += 15;

  return Math.min(score, 100);
}

function countLeadingProjects(resume: Resume): number {
  return resume.projects.filter(p =>
    /负责人|主导|技术负责人|核心开发|技术leader/.test(p.role)
  ).length;
}

function analyzeLearningAbility(resume: Resume): number {
  let score = 70;

  const hasCertification = resume.skills.some(s =>
    /认证|证书|AWS|PMP|CPA/.test(s)
  );
  if (hasCertification) score += 15;

  const hasOpenSource = resume.rawContent.includes('开源') ||
    resume.projects.some(p => p.technologies.some(t =>
      /开源|github|gitlab/.test(t.toLowerCase())
    ));
  if (hasOpenSource) score += 15;

  return Math.min(score, 100);
}

function getLearningEvidence(resume: Resume): string {
  const evidence: string[] = [];
  if (resume.education.length > 0) {
    evidence.push(`最高学历 ${resume.education[0].degree}`);
  }
  if (resume.skills.some(s => /学习|研究|论文|认证/.test(s))) {
    evidence.push('持续学习新技术');
  }
  return evidence.join('，') || '教育背景良好';
}

export function parseResumeText(text: string): Partial<Resume> {
  const lines = text.split('\n').filter(l => l.trim());

  const nameMatch = text.match(/^[\u4e00-\u9fa5]{2,4}/m);
  const name = nameMatch ? nameMatch[0] : '未知候选人';

  const education: Resume['education'] = [];
  const experience: Resume['experience'] = [];
  const skills: string[] = [];
  const projects: Resume['projects'] = [];

  const skillKeywords = ['熟练掌握|精通|熟悉|了解|具备'];
  lines.forEach(line => {
    skillKeywords.forEach(kw => {
      if (line.includes(kw)) {
        const skillPart = line.replace(/^.*?[：:]/, '').trim();
        const foundSkills = skillPart.split(/[,，、;；]/).map(s => s.trim()).filter(s => s);
        skills.push(...foundSkills);
      }
    });
  });

  return {
    id: `resume-${Date.now()}`,
    name,
    education,
    experience,
    skills: [...new Set(skills)],
    projects,
    rawContent: text,
    maskedContent: '',
  };
}
