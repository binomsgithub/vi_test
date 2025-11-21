import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { LevelCompareMetric } from '../../types/metrics';

interface LevelCompareBarProps {
  metric: LevelCompareMetric;
}

const COLORS = {
  brand: '#4c1d95',      // Dark purple
  franchisee: '#9333ea', // Purple
  store: '#14b8a6',      // Teal
};

export function LevelCompareBar({ metric }: LevelCompareBarProps) {
  const data = [
    { name: 'Brand', value: metric.brandValue },
    { name: 'Franchisee', value: metric.franchiseeValue },
    { name: 'Store', value: metric.storeValue },
  ];

  const formatValue = (value: number): string => {
    if (metric.unit === '%') {
      return `${value.toFixed(1)}%`;
    } else if (metric.unit === '$') {
      return `$${value.toFixed(2)}`;
    } else if (metric.unit === 'mins') {
      return `${value.toFixed(1)} mins`;
    }
    return value.toFixed(1);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
      <h4 className="text-sm font-semibold mb-3 text-gray-700">{metric.label}</h4>
      <ResponsiveContainer width="100%" height={120}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 60, bottom: 5 }}
        >
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={60} />
          <Tooltip
            formatter={(value: number) => formatValue(value)}
            labelStyle={{ color: '#374151' }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => {
              let color = COLORS.store;
              if (entry.name === 'Brand') color = COLORS.brand;
              else if (entry.name === 'Franchisee') color = COLORS.franchisee;
              return <Cell key={`cell-${index}`} fill={color} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-4 mt-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.brand }}></div>
          <span className="text-gray-600">Brand</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.franchisee }}></div>
          <span className="text-gray-600">Franchisee</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.store }}></div>
          <span className="text-gray-600">Store</span>
        </div>
      </div>
    </div>
  );
}

