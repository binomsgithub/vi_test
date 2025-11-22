import React, { useMemo, useState } from "react";
import { useCrossFilterEmitter } from "../../utils/crossFilterHelpers";

interface UpsellItem {
  item: string;
  attempts: number;
  success: number;
  successRate?: number;
}

interface UpsellCategory {
  id: string;
  label: string;
  summary?: {
    attempts: number;
    success: number;
    successRate?: number;
  };
  items: UpsellItem[];
}

interface UpsellCategoriesResponse {
  categories: UpsellCategory[];
}

const formatPercent = (value?: number | null) =>
  value == null ? "—" : `${value.toFixed(1)}%`;

interface UpsellCategoryTabsProps {
  data: UpsellCategoriesResponse | null;
  loading?: boolean;
  error?: string | null;
  title?: string;
  subtitle?: string;
}

export const UpsellCategoryTabs: React.FC<UpsellCategoryTabsProps> = ({ 
  data, 
  loading, 
  error,
  title = "Upsell Attempts by Item",
  subtitle = "Explore greeting, cart, and upsizing performance by upsell item."
}) => {
  const { emit } = useCrossFilterEmitter();
  const [activeId, setActiveId] = useState<string | null>(null);

  const categories = data?.categories ?? [];

  const activeCategory = useMemo(() => {
    if (!categories.length) return null;
    if (activeId) return categories.find((c) => c.id === activeId) ?? categories[0];
    return categories[0];
  }, [categories, activeId]);

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 text-xs text-slate-400">
        Loading upsell performance…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-rose-100 text-xs text-rose-600">
        Failed to load upsell performance: {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 text-xs text-slate-400">
        No upsell category data available.
      </div>
    );
  }

  if (!categories.length) {
    return (
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 text-xs text-slate-400">
        No upsell categories found for the selected filters.
      </div>
    );
  }

  const summary = activeCategory?.summary;

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          {title && (
            <h2 className="text-sm font-semibold text-slate-900">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-[11px] text-slate-500">
              {subtitle}
            </p>
          )}
        </div>

        {/* Tabs */}
        <div className="inline-flex rounded-full bg-slate-100 p-1 text-[11px]">
          {categories.map((cat) => {
            const isActive = activeCategory?.id === cat.id;
            const sr = cat.summary?.successRate;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveId(cat.id)}
                className={[
                  "flex items-center gap-1 rounded-full px-3 py-1 transition",
                  isActive
                    ? "bg-white shadow-sm text-slate-900"
                    : "text-slate-500 hover:text-slate-900",
                ].join(" ")}
              >
                <span>{cat.label}</span>
                {sr != null && (
                  <span className="text-[10px] text-slate-400">
                    {sr.toFixed(1)}%
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary row for active category */}
      {summary && (
        <div className="grid gap-3 text-xs text-slate-600 md:grid-cols-3">
          <div className="rounded-xl bg-slate-50 px-3 py-2">
            <div className="text-[11px] uppercase tracking-wide text-slate-400">
              Attempts
            </div>
            <div className="text-sm font-semibold text-slate-900">
              {summary.attempts.toLocaleString()}
            </div>
          </div>
          <div className="rounded-xl bg-slate-50 px-3 py-2">
            <div className="text-[11px] uppercase tracking-wide text-slate-400">
              Success
            </div>
            <div className="text-sm font-semibold text-slate-900">
              {summary.success.toLocaleString()}
            </div>
          </div>
          <div className="rounded-xl bg-slate-50 px-3 py-2">
            <div className="text-[11px] uppercase tracking-wide text-slate-400">
              Success %
            </div>
            <div className="text-sm font-semibold text-emerald-600">
              {formatPercent(summary.successRate)}
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-slate-100">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          <div className="flex-1">Item</div>
          <div className="w-24 text-right">Attempts</div>
          <div className="w-24 text-right">Success</div>
          <div className="w-24 text-right">Success %</div>
        </div>
        <div className="max-h-60 overflow-y-auto text-xs">
          {activeCategory?.items.map((row) => (
            <button
              key={row.item}
              className="flex w-full items-center border-b border-slate-50 px-3 py-2 last:border-b-0 hover:bg-slate-50 transition"
              onClick={() =>
                emit("upsellCategory", row.item, `Upsell item: ${row.item}`)
              }
            >
              <div className="flex-1 text-left text-slate-700">
                {row.item}
              </div>
              <div className="w-24 text-right tabular-nums text-slate-600">
                {row.attempts.toLocaleString()}
              </div>
              <div className="w-24 text-right tabular-nums text-slate-600">
                {row.success.toLocaleString()}
              </div>
              <div className="w-24 text-right tabular-nums text-slate-700">
                {formatPercent(row.successRate)}
              </div>
            </button>
          ))}
          {!activeCategory?.items?.length && (
            <div className="px-3 py-4 text-[11px] text-slate-400">
              No items for this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

