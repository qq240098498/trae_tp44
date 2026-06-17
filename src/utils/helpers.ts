export function getScoreColor(score: number): string {
  if (score >= 90) return 'text-purple-600';
  if (score >= 80) return 'text-emerald-600';
  if (score >= 70) return 'text-blue-600';
  if (score >= 60) return 'text-amber-600';
  if (score >= 50) return 'text-orange-600';
  return 'text-red-600';
}

export function getScoreBgColor(score: number): string {
  if (score >= 90) return 'bg-purple-100';
  if (score >= 80) return 'bg-emerald-100';
  if (score >= 70) return 'bg-blue-100';
  if (score >= 60) return 'bg-amber-100';
  if (score >= 50) return 'bg-orange-100';
  return 'bg-red-100';
}

export function getScoreLevel(score: number): {
  level: string;
  color: string;
  description: string;
} {
  if (score >= 90) {
    return { level: 'S', color: 'bg-purple-500', description: '极其优秀' };
  }
  if (score >= 80) {
    return { level: 'A', color: 'bg-emerald-500', description: '优秀' };
  }
  if (score >= 70) {
    return { level: 'B', color: 'bg-blue-500', description: '良好' };
  }
  if (score >= 60) {
    return { level: 'C', color: 'bg-amber-500', description: '合格' };
  }
  if (score >= 50) {
    return { level: 'D', color: 'bg-orange-500', description: '待改进' };
  }
  return { level: 'E', color: 'bg-red-500', description: '不合格' };
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    professional: '专业能力',
    softSkill: '软技能',
    culturalFit: '文化适配',
  };
  return labels[category] || category;
}

export function getDifficultyLabel(difficulty: string): string {
  const labels: Record<string, string> = {
    easy: '简单',
    medium: '中等',
    hard: '困难',
  };
  return labels[difficulty] || difficulty;
}

export function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    easy: 'bg-emerald-100 text-emerald-700',
    medium: 'bg-amber-100 text-amber-700',
    hard: 'bg-red-100 text-red-700',
  };
  return colors[difficulty] || 'bg-slate-100 text-slate-700';
}

export function getRecommendationLabel(recommendation: string): string {
  const labels: Record<string, string> = {
    hire: '推荐录用',
    reject: '不推荐录用',
    pending: '待定',
  };
  return labels[recommendation] || recommendation;
}

export function getRecommendationColor(recommendation: string): string {
  const colors: Record<string, string> = {
    hire: 'bg-emerald-500',
    reject: 'bg-red-500',
    pending: 'bg-amber-500',
  };
  return colors[recommendation] || 'bg-slate-500';
}

export function getLevelLabel(level: string): string {
  const labels: Record<string, string> = {
    entry: '应届生',
    junior: '初级',
    mid: '中级',
    senior: '高级',
    lead: '技术专家',
    manager: '技术经理',
  };
  return labels[level] || level;
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function downloadFile(content: string, filename: string, type: string = 'text/plain') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
