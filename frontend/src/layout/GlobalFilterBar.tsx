import { useEffect, useState } from 'react';
import { useFilters } from '../context/FiltersContext';
import { getFilterOptions, FilterOptions } from '../api/filters';
import { CallDateFilterControl } from '../components/filters/CallDateFilter';
import { CallDateFilter } from '../types/filters';

export function GlobalFilterBar() {
  const { filters, setFilters, updateFilter } = useFilters();
  const [options, setOptions] = useState<FilterOptions | null>(null);

  const handleCallDateChange = (next: CallDateFilter) => {
    setFilters({ ...filters, callDate: next });
  };

  useEffect(() => {
    getFilterOptions().then(setOptions).catch(console.error);
  }, []);

  if (!options) {
    return <div className="bg-gray-50 px-6 py-3">Loading filters...</div>;
  }

  return (
    <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
      <div className="flex flex-wrap gap-4 items-center">
        <label className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Brand:</span>
          <select
            value={filters.brand || 'any'}
            onChange={(e) => updateFilter('brand', e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {options.brands.map((b) => (
              <option key={b} value={b}>
                {b === 'any' ? 'Any' : b}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Owner:</span>
          <select
            value={filters.owner || 'any'}
            onChange={(e) => updateFilter('owner', e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {options.owners.map((o) => (
              <option key={o} value={o}>
                {o === 'any' ? 'Any' : o}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Franchise ID:</span>
          <select
            value={filters.franchiseId || 'any'}
            onChange={(e) => updateFilter('franchiseId', e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {options.franchiseIds.map((f) => (
              <option key={f} value={f}>
                {f === 'any' ? 'Any' : f}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Store ID:</span>
          <select
            value={filters.storeId || 'any'}
            onChange={(e) => updateFilter('storeId', e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {options.storeIds.map((s) => (
              <option key={s} value={s}>
                {s === 'any' ? 'Any' : s}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Channel:</span>
          <select
            value={filters.channel || 'any'}
            onChange={(e) => updateFilter('channel', e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {options.channels.map((c) => (
              <option key={c} value={c}>
                {c === 'any' ? 'Any' : c}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Engagement Mode:</span>
          <select
            value={filters.engagementMode || 'any'}
            onChange={(e) => updateFilter('engagementMode', e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {options.engagementModes.map((e) => (
              <option key={e} value={e}>
                {e === 'any' ? 'Any' : e}
              </option>
            ))}
          </select>
        </label>

        <CallDateFilterControl
          value={filters.callDate}
          onChange={handleCallDateChange}
        />
      </div>
    </div>
  );
}

