import type {
  EvaluationResult,
  InterviewEvaluation,
  HiringRecommendation,
  Resume,
  JobPosition,
} from '../../shared/types';
import { analyzeResume } from './resumeAnalyzer';

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
