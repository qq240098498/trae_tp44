import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface RadarDataPoint {
  subject: string;
  score: number;
  fullMark?: number;
}

interface RadarChartProps {
  data: RadarDataPoint[];
  height?: number;
  color?: string;
}

export default function RadarChart({
  data,
  height = 300,
  color = '#3B82F6',
}: RadarChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    fullMark: item.fullMark || 100,
  }));

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <RechartsRadarChart data={chartData} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#e2e8f0" strokeWidth={1} />
          <PolarAngleAxis
            dataKey="subject"
            tick={{
              fill: '#475569',
              fontSize: 13,
              fontWeight: 500,
            }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{
              fill: '#94a3b8',
              fontSize: 11,
            }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            formatter={(value: number) => [`${value} 分`, '得分']}
          />
          <Radar
            name="得分"
            dataKey="score"
            stroke={color}
            fill={color}
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
