import { SegmentFilters } from '../../types/filters';

interface SegmentFilterPanelProps {
  segmentLabel: 'Segment A' | 'Segment B' | 'Segment C';
  filters: SegmentFilters;
  onChange: (filters: SegmentFilters) => void;
  filterOptions?: {
    brands: string[];
    franchiseIds: string[];
    storeIds: string[];
    engagementModes: string[];
    channels: string[];
  };
}

export function SegmentFilterPanel({
  segmentLabel,
  filters,
  onChange,
  filterOptions,
}: SegmentFilterPanelProps) {
  const updateFilter = (key: keyof SegmentFilters, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  if (!filterOptions) {
    return <div className="bg-white rounded-lg shadow p-4">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200 mb-4">
      <h3 className="font-semibold mb-3">{segmentLabel}</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Brand</label>
          <select
            value={filters.brand || 'any'}
            onChange={(e) => updateFilter('brand', e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {filterOptions.brands.map((b) => (
              <option key={b} value={b}>
                {b === 'any' ? 'Any' : b}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Franchise ID</label>
          <select
            value={filters.franchiseId || 'any'}
            onChange={(e) => updateFilter('franchiseId', e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {filterOptions.franchiseIds.map((f) => (
              <option key={f} value={f}>
                {f === 'any' ? 'Any' : f}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Store ID</label>
          <select
            value={filters.storeId || 'any'}
            onChange={(e) => updateFilter('storeId', e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {filterOptions.storeIds.map((s) => (
              <option key={s} value={s}>
                {s === 'any' ? 'Any' : s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Engagement Mode</label>
          <select
            value={filters.engagement || 'any'}
            onChange={(e) => updateFilter('engagement', e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {filterOptions.engagementModes.map((e) => (
              <option key={e} value={e}>
                {e === 'any' ? 'Any' : e}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Channel</label>
          <select
            value={filters.channel || 'any'}
            onChange={(e) => updateFilter('channel', e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {filterOptions.channels.map((c) => (
              <option key={c} value={c}>
                {c === 'any' ? 'Any' : c}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

