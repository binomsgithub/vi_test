import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TimeSeriesPoint {
  x: string;
  y: number;
}

interface Series {
  id: string;
  label: string;
  data: TimeSeriesPoint[];
}

interface TimeSeriesChartProps {
  title: string;
  xLabel: string;
  yLabel?: string;
  series: Series[];
}

export function TimeSeriesChart({ title, xLabel, yLabel, series }: TimeSeriesChartProps) {
  // Transform data for Recharts
  const chartData = series[0]?.data.map((point, idx) => {
    const entry: any = { x: point.x };
    series.forEach((s) => {
      entry[s.id] = s.data[idx]?.y ?? 0;
    });
    return entry;
  }) || [];

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" label={{ value: xLabel, position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: yLabel, angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          {series.map((s, idx) => (
            <Line
              key={s.id}
              type="monotone"
              dataKey={s.id}
              name={s.label}
              stroke={colors[idx % colors.length]}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

