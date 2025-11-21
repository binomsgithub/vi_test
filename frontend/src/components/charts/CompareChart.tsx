import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Series {
  segmentLabel: string;
  data: { x: string; y: number }[];
}

interface CompareChartProps {
  metricLabel: string;
  series: Series[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

export function CompareChart({ metricLabel, series }: CompareChartProps) {
  // Transform data for Recharts
  const chartData = series[0]?.data.map((point, idx) => {
    const entry: any = { x: point.x };
    series.forEach((s) => {
      entry[s.segmentLabel] = s.data[idx]?.y ?? 0;
    });
    return entry;
  }) || [];

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">{metricLabel} - Segment Comparison</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" label={{ value: 'Hour', position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: metricLabel, angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          {series.map((s, idx) => (
            <Line
              key={s.segmentLabel}
              type="monotone"
              dataKey={s.segmentLabel}
              stroke={COLORS[idx % COLORS.length]}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

