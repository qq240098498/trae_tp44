import type {
  InterviewQuestion,
  JobPosition,
  Resume,
  ResumeAnalysisResult,
  ResumeRedFlag,
  QuestionCategory,
} from '../../shared/types';
import { professionalQuestions, softSkillQuestions, culturalFitQuestions, basicInfoQuestions as basicInfoQuestionsData } from '../data/mockData';

export function generateInterviewQuestions(
  jobPosition: JobPosition,
  resume?: Resume,
  resumeAnalysis?: ResumeAnalysisResult
): InterviewQuestion[] {
  const questions: Omit<InterviewQuestion, 'id'>[] = [];

  const basicInfo = generateBasicInfoQuestions(jobPosition, resume);
  const professional = generateProfessionalQuestions(jobPosition, resume);
  const softSkills = generateSoftSkillQuestions(jobPosition, resume);
  const culturalFit = generateCulturalFitQuestions(jobPosition, resume);
  const followUps = resumeAnalysis ? generateFollowUpQuestions(resumeAnalysis, resume) : [];

  questions.push(...basicInfo, ...professional, ...softSkills, ...culturalFit, ...followUps);

  return questions.map((q, index) => ({
    ...q,
    id: `q-${Date.now()}-${index}`,
    priority: q.priority ?? index,
  })).sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
}

export function generateBasicInfoQuestions(
  jobPosition: JobPosition,
  resume?: Resume
): Omit<InterviewQuestion, 'id'>[] {
  const questions: Omit<InterviewQuestion, 'id'>[] = [];

  questions.push({
    category: 'basicInfo',
    question: '请做一个简单的自我介绍，包括你的教育背景、工作经历和核心优势。',
    expectedPoints: [
      '介绍有条理，重点突出',
      '经历与目标职位相关',
      '能够清晰表达自己的核心优势',
      '时间控制在2-3分钟',
    ],
    difficulty: 'easy',
    source: 'base',
    priority: 0,
  });

  if (resume && resume.experience.length > 0) {
    const latestExp = resume.experience[0];
    questions.push({
      category: 'basicInfo',
      question: `请介绍一下你在${latestExp.company || '最近一家公司'}的主要工作内容和职责。`,
      expectedPoints: [
        '能够清晰描述岗位职责范围',
        '说明在团队中的角色定位',
        '提及代表性工作或项目',
        '体现与目标职位的相关性',
      ],
      difficulty: 'easy',
      source: 'resume',
      priority: 1,
    });
  }

  questions.push({
    category: 'basicInfo',
    question: `你为什么对我们公司的「${jobPosition.title}」这个职位感兴趣？`,
    expectedPoints: [
      '对公司和职位有一定了解',
      '个人职业规划与职位匹配',
      '能够说出具体的吸引点',
      '表达真实且有说服力',
    ],
    difficulty: 'easy',
    source: 'jd',
    priority: 2,
  });

  questions.push({
    category: 'basicInfo',
    question: '请分享一个你最有成就感的项目或工作经历，你在其中扮演了什么角色？',
    expectedPoints: [
      '有具体的项目案例',
      '清晰说明自己的贡献和角色',
      '体现问题解决能力',
      '有可量化的成果更佳',
    ],
    difficulty: 'medium',
    source: 'base',
    priority: 3,
  });

  const additionalQuestions = basicInfoQuestionsData.filter((_, i) => i < 2);
  additionalQuestions.forEach((q, i) => {
    questions.push({ ...q, priority: 10 + i });
  });

  return questions;
}

export function generateFollowUpQuestions(
  resumeAnalysis: ResumeAnalysisResult,
  resume?: Resume
): Omit<InterviewQuestion, 'id'>[] {
  const questions: Omit<InterviewQuestion, 'id'>[] = [];
  let priority = 50;

  resumeAnalysis.redFlags.forEach((redFlag) => {
    const redFlagQuestions = generateQuestionsForRedFlag(redFlag, resume);
    redFlagQuestions.forEach((q) => {
      questions.push({
        ...q,
        source: 'redFlag',
        relatedRedFlagId: redFlag.id,
        priority: priority++,
      });
    });
  });

  return questions;
}

function generateQuestionsForRedFlag(
  redFlag: ResumeRedFlag,
  resume?: Resume
): Omit<InterviewQuestion, 'id'>[] {
  const questions: Omit<InterviewQuestion, 'id'>[] = [];

  switch (redFlag.type) {
    case 'noQuantifiedAchievement':
      questions.push(...generateNoQuantifiedQuestions(redFlag, resume));
      break;
    case 'frequentJobChange':
      questions.push(...generateFrequentJobChangeQuestions(redFlag, resume));
      break;
    case 'skillGap':
      questions.push(...generateSkillGapQuestions(redFlag, resume));
      break;
    case 'careerGap':
      questions.push(...generateCareerGapQuestions(redFlag, resume));
      break;
    case 'unclearResponsibility':
      questions.push(...generateUnclearResponsibilityQuestions(redFlag, resume));
      break;
    default:
      break;
  }

  return questions;
}

function generateNoQuantifiedQuestions(
  redFlag: ResumeRedFlag,
  _resume?: Resume
): Omit<InterviewQuestion, 'id'>[] {
  const questions: Omit<InterviewQuestion, 'id'>[] = [];

  questions.push({
    category: 'followUp',
    question: '你在简历中提到主导了多个项目，能否具体举一个例子，说明项目规模（如团队人数、预算、时间周期）和你取得的具体成果数据？',
    expectedPoints: [
      '能够提供具体的数据指标（如提升百分比、用户量、收入等）',
      '清晰说明项目背景和目标',
      '明确自己的具体贡献和决策',
      '量化成果与个人贡献有直接关联',
    ],
    difficulty: redFlag.severity === 'high' ? 'hard' : 'medium',
  });

  questions.push({
    category: 'followUp',
    question: '在你提到的"主导/负责"的工作中，你是如何定义成功的？有哪些关键指标（KPI）来衡量你的工作成果？',
    expectedPoints: [
      '对"成功"有清晰的定义',
      '能够列举具体的业务指标',
      '体现结果导向思维',
      '指标设定合理且可衡量',
    ],
    difficulty: 'medium',
  });

  if (redFlag.evidence.length > 0) {
    const firstEvidence = redFlag.evidence[0];
    questions.push({
      category: 'followUp',
      question: `关于你提到的"${firstEvidence.substring(0, 30)}..."，能否补充具体的数据支撑？比如涉及的规模、提升的比例、节省的成本等？`,
      expectedPoints: [
        '能够补充具体的数据',
        '数据来源可靠',
        '个人贡献清晰可追溯',
        '数据具有说服力',
      ],
      difficulty: 'medium',
    });
  }

  return questions;
}

function generateFrequentJobChangeQuestions(
  redFlag: ResumeRedFlag,
  _resume?: Resume
): Omit<InterviewQuestion, 'id'>[] {
  const questions: Omit<InterviewQuestion, 'id'>[] = [];

  questions.push({
    category: 'followUp',
    question: '我注意到你在过去几年中有多段工作经历，能否分享一下每次离职的主要原因是什么？',
    expectedPoints: [
      '离职原因真实可信',
      '能够客观分析原因',
      '不抱怨前公司或同事',
      '展现成熟的职业态度',
    ],
    difficulty: redFlag.severity === 'high' ? 'hard' : 'medium',
  });

  questions.push({
    category: 'followUp',
    question: '你对自己未来3-5年的职业规划是怎样的？在选择下一份工作时，你最看重哪些因素？',
    expectedPoints: [
      '有清晰的职业发展目标',
      '目标与当前职位匹配度高',
      '选择因素合理且务实',
      '体现对稳定性的重视',
    ],
    difficulty: 'medium',
  });

  questions.push({
    category: 'followUp',
    question: '你认为一份理想的工作，你通常会希望任职多长时间？在什么情况下你会考虑离开？',
    expectedPoints: [
      '对工作稳定性有合理预期',
      '离职触发点合理',
      '体现对职业发展的深思熟虑',
      '与公司文化和期望一致',
    ],
    difficulty: 'medium',
  });

  return questions;
}

function generateSkillGapQuestions(
  redFlag: ResumeRedFlag,
  _resume?: Resume
): Omit<InterviewQuestion, 'id'>[] {
  const questions: Omit<InterviewQuestion, 'id'>[] = [];

  const missingSkillsText = redFlag.evidence
    .map(e => e.replace(/职位要求「|」但简历未提及/g, ''))
    .slice(0, 3)
    .join('、');

  if (missingSkillsText) {
    questions.push({
      category: 'followUp',
      question: `我们的工作需要用到${missingSkillsText}等技术，你对这些技术的了解程度如何？是否有相关的学习计划或类似技术的迁移经验？`,
      expectedPoints: [
        '对缺失技能有基本认知',
        '体现快速学习能力',
        '有明确的学习计划或思路',
        '能够举一反三，迁移已有经验',
      ],
      difficulty: redFlag.severity === 'high' ? 'hard' : 'medium',
    });
  }

  questions.push({
    category: 'followUp',
    question: '当工作中遇到你不熟悉的技术领域时，你通常会如何快速上手？能否分享一个具体的例子？',
    expectedPoints: [
      '有系统的学习方法',
      '能够利用资源快速学习',
      '有具体的学习案例支撑',
      '体现主动学习和解决问题的能力',
    ],
    difficulty: 'medium',
  });

  return questions;
}

function generateCareerGapQuestions(
  _redFlag: ResumeRedFlag,
  _resume?: Resume
): Omit<InterviewQuestion, 'id'>[] {
  const questions: Omit<InterviewQuestion, 'id'>[] = [];

  questions.push({
    category: 'followUp',
    question: '我注意到你的简历中有一段职业空窗期，能否分享一下这段时间你在做什么？',
    expectedPoints: [
      '空窗期原因真实可信',
      '保持学习或自我提升',
      '有明确的时间规划',
      '展现积极的生活态度',
    ],
    difficulty: 'medium',
  });

  questions.push({
    category: 'followUp',
    question: '在空窗期间，你是如何保持与行业的联系和自身竞争力的？',
    expectedPoints: [
      '有持续学习的行动',
      '关注行业动态和趋势',
      '参与社区活动或项目',
      '保持技术敏感度',
    ],
    difficulty: 'medium',
  });

  return questions;
}

function generateUnclearResponsibilityQuestions(
  _redFlag: ResumeRedFlag,
  _resume?: Resume
): Omit<InterviewQuestion, 'id'>[] {
  const questions: Omit<InterviewQuestion, 'id'>[] = [];

  questions.push({
    category: 'followUp',
    question: '你简历中有几段经历描述比较简洁，能否选择其中一段，详细介绍一下你的具体职责和日常工作内容？',
    expectedPoints: [
      '能够详细描述工作职责',
      '说明在团队中的定位和汇报关系',
      '列举代表性的工作任务',
      '体现工作的价值和影响',
    ],
    difficulty: 'medium',
  });

  questions.push({
    category: 'followUp',
    question: '在这些经历中，你认为最能体现你能力的一件事是什么？你具体做了什么？',
    expectedPoints: [
      '有具体的案例',
      '清晰说明自己的行动',
      '体现核心能力和价值',
      '有可衡量的成果',
    ],
    difficulty: 'medium',
  });

  return questions;
}

function generateProfessionalQuestions(
  jobPosition: JobPosition,
  resume?: Resume
): Omit<InterviewQuestion, 'id'>[] {
  const questions: Omit<InterviewQuestion, 'id'>[] = [];
  const jobSkills = jobPosition.skills;
  const resumeSkills = resume?.skills || [];

  const matchedSkills = jobSkills.filter(skill =>
    resumeSkills.some(rs => rs.toLowerCase().includes(skill.toLowerCase()))
  );
  const missingSkills = jobSkills.filter(skill =>
    !resumeSkills.some(rs => rs.toLowerCase().includes(skill.toLowerCase()))
  );

  if (matchedSkills.length > 0) {
    matchedSkills.slice(0, 3).forEach((skill, i) => {
      questions.push({
        category: 'professional',
        question: `请分享你在${skill}方面的实践经验，包括遇到的挑战和解决方案。`,
        expectedPoints: [
          `能够清晰描述${skill}的应用场景`,
          '有具体的项目案例支撑',
          '能够深入讲解技术细节',
          '体现问题解决能力',
        ],
        difficulty: 'medium',
        source: 'jd',
        priority: 10 + i,
      });
    });
  }

  if (missingSkills.length > 0) {
    questions.push({
      category: 'professional',
      question: `我们的工作需要用到${missingSkills.slice(0, 3).join('、')}等技术，你是否有相关的学习计划或迁移经验？`,
      expectedPoints: [
        '体现快速学习能力',
        '有明确的学习计划',
        '能够举一反三，迁移已有经验',
        '对新技术保持热情',
      ],
      difficulty: 'medium',
      source: 'jd',
      priority: 15,
    });
  }

  const additionalQuestions = professionalQuestions.filter((_, i) => i < 3);
  additionalQuestions.forEach((q, i) => {
    questions.push({ ...q, source: 'base' as const, priority: 20 + i });
  });

  return questions.slice(0, 5);
}

function generateSoftSkillQuestions(
  jobPosition: JobPosition,
  resume?: Resume
): Omit<InterviewQuestion, 'id'>[] {
  const questions: Omit<InterviewQuestion, 'id'>[] = [];
  const level = jobPosition.level;

  if (['senior', 'lead', 'manager'].includes(level)) {
    questions.push({
      category: 'softSkill',
      question: '请描述一次你带领团队攻克技术难题的经历，你是如何协调资源和激励团队的？',
      expectedPoints: [
        '展现领导力和团队管理能力',
        '能够清晰描述问题解决过程',
        '体现跨部门沟通协调能力',
        '有具体的成果和数据支撑',
      ],
      difficulty: 'hard',
      source: 'jd',
      priority: 30,
    });

    questions.push({
      category: 'softSkill',
      question: '在技术决策中，当你的方案与团队成员有分歧时，你会如何处理？请举例说明。',
      expectedPoints: [
        '展现成熟的沟通技巧',
        '能够站在对方角度思考',
        '有说服力的表达能力',
        '最终达成共识的方法',
      ],
      difficulty: 'hard',
      source: 'jd',
      priority: 31,
    });
  }

  if (resume?.experience.length && resume.experience.length >= 2) {
    questions.push({
      category: 'softSkill',
      question: '在你过往的职业经历中，最让你有挫败感的一件事是什么？你从中学到了什么？',
      expectedPoints: [
        '体现自我反思能力',
        '能够正视失败和挫折',
        '有具体的成长和改变',
        '展现坚韧不拔的品质',
      ],
      difficulty: 'medium',
      source: 'resume',
      priority: 32,
    });
  }

  const additionalQuestions = softSkillQuestions.filter((_, i) => i < 3);
  additionalQuestions.forEach((q, i) => {
    questions.push({ ...q, source: 'base' as const, priority: 35 + i });
  });

  return questions.slice(0, 4);
}

function generateCulturalFitQuestions(
  _jobPosition: JobPosition,
  _resume?: Resume
): Omit<InterviewQuestion, 'id'>[] {
  const questions: Omit<InterviewQuestion, 'id'>[] = [];

  questions.push({
    category: 'culturalFit',
    question: '你选择下一份工作时，最看重的三个因素是什么？为什么？',
    expectedPoints: [
      '价值观与公司文化是否匹配',
      '对职业发展有清晰规划',
      '能够真实表达自己的诉求',
      '展现对工作的热情和投入',
    ],
    difficulty: 'easy',
    source: 'base',
    priority: 40,
  });

  questions.push({
    category: 'culturalFit',
    question: '请描述你理想中的团队协作方式，以及你在团队中通常扮演的角色。',
    expectedPoints: [
      '了解自己的优势和定位',
      '团队协作意识强',
      '能够适应不同的工作风格',
      '展现积极主动的工作态度',
    ],
    difficulty: 'medium',
    source: 'base',
    priority: 41,
  });

  const additionalQuestions = culturalFitQuestions.filter((_, i) => i < 2);
  additionalQuestions.forEach((q, i) => {
    questions.push({ ...q, source: 'base' as const, priority: 45 + i });
  });

  return questions.slice(0, 3);
}

export function getQuestionByCategory(
  questions: InterviewQuestion[],
  category: QuestionCategory
): InterviewQuestion[] {
  return questions.filter(q => q.category === category);
}

export function getDifficultyLabel(difficulty: string): string {
  const labels: Record<string, string> = {
    easy: '简单',
    medium: '中等',
    hard: '困难',
  };
  return labels[difficulty] || difficulty;
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    professional: '专业能力',
    softSkill: '软技能',
    culturalFit: '文化适配',
    basicInfo: '基础信息',
    followUp: '针对性追问',
  };
  return labels[category] || category;
}

export function getSourceLabel(source?: string): string {
  const labels: Record<string, string> = {
    base: '基础题库',
    jd: '职位匹配',
    resume: '简历匹配',
    redFlag: '疑点追问',
  };
  return source ? (labels[source] || source) : '综合';
}

export function getRedFlagTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    noQuantifiedAchievement: '成就未量化',
    frequentJobChange: '频繁跳槽',
    skillGap: '技能缺口',
    careerGap: '职业空窗',
    unclearResponsibility: '职责不清',
    overqualified: '资历过高',
    underqualified: '资历不足',
  };
  return labels[type] || type;
}

export function getSeverityLabel(severity: string): string {
  const labels: Record<string, string> = {
    high: '高风险',
    medium: '中风险',
    low: '低风险',
  };
  return labels[severity] || severity;
}

export function evaluateAnswer(
  question: InterviewQuestion,
  answer: string
): {
  score: number;
  feedback: string[];
  coveredPoints: string[];
  missingPoints: string[];
} {
  const feedback: string[] = [];
  const coveredPoints: string[] = [];
  const missingPoints: string[] = [];

  const answerLower = answer.toLowerCase();

  question.expectedPoints.forEach(point => {
    const pointLower = point.toLowerCase();
    const keywords = pointLower.split(/[，,。.\s]+/).filter(k => k.length >= 2);
    const matchedKeywords = keywords.filter(k => answerLower.includes(k));

    if (matchedKeywords.length >= keywords.length * 0.5) {
      coveredPoints.push(point);
    } else {
      missingPoints.push(point);
    }
  });

  const baseScore = question.expectedPoints.length > 0
    ? (coveredPoints.length / question.expectedPoints.length) * 100
    : 60;

  const lengthBonus = answer.length > 200 ? 5 : 0;
  const structureBonus = /第一|第二|第三|首先|其次|最后|1\.|2\.|3\./.test(answer) ? 5 : 0;

  const score = Math.round(Math.min(baseScore + lengthBonus + structureBonus, 100));

  if (score >= 80) {
    feedback.push('回答全面，逻辑清晰，表现优秀');
  } else if (score >= 60) {
    feedback.push('回答基本完整，但部分要点可以更深入');
  } else {
    feedback.push('回答较为简略，建议补充更多细节和案例');
  }

  if (missingPoints.length > 0) {
    feedback.push(`可以进一步阐述：${missingPoints.join('；')}`);
  }

  return {
    score,
    feedback,
    coveredPoints,
    missingPoints,
  };
}

export function getBasicInfoQuestionBank(): Omit<InterviewQuestion, 'id'>[] {
  return [
    {
      category: 'basicInfo',
      question: '请做一个简单的自我介绍，包括你的教育背景、工作经历和核心优势。',
      expectedPoints: [
        '介绍有条理，重点突出',
        '经历与目标职位相关',
        '能够清晰表达自己的核心优势',
        '时间控制在2-3分钟',
      ],
      difficulty: 'easy',
      source: 'base',
    },
    {
      category: 'basicInfo',
      question: '你为什么选择我们公司？对我们公司有哪些了解？',
      expectedPoints: [
        '对公司业务和文化有了解',
        '能够说出具体的吸引点',
        '个人目标与公司发展匹配',
        '表达真诚且有说服力',
      ],
      difficulty: 'easy',
      source: 'base',
    },
    {
      category: 'basicInfo',
      question: '你认为自己最大的优点和缺点分别是什么？请举例说明。',
      expectedPoints: [
        '优点真实且与岗位相关',
        '缺点坦诚且有改进意识',
        '有具体案例支撑',
        '体现自我认知能力',
      ],
      difficulty: 'medium',
      source: 'base',
    },
    {
      category: 'basicInfo',
      question: '请描述你理想中的工作环境和团队氛围。',
      expectedPoints: [
        '有清晰的期望和偏好',
        '与公司文化相匹配',
        '体现协作意识',
        '展现积极的工作态度',
      ],
      difficulty: 'easy',
      source: 'base',
    },
    {
      category: 'basicInfo',
      question: '你对薪资有什么期望？除了薪资，你还看重哪些福利？',
      expectedPoints: [
        '期望合理且有依据',
        '了解市场行情',
        '综合考虑多重因素',
        '沟通方式成熟',
      ],
      difficulty: 'medium',
      source: 'base',
    },
    {
      category: 'basicInfo',
      question: '你什么时候可以到岗？如果加入我们，你在前三个月希望达成什么目标？',
      expectedPoints: [
        '到岗时间合理',
        '有明确的短期目标',
        '目标具体可衡量',
        '体现积极主动的态度',
      ],
      difficulty: 'easy',
      source: 'base',
    },
    ...basicInfoQuestionsData,
  ];
}
