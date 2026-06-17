import type { InterviewQuestion, JobPosition, Resume } from '../../shared/types';
import { professionalQuestions, softSkillQuestions, culturalFitQuestions } from '../data/mockData';

export function generateInterviewQuestions(
  jobPosition: JobPosition,
  resume?: Resume
): InterviewQuestion[] {
  const questions: Omit<InterviewQuestion, 'id'>[] = [];

  const professional = generateProfessionalQuestions(jobPosition, resume);
  const softSkills = generateSoftSkillQuestions(jobPosition, resume);
  const culturalFit = generateCulturalFitQuestions(jobPosition, resume);

  questions.push(...professional, ...softSkills, ...culturalFit);

  return questions.map((q, index) => ({
    ...q,
    id: `q-${Date.now()}-${index}`,
  }));
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
    matchedSkills.slice(0, 3).forEach(skill => {
      questions.push({
        category: 'professional',
        question: `请分享你在${skill}方面的实践经验，包括遇到的挑战和解决方案。`,
        expectedPoints: [
          `能够清晰描述${skill}的应用场景`,
          '有具体的项目案例支撑',
          '能够深入讲解技术细节',
          '体现问题解决能力'
        ],
        difficulty: 'medium'
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
        '对新技术保持热情'
      ],
      difficulty: 'medium'
    });
  }

  const additionalQuestions = professionalQuestions.filter((_, i) => i < 3);
  questions.push(...additionalQuestions);

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
        '有具体的成果和数据支撑'
      ],
      difficulty: 'hard'
    });

    questions.push({
      category: 'softSkill',
      question: '在技术决策中，当你的方案与团队成员有分歧时，你会如何处理？请举例说明。',
      expectedPoints: [
        '展现成熟的沟通技巧',
        '能够站在对方角度思考',
        '有说服力的表达能力',
        '最终达成共识的方法'
      ],
      difficulty: 'hard'
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
        '展现坚韧不拔的品质'
      ],
      difficulty: 'medium'
    });
  }

  const additionalQuestions = softSkillQuestions.filter((_, i) => i < 3);
  questions.push(...additionalQuestions);

  return questions.slice(0, 4);
}

function generateCulturalFitQuestions(
  jobPosition: JobPosition,
  resume?: Resume
): Omit<InterviewQuestion, 'id'>[] {
  const questions: Omit<InterviewQuestion, 'id'>[] = [];

  questions.push({
    category: 'culturalFit',
    question: '你选择下一份工作时，最看重的三个因素是什么？为什么？',
    expectedPoints: [
      '价值观与公司文化是否匹配',
      '对职业发展有清晰规划',
      '能够真实表达自己的诉求',
      '展现对工作的热情和投入'
    ],
    difficulty: 'easy'
  });

  questions.push({
    category: 'culturalFit',
    question: '请描述你理想中的团队协作方式，以及你在团队中通常扮演的角色。',
    expectedPoints: [
      '了解自己的优势和定位',
      '团队协作意识强',
      '能够适应不同的工作风格',
      '展现积极主动的工作态度'
    ],
    difficulty: 'medium'
  });

  const additionalQuestions = culturalFitQuestions.filter((_, i) => i < 2);
  questions.push(...additionalQuestions);

  return questions.slice(0, 3);
}

export function getQuestionByCategory(
  questions: InterviewQuestion[],
  category: InterviewQuestion['category']
): InterviewQuestion[] {
  return questions.filter(q => q.category === category);
}

export function getDifficultyLabel(difficulty: string): string {
  const labels: Record<string, string> = {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  };
  return labels[difficulty] || difficulty;
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    professional: '专业能力',
    softSkill: '软技能',
    culturalFit: '文化适配'
  };
  return labels[category] || category;
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
