import { METRIC_OPTIONS } from '../../types/metrics';

interface MetricOption {
  id: string;
  label: string;
}

interface MetricSelectorProps {
  value: string;
  onChange: (metricId: string) => void;
  options?: MetricOption[];
}

export function MetricSelector({ value, onChange, options = METRIC_OPTIONS }: MetricSelectorProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Metric:
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 text-sm w-full max-w-xs"
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

