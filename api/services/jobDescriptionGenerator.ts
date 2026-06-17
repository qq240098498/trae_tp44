import type { JobDescriptionForm, JobPosition } from '../../shared/types';
import { validateJobDescriptionForBias } from './biasDetection';

const levelDescriptions: Record<string, string> = {
  entry: '应届毕业生或1年以内工作经验',
  junior: '1-3年工作经验，能够独立完成基础开发任务',
  mid: '3-5年工作经验，能够独立负责模块开发',
  senior: '5年以上工作经验，能够主导项目架构设计',
  lead: '8年以上工作经验，能够带领技术团队',
  manager: '10年以上工作经验，负责技术团队管理和战略规划',
};

const jobTemplates: Record<string, string[]> = {
  技术部: [
    '参与产品需求分析和技术方案设计',
    '负责核心功能模块的开发和维护',
    '进行代码审查，保证代码质量',
    '持续优化系统性能，提升用户体验',
    '参与技术选型和架构升级',
    '编写技术文档和开发规范',
    '指导初级开发人员成长',
  ],
  产品部: [
    '负责产品规划和需求分析',
    '撰写产品需求文档（PRD）',
    '协调设计、开发、测试团队完成产品迭代',
    '进行数据分析，持续优化产品体验',
    '跟踪竞品动态，提出产品创新方案',
    '参与产品战略规划',
  ],
  设计部: [
    '负责产品的视觉设计和交互设计',
    '制定设计规范和组件库',
    '参与用户研究和可用性测试',
    '与产品、开发团队紧密协作',
    '持续优化设计方案，提升用户体验',
    '跟踪设计趋势，保持设计创新性',
  ],
  市场部: [
    '制定市场营销策略和推广计划',
    '负责品牌建设和市场推广活动',
    '进行市场调研和竞品分析',
    '管理营销预算，评估营销效果',
    '拓展合作渠道，建立合作伙伴关系',
    '参与产品定位和定价策略',
  ],
  运营部: [
    '负责产品日常运营和用户增长',
    '制定运营策略和活动方案',
    '进行数据分析，优化运营效率',
    '管理用户社群，提升用户活跃度',
    '协调各方资源，推动运营目标达成',
    '建立运营数据体系和报表机制',
  ],
  人事部: [
    '负责招聘、培训、绩效、薪酬等人力资源管理工作',
    '制定和优化人力资源管理制度',
    '推动企业文化建设和员工关怀',
    '进行人才盘点和梯队建设',
    '处理员工关系和劳动争议',
    '参与公司战略规划，提供人力资源支持',
  ],
  财务部: [
    '负责财务核算、报表编制和财务分析',
    '制定和优化财务管理制度',
    '进行预算编制和成本控制',
    '负责税务筹划和税务申报',
    '管理资金运作和现金流',
    '参与公司战略决策，提供财务分析支持',
  ],
};

const requirementTemplates: Record<string, string[]> = {
  技术部: [
    '本科及以上学历，计算机相关专业优先',
    '扎实的计算机基础知识，熟悉数据结构和算法',
    '具备良好的代码规范和文档习惯',
    '具备良好的沟通能力和团队协作精神',
    '有较强的学习能力和问题解决能力',
    '对技术有热情，持续关注技术发展趋势',
  ],
  产品部: [
    '本科及以上学历',
    '具备良好的产品思维和用户体验意识',
    '具备优秀的沟通协调能力和项目管理能力',
    '熟练使用Axure、Figma、XMind等产品工具',
    '具备数据分析能力，能够数据驱动决策',
    '有较强的学习能力和抗压能力',
  ],
  设计部: [
    '本科及以上学历，设计相关专业优先',
    '具备优秀的审美能力和创意思维',
    '熟练使用Figma、Sketch、PS、AI等设计工具',
    '了解前端开发知识，能够与开发团队高效协作',
    '具备良好的沟通能力和理解能力',
    '有完整的作品集或项目案例',
  ],
  市场部: [
    '本科及以上学历，市场营销相关专业优先',
    '具备敏锐的市场洞察力和创新思维',
    '具备优秀的文案撰写能力和创意策划能力',
    '熟悉各种数字营销渠道和工具',
    '具备数据分析能力，能够评估营销效果',
    '具备良好的沟通能力和团队协作精神',
  ],
  运营部: [
    '本科及以上学历',
    '具备良好的数据敏感度和分析能力',
    '具备优秀的活动策划能力和执行力',
    '熟悉主流互联网产品和运营方法',
    '具备良好的沟通能力和跨部门协调能力',
    '有较强的学习能力和抗压能力',
  ],
  人事部: [
    '本科及以上学历，人力资源相关专业优先',
    '熟悉国家劳动法律法规和人力资源管理流程',
    '具备优秀的沟通能力和人际交往能力',
    '具备较强的执行力和问题解决能力',
    '具备良好的职业操守和保密意识',
    '熟练使用Office办公软件和人力资源管理系统',
  ],
  财务部: [
    '本科及以上学历，财务、会计相关专业',
    '持有会计从业资格证书，CPA/CMA等证书优先',
    '熟悉国家财经法规和税收政策',
    '熟练使用财务软件和Office办公软件',
    '具备良好的数据分析能力和逻辑思维能力',
    '具备良好的职业操守和保密意识',
  ],
};

export function generateJobDescription(form: JobDescriptionForm): {
  jobPosition: JobPosition;
  biasValidation: { isValid: boolean; warnings: string[] };
} {
  const department = form.department || '技术部';
  const levelText = levelDescriptions[form.level] || '';
  
  const responsibilities = [
    ...(form.responsibilities ? form.responsibilities.split('\n').filter(r => r.trim()) : []),
    ...(jobTemplates[department] || []),
  ].filter((v, i, a) => a.indexOf(v) === i);

  const requirements = [
    ...(form.requirements ? form.requirements.split('\n').filter(r => r.trim()) : []),
    levelText,
    ...(requirementTemplates[department] || []),
  ].filter((v, i, a) => a.indexOf(v) === i).filter(r => r.trim());

  const skills = form.skills
    ? form.skills.split(/[,，、]/).map(s => s.trim()).filter(s => s)
    : [];

  const description = buildDescriptionText(form, responsibilities, requirements, skills);
  const biasValidation = validateJobDescriptionForBias(description);

  const jobPosition: JobPosition = {
    id: `job-${Date.now()}`,
    title: form.title,
    department: form.department,
    level: form.level,
    responsibilities,
    requirements,
    skills,
    generatedDescription: description,
    createdAt: new Date(),
  };

  return {
    jobPosition,
    biasValidation,
  };
}

function buildDescriptionText(
  form: JobDescriptionForm,
  responsibilities: string[],
  requirements: string[],
  skills: string[]
): string {
  const levelText: Record<string, string> = {
    entry: '初级',
    junior: '初级',
    mid: '中级',
    senior: '高级',
    lead: '技术专家',
    manager: '技术经理',
  };

  const level = levelText[form.level] || '';

  let description = `# ${form.title}

## 职位概述

${form.department}${level ? ' · ' + level : ''}${form.industry ? ' · ' + form.industry + '行业' : ''}

我们正在寻找一位优秀的${form.title}加入我们的${form.department}。在这个岗位上，您将负责核心业务的开发与优化，与优秀的团队成员共同推动产品的持续创新。

## 核心职责
`;

  responsibilities.forEach((resp, index) => {
    description += `\n${index + 1}. ${resp}`;
  });

  description += `

## 任职要求
`;

  requirements.forEach((req, index) => {
    description += `\n${index + 1}. ${req}`;
  });

  if (skills.length > 0) {
    description += `

## 技术栈

${skills.join('、')}
`;
  }

  if (form.teamSize || form.location || form.salaryRange) {
    description += `
## 其他信息
`;
    if (form.teamSize) {
      description += `\n- 团队规模：${form.teamSize}`;
    }
    if (form.location) {
      description += `\n- 工作地点：${form.location}`;
    }
    if (form.salaryRange) {
      description += `\n- 薪资范围：${form.salaryRange}`;
    }
  }

  description += `

---

*我们是一个平等机会雇主，致力于营造多元和包容的工作环境。所有合格的申请者都将获得雇佣考虑，不会因为种族、肤色、宗教、性别、性取向、性别认同、国籍、遗传信息、年龄、残疾或退伍军人身份而受到歧视。*
`;

  return description;
}

export function optimizeJobDescription(description: string): {
  optimized: string;
  suggestions: string[];
} {
  const suggestions: string[] = [];
  let optimized = description;

  if (description.length < 500) {
    suggestions.push('职位描述内容较少，建议补充更多关于团队、项目和成长机会的信息');
  }

  if (!description.includes('职责') && !description.includes('responsibilities')) {
    suggestions.push('建议明确列出核心职责，让候选人更清楚工作内容');
  }

  if (!description.includes('要求') && !description.includes('requirements')) {
    suggestions.push('建议明确列出任职要求，帮助候选人自我评估');
  }

  if (!description.includes('平等') && !description.includes('equal') && !description.includes('机会')) {
    suggestions.push('建议添加平等机会声明，展示公司的包容性文化');
  }

  const actionWords = ['负责', '主导', '设计', '开发', '优化', '推动', '建立', '提升', '实现', '创新'];
  const foundActionWords = actionWords.filter(word => description.includes(word));
  if (foundActionWords.length < 3) {
    suggestions.push('建议使用更多积极的行动动词来描述职责，如"主导"、"推动"、"创新"等');
  }

  const biasValidation = validateJobDescriptionForBias(description);
  if (!biasValidation.isValid) {
    suggestions.push(...biasValidation.warnings);
  }

  return {
    optimized,
    suggestions,
  };
}
