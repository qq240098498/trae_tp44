import type { JobPosition, Resume, HighPerformerProfile, InterviewQuestion, Employee, AttritionRiskAssessment } from '../../shared/types';

export const mockJobPositions: JobPosition[] = [
  {
    id: 'job-001',
    title: '高级前端工程师',
    department: '技术部',
    level: 'senior',
    responsibilities: [
      '负责公司核心产品的前端架构设计与开发',
      '带领前端团队完成项目交付',
      '制定前端技术规范和最佳实践',
      '优化前端性能，提升用户体验'
    ],
    requirements: [
      '本科及以上学历，计算机相关专业',
      '5年以上前端开发经验',
      '精通 React、Vue 等主流前端框架',
      '熟悉 Node.js、Webpack 等工具链'
    ],
    skills: ['React', 'TypeScript', 'Vue', 'Node.js', 'Webpack', '性能优化', '架构设计'],
    generatedDescription: '',
    createdAt: new Date('2026-01-15')
  }
];

export const mockResumes: Resume[] = [
  {
    id: 'resume-001',
    name: '候选人A',
    education: [
      {
        school: '某知名大学',
        degree: '硕士',
        major: '计算机科学与技术',
        startDate: '2016-09',
        endDate: '2019-06'
      }
    ],
    experience: [
      {
        company: '某互联网公司',
        position: '高级前端工程师',
        startDate: '2019-07',
        endDate: '2022-12',
        description: '负责公司电商平台的前端开发工作',
        achievements: [
          '主导完成了首页性能优化，首屏加载时间减少60%',
          '设计并实现了组件库，提高团队开发效率40%',
          '带领3人小组完成了多个重要项目的交付',
          '跨团队协作推动产品功能迭代，协调5个部门完成大促活动'
        ]
      },
      {
        company: '某科技公司',
        position: '前端工程师',
        startDate: '2023-01',
        endDate: '至今',
        description: '负责公司SaaS平台的前端架构与开发',
        achievements: [
          '重构了前端架构，引入了微前端方案',
          '优化了构建流程，构建时间减少70%'
        ]
      }
    ],
    projects: [
      {
        name: '电商平台重构',
        role: '技术负责人',
        description: '公司核心电商平台的前后端重构项目',
        technologies: ['React', 'TypeScript', 'Node.js', 'Webpack'],
        achievements: ['性能提升60%']
      }
    ],
    skills: ['React', 'TypeScript', 'Vue', 'Node.js', 'Webpack', 'Vite', '性能优化', '微前端', '架构设计', '团队管理'],
    rawContent: `候选人A，硕士学历，计算机专业，7年前端开发经验，精通React等前端技术，有丰富的团队管理经验。主导过多个跨团队协作项目，在性能优化和架构设计方面有深入研究。`,
    maskedContent: `候选人A，硕士学历，计算机专业，7年前端开发经验，精通React等前端技术，有丰富的团队管理经验。主导过多个跨团队协作项目，在性能优化和架构设计方面有深入研究。`
  },
  {
    id: 'resume-002',
    name: '候选人B',
    education: [
      {
        school: '某重点大学',
        degree: '本科',
        major: '软件工程',
        startDate: '2017-09',
        endDate: '2021-06'
      }
    ],
    experience: [
      {
        company: '某创业公司',
        position: '全栈工程师',
        startDate: '2021-07',
        endDate: '2023-08',
        description: '负责公司产品的全栈开发工作',
        achievements: [
          '从0到1完成了产品的全栈开发',
          '设计并实现了RESTful API',
          '完成了移动端H5页面的开发和优化'
        ]
      },
      {
        company: '某大型互联网公司',
        position: '前端工程师',
        startDate: '2023-09',
        endDate: '至今',
        description: '负责公司中后台系统的前端开发',
        achievements: [
          '开发了多个业务模块',
          '参与了前端工程化建设'
        ]
      }
    ],
    projects: [
      {
        name: '企业管理系统',
        role: '前端负责人',
        description: '企业内部中后台管理系统',
        technologies: ['Vue', 'Vuex', 'ElementUI'],
        achievements: ['按时交付，代码质量高']
      }
    ],
    skills: ['Vue', 'React', 'JavaScript', 'TypeScript', 'Node.js'],
    rawContent: `候选人B，本科学历，软件工程专业，5年开发经验，熟练Vue和React技术栈。`,
    maskedContent: `候选人B，本科学历，软件工程专业，5年开发经验，熟练Vue和React技术栈。`
  },
  {
    id: 'resume-003',
    name: '候选人C',
    education: [
      {
        school: '某普通大学',
        degree: '本科',
        major: '计算机科学与技术',
        startDate: '2019-09',
        endDate: '2023-06'
      }
    ],
    experience: [
      {
        company: '某软件公司',
        position: '初级前端工程师',
        startDate: '2023-07',
        endDate: '至今',
        description: '负责公司业务页面开发',
        achievements: [
          '独立完成多个业务功能开发',
          '参与了团队技术分享'
        ]
      }
    ],
    projects: [
      {
        name: '官网开发',
        role: '开发工程师',
        description: '企业官网的开发',
        technologies: ['React', 'Next.js'],
        achievements: ['快速上线']
      }
    ],
    skills: ['React', 'JavaScript', 'HTML', 'CSS'],
    rawContent: `候选人C，本科学历，计算机专业，3年前端开发经验，熟悉React框架。`,
    maskedContent: `候选人C，本科学历，计算机专业，3年前端开发经验，熟悉React框架。`
  }
];

export const highPerformerProfiles: HighPerformerProfile[] = [
  {
    id: 'perf-001',
    position: '高级前端工程师',
    level: 'senior',
    department: '技术部',
    coreSkills: ['React', 'TypeScript', 'Vue', 'Node.js', 'Webpack', '性能优化', '架构设计'],
    keyStrengths: ['技术领导力', '问题解决能力', '跨团队协作', '持续学习', '代码质量把控'],
    careerTrajectory: ['初级工程师', '中级工程师', '高级工程师', '技术负责人'],
    projectTypes: ['电商平台', 'SaaS系统', '微前端架构', '性能优化', '组件库建设'],
    performanceLevel: 'top'
  },
  {
    id: 'perf-002',
    position: '前端技术专家',
    level: 'expert',
    department: '技术部',
    coreSkills: ['React', 'TypeScript', '低代码', '工程化', '架构设计', '微前端', 'Node.js'],
    keyStrengths: ['技术创新', '架构设计能力', '团队培养', '复杂问题拆解', '跨部门协作'],
    careerTrajectory: ['工程师', '高级工程师', '技术专家', '技术负责人'],
    projectTypes: ['低代码平台', '中台系统', '技术基础设施', '开源贡献', '技术规范制定'],
    performanceLevel: 'top'
  },
  {
    id: 'perf-003',
    position: '前端开发工程师',
    level: 'mid',
    department: '技术部',
    coreSkills: ['React', 'TypeScript', 'Vue', 'JavaScript', 'CSS', 'HTML5'],
    keyStrengths: ['快速学习', '执行力强', '团队协作', '代码质量', '主动承担'],
    careerTrajectory: ['初级工程师', '中级工程师', '核心开发'],
    projectTypes: ['业务系统', '中后台管理', '移动端H5', '小程序开发'],
    performanceLevel: 'excellent'
  }
];

export const basicInfoQuestions: Omit<InterviewQuestion, 'id'>[] = [
  {
    category: 'basicInfo',
    question: '请简单介绍一下你自己，包括你的成长背景和为什么选择这个行业。',
    expectedPoints: ['表达清晰有条理', '成长背景与职业选择相关联', '展现对行业的热情', '突出关键经历和转折点'],
    difficulty: 'easy',
    source: 'base',
  },
  {
    category: 'basicInfo',
    question: '在工作之余，你有什么兴趣爱好？这些爱好对你的工作有什么积极影响？',
    expectedPoints: ['兴趣爱好真实具体', '能够关联到工作能力的提升', '展现综合素质', '体现积极的生活态度'],
    difficulty: 'easy',
    source: 'base',
  },
  {
    category: 'basicInfo',
    question: '你如何评价自己的沟通能力和团队协作能力？请举例说明。',
    expectedPoints: ['有客观的自我认知', '有具体案例支撑', '体现协作意识', '展现沟通技巧'],
    difficulty: 'medium',
    source: 'base',
  },
];

export const mockEmployees: Employee[] = [
  {
    id: 'emp-001',
    name: '张明辉',
    position: '高级前端工程师',
    department: '技术部',
    level: 'senior',
    hireDate: new Date('2021-03-15'),
    lastPromotionDate: new Date('2023-06-01'),
    manager: '李总监',
  },
  {
    id: 'emp-002',
    name: '王雪婷',
    position: '产品经理',
    department: '产品部',
    level: 'mid',
    hireDate: new Date('2022-01-10'),
    manager: '陈总监',
  },
  {
    id: 'emp-003',
    name: '刘建国',
    position: '后端架构师',
    department: '技术部',
    level: 'expert',
    hireDate: new Date('2019-08-20'),
    lastPromotionDate: new Date('2022-03-15'),
    manager: '李总监',
  },
  {
    id: 'emp-004',
    name: '陈思涵',
    position: 'UI设计师',
    department: '设计部',
    level: 'mid',
    hireDate: new Date('2023-02-28'),
    manager: '赵总监',
  },
  {
    id: 'emp-005',
    name: '李浩宇',
    position: '数据分析师',
    department: '数据部',
    level: 'junior',
    hireDate: new Date('2023-07-01'),
    manager: '王总监',
  },
  {
    id: 'emp-006',
    name: '赵晓晴',
    position: '高级后端工程师',
    department: '技术部',
    level: 'senior',
    hireDate: new Date('2020-11-05'),
    lastPromotionDate: new Date('2023-01-10'),
    manager: '李总监',
  },
  {
    id: 'emp-007',
    name: '孙博文',
    position: '测试工程师',
    department: '技术部',
    level: 'mid',
    hireDate: new Date('2022-06-15'),
    manager: '李总监',
  },
  {
    id: 'emp-008',
    name: '周美玲',
    position: '运营经理',
    department: '运营部',
    level: 'senior',
    hireDate: new Date('2021-09-01'),
    lastPromotionDate: new Date('2024-01-20'),
    manager: '吴总监',
  },
];

function generateHistoricalData(baseValue: number, variance: number, periods: number) {
  const result = [];
  const labels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  const currentMonth = new Date().getMonth();
  for (let i = periods - 1; i >= 0; i--) {
    const idx = (currentMonth - i + 12) % 12;
    const value = baseValue + (Math.random() - 0.5) * variance;
    result.push({
      period: labels[idx],
      value: Math.round(value * 100) / 100,
    });
  }
  return result;
}

export function generateMockRiskAssessment(employeeId: string): AttritionRiskAssessment {
  const employee = mockEmployees.find(e => e.id === employeeId) || mockEmployees[0];
  const tenureYears = Math.round((new Date().getTime() - employee.hireDate.getTime()) / (365 * 24 * 60 * 60 * 1000) * 10) / 10;
  
  const riskLevels = ['low', 'medium', 'high', 'critical'] as const;
  const riskScore = Math.floor(Math.random() * 100);
  const overallRiskLevel = riskScore < 30 ? 'low' : riskScore < 55 ? 'medium' : riskScore < 80 ? 'high' : 'critical';

  const signals = [
    {
      id: 'sig-001',
      name: '出勤率',
      description: '月度考勤正常率',
      category: 'attendance' as const,
      currentValue: 90 + Math.random() * 8,
      baselineValue: 97,
      trend: 'down' as const,
      changeRate: -5 - Math.random() * 4,
      unit: '%',
      isAbnormal: true,
      weight: 0.15,
      threshold: { warning: 93, critical: 88 },
      historicalData: generateHistoricalData(95, 5, 6),
    },
    {
      id: 'sig-002',
      name: '迟到次数',
      description: '近30天迟到次数',
      category: 'attendance' as const,
      currentValue: 4 + Math.floor(Math.random() * 4),
      baselineValue: 1,
      trend: 'up' as const,
      changeRate: 250,
      unit: '次/月',
      isAbnormal: true,
      weight: 0.12,
      threshold: { warning: 3, critical: 6 },
      historicalData: generateHistoricalData(2, 2, 6),
    },
    {
      id: 'sig-003',
      name: '加班时长',
      description: '月度平均加班时长',
      category: 'overtime' as const,
      currentValue: 65 + Math.random() * 20,
      baselineValue: 35,
      trend: 'up' as const,
      changeRate: 80,
      unit: '小时/月',
      isAbnormal: true,
      weight: 0.18,
      threshold: { warning: 50, critical: 70 },
      historicalData: generateHistoricalData(45, 15, 6),
    },
    {
      id: 'sig-004',
      name: '周末加班频率',
      description: '近3个月周末加班天数',
      category: 'overtime' as const,
      currentValue: 6 + Math.floor(Math.random() * 5),
      baselineValue: 2,
      trend: 'up' as const,
      changeRate: 180,
      unit: '天/月',
      isAbnormal: true,
      weight: 0.1,
      threshold: { warning: 4, critical: 8 },
      historicalData: generateHistoricalData(3, 2, 6),
    },
    {
      id: 'sig-005',
      name: '内部沟通活跃度',
      description: '日均内部消息发送量',
      category: 'communication' as const,
      currentValue: 18 + Math.random() * 10,
      baselineValue: 45,
      trend: 'down' as const,
      changeRate: -55,
      unit: '条/天',
      isAbnormal: true,
      weight: 0.14,
      threshold: { warning: 30, critical: 20 },
      historicalData: generateHistoricalData(40, 15, 6),
    },
    {
      id: 'sig-006',
      name: '会议参与度',
      description: '主动发言/参会时长比例',
      category: 'communication' as const,
      currentValue: 0.1 + Math.random() * 0.1,
      baselineValue: 0.35,
      trend: 'down' as const,
      changeRate: -60,
      unit: '%',
      isAbnormal: true,
      weight: 0.08,
      threshold: { warning: 0.25, critical: 0.15 },
      historicalData: generateHistoricalData(0.3, 0.1, 6),
    },
    {
      id: 'sig-007',
      name: '项目贡献度',
      description: '代码提交/任务完成量',
      category: 'project' as const,
      currentValue: 40 + Math.random() * 20,
      baselineValue: 80,
      trend: 'down' as const,
      changeRate: -45,
      unit: '%',
      isAbnormal: true,
      weight: 0.15,
      threshold: { warning: 60, critical: 40 },
      historicalData: generateHistoricalData(75, 20, 6),
    },
    {
      id: 'sig-008',
      name: '任务完成质量',
      description: '一次通过率/返工率',
      category: 'project' as const,
      currentValue: 70 + Math.random() * 15,
      baselineValue: 92,
      trend: 'down' as const,
      changeRate: -20,
      unit: '%',
      isAbnormal: true,
      weight: 0.08,
      threshold: { warning: 80, critical: 65 },
      historicalData: generateHistoricalData(88, 10, 6),
    },
  ];

  const riskIndicators = [
    {
      id: 'ind-001',
      name: '出勤异常',
      description: '出勤率显著下降，迟到次数骤增',
      category: '出勤风险',
      triggered: true,
      severity: 'high' as const,
      score: 82,
      evidence: [
        '近30天出勤率下降至91%，低于部门均值96%',
        '本月迟到5次，上月同期仅1次',
        '出现2次未经批准的半天缺勤',
      ],
      suggestion: '建议部门负责人安排1对1沟通，了解是否存在个人困难影响出勤',
    },
    {
      id: 'ind-002',
      name: '过度加班',
      description: '持续高强度加班，存在 burnout 风险',
      category: '工作强度风险',
      triggered: true,
      severity: 'high' as const,
      score: 88,
      evidence: [
        '本月累计加班72小时，远超部门均值38小时',
        '连续3个周末都在公司加班',
        '深夜（22点后）代码提交占比35%',
      ],
      suggestion: '立即评估工作分配，考虑增加人员或调整排期，强制安排带薪休假',
    },
    {
      id: 'ind-003',
      name: '沟通退缩',
      description: '内部沟通和协作意愿明显减弱',
      category: '社交行为风险',
      triggered: true,
      severity: 'medium' as const,
      score: 68,
      evidence: [
        '日均消息量从48条下降至22条，降幅54%',
        '会议主动发言比例从38%降至12%',
        '跨部门协作响应时间从2小时延长至6小时',
      ],
      suggestion: '组织团队活动改善氛围，增加非正式沟通机会，关注员工心理状态',
    },
    {
      id: 'ind-004',
      name: '产出下滑',
      description: '工作产出和质量出现明显下滑趋势',
      category: '绩效风险',
      triggered: true,
      severity: 'medium' as const,
      score: 62,
      evidence: [
        '本月任务完成量仅为基线的52%',
        '代码一次通过率从94%降至76%',
        '连续2个迭代未按时交付承诺的功能',
      ],
      suggestion: '重新评估工作难度匹配度，提供必要的技术支持或培训资源',
    },
    {
      id: 'ind-005',
      name: '成长停滞',
      description: '长期未获晋升或新挑战，职业发展受阻',
      category: '职业发展风险',
      triggered: true,
      severity: 'high' as const,
      score: 78,
      evidence: [
        `已担任现职级${tenureYears > 2 ? '超过2年' : tenureYears + '年'}`,
        employee.lastPromotionDate ? `距上次晋升已${Math.round((new Date().getTime() - employee.lastPromotionDate.getTime()) / (365 * 24 * 60 * 60 * 1000))}年` : '入职以来未获晋升',
        '近6个月未参与新项目或挑战性任务',
      ],
      suggestion: '制定个人发展计划(IDP)，提供进阶培训或横向发展机会，明确晋升路径',
    },
  ];

  const retentionStrategies = [
    {
      id: 'str-001',
      title: '调整工作挑战度',
      category: 'challenge' as const,
      priority: 'immediate' as const,
      description: '通过重新分配工作任务，匹配员工能力与兴趣，恢复工作热情',
      actions: [
        '与员工1对1沟通，了解其感兴趣的技术方向或业务领域',
        '重新评估当前工作分配，减少重复性工作占比',
        '安排参与至少1个核心项目的设计与决策环节',
        '给予技术调研/创新项目的自主探索空间（20%时间）',
      ],
      expectedImpact: '预计可提升工作满意度40%，降低离职意愿35%',
      timeline: '1-2周内启动，持续1-3个月',
      responsibleRole: '部门负责人 + 直属主管',
    },
    {
      id: 'str-002',
      title: '增加成长对话与发展规划',
      category: 'growth' as const,
      priority: 'immediate' as const,
      description: '建立系统化的成长对话机制，明确职业发展路径，增强组织归属感',
      actions: [
        '制定个性化个人发展计划(IDP)，明确短期与中期目标',
        '每两周进行30分钟的成长1对1对话，跟踪进展',
        '匹配资深技术专家作为mentor，提供职业指导',
        '优先安排外部技术会议/培训机会，预算3000-5000元/季度',
      ],
      expectedImpact: '预计可提升组织承诺度50%，提升晋升准备度60%',
      timeline: '立即启动，长期持续机制化',
      responsibleRole: '直属主管 + HRBP',
    },
    {
      id: 'str-003',
      title: '薪酬竞争力对标与调整',
      category: 'compensation' as const,
      priority: 'short_term' as const,
      description: '进行市场薪酬对标，对明显偏离市场水平的薪资进行调整，消除不公平感',
      actions: [
        '获取同地区同行业同级别薪酬数据报告（P50/P75分位）',
        '评估当前薪酬与市场水平的差距，识别调整必要性',
        '如低于P50分位，优先调薪至P50-P75区间',
        '考虑给予一次性留任奖金或增加股权激励授予',
      ],
      expectedImpact: '预计可降低薪酬敏感度60%，提升薪酬满意度45%',
      timeline: '2-4周内完成对标，1个月内落实调整',
      responsibleRole: 'HR薪酬组 + 部门总监',
    },
    {
      id: 'str-004',
      title: '工作生活平衡干预',
      category: 'worklife' as const,
      priority: 'immediate' as const,
      description: '立即干预过度加班状态，恢复健康的工作节奏，预防职业倦怠',
      actions: [
        '强制安排5-7天带薪休假，休假期间切断工作联系',
        '将月度加班时长控制在40小时以内，超过需总监特批',
        '合理调整项目排期，适当增加人力投入或缩减功能范围',
        '推行周五"无会议日"，保障深度工作时间',
      ],
      expectedImpact: '预计可降低 burnout 风险70%，提升工作效率30%',
      timeline: '本周启动，2周内见效',
      responsibleRole: '直属主管 + 项目经理',
    },
    {
      id: 'str-005',
      title: '认可与正向激励强化',
      category: 'recognition' as const,
      priority: 'short_term' as const,
      description: '增加对员工贡献的显性认可，提升工作价值感和被尊重感',
      actions: [
        '在部门周会中公开表扬近期的关键贡献或技术突破',
        '优先提名参与公司季度之星/年度优秀评选',
        '给予项目奖金或spot bonus（1-3个月工资范围）',
        '安排与高管的1对1交流机会，表达重视与期许',
      ],
      expectedImpact: '预计可提升被重视感70%，增强团队认同55%',
      timeline: '1个月内完成3项以上动作',
      responsibleRole: '部门负责人 + HRBP',
    },
    {
      id: 'str-006',
      title: '团队文化与归属感建设',
      category: 'culture' as const,
      priority: 'medium_term' as const,
      description: '加强团队融入，营造支持性的团队氛围，增强员工的归属感',
      actions: [
        '组织每月1次的团队建设活动（非强制、形式多样化）',
        '建立每周技术分享/学习会，邀请该员工担任讲师',
        '改善工位环境或配备更好的办公设备（显示器、人体工学椅等）',
        '增加跨团队协作交流机会，拓展内部人脉网络',
      ],
      expectedImpact: '预计可提升团队归属感55%，降低社交孤立感65%',
      timeline: '1-3个月逐步推进，长期坚持',
      responsibleRole: '直属主管 + 团队成员',
    },
  ];

  return {
    id: `risk-assess-${Date.now()}`,
    employeeId: employee.id,
    employeeName: employee.name,
    position: employee.position,
    department: employee.department,
    level: employee.level,
    tenure: tenureYears,
    overallRiskLevel,
    riskScore,
    assessmentDate: new Date(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    behaviorSignals: signals,
    riskIndicators,
    retentionStrategies,
    riskBreakdown: {
      attendance: Math.round(signals.filter(s => s.category === 'attendance').reduce((sum, s) => sum + (s.isAbnormal ? s.weight * 100 : 0), 0) * 2),
      overtime: Math.round(signals.filter(s => s.category === 'overtime').reduce((sum, s) => sum + (s.isAbnormal ? s.weight * 100 : 0), 0) * 2),
      communication: Math.round(signals.filter(s => s.category === 'communication').reduce((sum, s) => sum + (s.isAbnormal ? s.weight * 100 : 0), 0) * 2),
      project: Math.round(signals.filter(s => s.category === 'project').reduce((sum, s) => sum + (s.isAbnormal ? s.weight * 100 : 0), 0) * 2),
      performance: Math.round(60 + Math.random() * 20),
      career: Math.round(65 + Math.random() * 25),
    },
    summary: {
      keyFindings: [
        '综合分析6大维度12项行为指标，识别出多个离职风险信号同时触发',
        '过度加班+成长停滞+沟通退缩是三大核心风险因素，共贡献68%的风险权重',
        `风险评分${riskScore}分，属于${overallRiskLevel === 'critical' ? '极高' : overallRiskLevel === 'high' ? '高' : overallRiskLevel === 'medium' ? '中' : '低'}风险等级，建议在${overallRiskLevel === 'critical' ? '24小时' : overallRiskLevel === 'high' ? '3天内' : '1周内'}启动干预`,
      ],
      immediateConcerns: [
        '过度加班可能导致严重的职业倦怠（burnout），需立即减轻工作负荷',
        '成长停滞超过预期周期，若不及时干预可能触发主动求职行为',
        '社交退缩信号强烈，存在心理亚健康风险，需关注员工精神状态',
      ],
      positiveSignals: [
        '历史绩效记录良好，员工具备优秀的能力基础和专业素养',
        '在职期间曾获得多项认可，对公司文化有基本认同',
        '核心技能与岗位高度匹配，调整后可快速恢复产出',
      ],
    },
    peerComparison: {
      departmentAvgRiskScore: 38,
      companyAvgRiskScore: 32,
      percentile: Math.round(85 + Math.random() * 10),
    },
  };
}

export function generateAllMockRiskAssessments(): AttritionRiskAssessment[] {
  return mockEmployees.map(emp => generateMockRiskAssessment(emp.id));
}
