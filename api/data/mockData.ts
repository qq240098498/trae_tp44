import type { JobPosition, Resume, InterviewQuestion } from '../../shared/types';

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
          '带领3人小组完成了多个重要项目的交付'
        ]
      },
      {
        company: '某科技公司',
        position: '前端技术专家',
        startDate: '2023-01',
        endDate: '2026-05',
        description: '负责公司SaaS产品的前端架构设计',
        achievements: [
          '主导完成微前端架构升级，支持多团队并行开发',
          '建立前端监控体系，问题发现效率提升80%',
          '培养了2名高级开发工程师'
        ]
      }
    ],
    skills: ['React', 'TypeScript', 'Vue', 'Node.js', 'Webpack', 'Vite', '微前端', '性能优化', '架构设计', '团队管理'],
    projects: [
      {
        name: '电商平台重构',
        role: '技术负责人',
        description: '对公司核心电商平台进行技术重构',
        technologies: ['React', 'TypeScript', 'Redux', 'Webpack'],
        achievements: [
          '项目按时交付，代码可维护性显著提升',
          '页面性能指标提升50%以上'
        ]
      }
    ],
    rawContent: '完整简历内容...',
    maskedContent: '屏蔽敏感信息后的简历内容...',
    appliedPositionId: 'job-001'
  },
  {
    id: 'resume-002',
    name: '候选人B',
    education: [
      {
        school: '某普通大学',
        degree: '本科',
        major: '软件工程',
        startDate: '2017-09',
        endDate: '2021-06'
      }
    ],
    experience: [
      {
        company: '某创业公司',
        position: '前端开发工程师',
        startDate: '2021-07',
        endDate: '2023-08',
        description: '负责公司产品的前端开发工作',
        achievements: [
          '独立完成了多个核心模块的开发',
          '参与了技术选型和架构设计'
        ]
      },
      {
        company: '某中型企业',
        position: '中级前端工程师',
        startDate: '2023-09',
        endDate: '2026-05',
        description: '负责企业级应用的前端开发',
        achievements: [
          '主导完成了表单引擎的开发',
          '优化了构建流程，构建时间减少50%'
        ]
      }
    ],
    skills: ['React', 'TypeScript', 'Vue', 'Node.js', 'Webpack'],
    projects: [
      {
        name: '企业管理系统',
        role: '核心开发',
        description: '开发企业内部管理系统',
        technologies: ['Vue', 'TypeScript', 'Vuex'],
        achievements: ['完成了权限系统、表单引擎等核心模块']
      }
    ],
    rawContent: '完整简历内容...',
    maskedContent: '屏蔽敏感信息后的简历内容...',
    appliedPositionId: 'job-001'
  },
  {
    id: 'resume-003',
    name: '候选人C',
    education: [
      {
        school: '某重点大学',
        degree: '博士',
        major: '计算机科学',
        startDate: '2015-09',
        endDate: '2020-06'
      }
    ],
    experience: [
      {
        company: '某研究院',
        position: '研究员',
        startDate: '2020-07',
        endDate: '2022-06',
        description: '从事前端工程化相关研究',
        achievements: [
          '发表了2篇学术论文',
          '申请了1项专利'
        ]
      },
      {
        company: '某互联网大厂',
        position: '高级前端工程师',
        startDate: '2022-07',
        endDate: '2026-05',
        description: '负责中台产品的前端开发',
        achievements: [
          '主导了低代码平台的前端设计与开发',
          '推动了团队的技术创新'
        ]
      }
    ],
    skills: ['React', 'TypeScript', 'Node.js', '低代码', '工程化', '架构设计'],
    projects: [
      {
        name: '低代码开发平台',
        role: '技术负责人',
        description: '设计并开发企业级低代码平台',
        technologies: ['React', 'TypeScript', 'Monaco Editor'],
        achievements: [
          '平台已支撑200+业务应用开发',
          '获得公司技术创新奖'
        ]
      }
    ],
    rawContent: '完整简历内容...',
    maskedContent: '屏蔽敏感信息后的简历内容...',
    appliedPositionId: 'job-001'
  }
];

export const professionalQuestions: Omit<InterviewQuestion, 'id'>[] = [
  {
    category: 'professional',
    question: '请详细描述你在前端性能优化方面的经验，包括具体的优化手段和效果。',
    expectedPoints: ['能够说出具体的性能指标', '了解多种优化技术', '有实际优化案例', '能够量化优化效果'],
    difficulty: 'medium'
  },
  {
    category: 'professional',
    question: '如何设计一个可扩展的前端组件库？请从架构、规范、文档等方面说明。',
    expectedPoints: ['组件设计原则', '版本管理策略', '文档体系', '测试覆盖', '按需加载'],
    difficulty: 'hard'
  },
  {
    category: 'professional',
    question: '请解释 React Fiber 架构的核心思想和工作原理。',
    expectedPoints: ['时间切片', '优先级调度', '协调算法', '双缓存机制'],
    difficulty: 'hard'
  },
  {
    category: 'professional',
    question: '在微前端架构中，如何处理样式隔离、状态共享和性能问题？',
    expectedPoints: ['样式隔离方案', '状态管理策略', '通信机制', '性能优化手段'],
    difficulty: 'hard'
  },
  {
    category: 'professional',
    question: 'TypeScript 中的泛型、条件类型、映射类型分别是什么？请举例说明其应用场景。',
    expectedPoints: ['泛型的使用场景', '条件类型的语法', '映射类型的应用', '类型体操实例'],
    difficulty: 'medium'
  }
];

export const softSkillQuestions: Omit<InterviewQuestion, 'id'>[] = [
  {
    category: 'softSkill',
    question: '请描述一个你遇到的技术难题，你是如何解决的？在这个过程中你学到了什么？',
    expectedPoints: ['问题分析能力', '解决方案设计', '执行力', '复盘总结能力'],
    difficulty: 'medium'
  },
  {
    category: 'softSkill',
    question: '当你与产品经理在需求理解上有分歧时，你会如何处理？请举例说明。',
    expectedPoints: ['沟通能力', '换位思考', '解决冲突的能力', '达成共识的方法'],
    difficulty: 'medium'
  },
  {
    category: 'softSkill',
    question: '如何平衡技术债务和业务需求之间的关系？',
    expectedPoints: ['识别技术债务', '优先级排序', '沟通策略', '长期规划'],
    difficulty: 'medium'
  },
  {
    category: 'softSkill',
    question: '请分享一次你带领团队完成目标的经历，你是如何激励和协调团队成员的？',
    expectedPoints: ['目标拆解', '任务分配', '团队激励', '冲突处理', '结果导向'],
    difficulty: 'hard'
  },
  {
    category: 'softSkill',
    question: '在快速迭代的开发环境中，你如何保持代码质量和个人技术成长？',
    expectedPoints: ['时间管理', '学习方法', '质量保障手段', '持续改进意识'],
    difficulty: 'medium'
  }
];

export const culturalFitQuestions: Omit<InterviewQuestion, 'id'>[] = [
  {
    category: 'culturalFit',
    question: '你理想中的工作环境和团队氛围是怎样的？',
    expectedPoints: ['价值观匹配', '协作方式偏好', '成长期望', '文化契合度'],
    difficulty: 'easy'
  },
  {
    category: 'culturalFit',
    question: '我们公司强调"客户第一"的价值观，请分享一个你在工作中体现这一价值观的例子。',
    expectedPoints: ['理解公司价值观', '有具体案例', '体现同理心', '结果导向'],
    difficulty: 'medium'
  },
  {
    category: 'culturalFit',
    question: '当你发现团队的工作流程或方法存在问题时，你会怎么做？',
    expectedPoints: ['主动性', '建设性意见', '推动变革的能力', '团队责任感'],
    difficulty: 'medium'
  },
  {
    category: 'culturalFit',
    question: '你如何看待加班？在遇到紧急项目时你会如何应对？',
    expectedPoints: ['工作态度', '责任感', '时间管理', '工作生活平衡的理解'],
    difficulty: 'medium'
  },
  {
    category: 'culturalFit',
    question: '请描述你职业生涯中最有成就感的一件事，并说明原因。',
    expectedPoints: ['成就动机', '价值观', '自我认知', '成长轨迹'],
    difficulty: 'easy'
  }
];
