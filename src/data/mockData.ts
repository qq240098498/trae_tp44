import type { JobPosition, Resume } from '../../shared/types';

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
    skills: ['React', 'TypeScript', 'Vue', 'Node.js', 'Webpack', '性能优化', '微前端'],
    rawContent: `候选人A，硕士学历，计算机专业，7年前端开发经验，精通React等前端技术，有丰富的团队管理经验。`,
    maskedContent: `候选人A，硕士学历，计算机专业，7年前端开发经验，精通React等前端技术，有丰富的团队管理经验。`
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
