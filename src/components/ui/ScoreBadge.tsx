import { getScoreLevel } from '../../utils/helpers';

interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function ScoreBadge({ score, size = 'md', showLabel = true }: ScoreBadgeProps) {
  const level = getScoreLevel(score);
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl',
  };

  return (
    <div className="flex items-center gap-3">
      <div
        className={`score-badge ${sizeClasses[size]} ${level.color} text-white shadow-lg`}
      >
        {score}
      </div>
      {showLabel && (
        <div>
          <div className="font-bold text-primary-900">
            {level.level} 级
          </div>
          <div className="text-sm text-slate-500">{level.description}</div>
        </div>
      )}
    </div>
  );
}
