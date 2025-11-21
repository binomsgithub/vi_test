import React from "react";
import { CallDateFilter, DateFilterOperator, DateFilterUnit } from "../../types/filters";

interface CallDateFilterProps {
  value: CallDateFilter;
  onChange: (next: CallDateFilter) => void;
}

const OPERATOR_OPTIONS: { value: DateFilterOperator; label: string }[] = [
  { value: "is_in_range", label: "is in range" },
  { value: "is_on_the_day", label: "is on the day" },
  { value: "is_before", label: "is before" },
  { value: "is_after", label: "is after" },
  { value: "is_on_or_after", label: "is on or after" },
  { value: "is_on_or_before", label: "is on or before" },
  { value: "is_in_the_last", label: "is in the last" },
  { value: "is_next", label: "is next" },
  { value: "is_previous", label: "is previous" },
  { value: "is_any_time", label: "is any time" },
  { value: "is_null", label: "is null" },
  { value: "is_not_null", label: "is not null" },
];

const UNIT_OPTIONS: { value: DateFilterUnit; label: string }[] = [
  { value: "days", label: "days" },
  { value: "weeks", label: "weeks" },
  { value: "months", label: "months" },
  { value: "years", label: "years" },
];

export const CallDateFilterControl: React.FC<CallDateFilterProps> = ({ value, onChange }) => {
  const handleOperatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const operator = e.target.value as DateFilterOperator;
    // reset fields that don't apply to the new operator
    const needsRelative = operator === "is_in_the_last" || operator === "is_next" || operator === "is_previous";
    onChange({
      operator,
      from: undefined,
      to: undefined,
      quantity: needsRelative ? 1 : undefined,
      unit: needsRelative ? "days" : undefined,
    });
  };

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, from: e.target.value });
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, to: e.target.value });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value === "" ? undefined : Number(e.target.value);
    onChange({ ...value, quantity: q });
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...value, unit: e.target.value as DateFilterUnit });
  };

  const op = value.operator;

  const showRange = op === "is_in_range";
  const showSingleDate =
    op === "is_on_the_day" ||
    op === "is_before" ||
    op === "is_after" ||
    op === "is_on_or_after" ||
    op === "is_on_or_before";
  const showRelative =
    op === "is_in_the_last" || op === "is_next" || op === "is_previous";
  const showNothingElse =
    op === "is_any_time" || op === "is_null" || op === "is_not_null";

  return (
    <label className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700">Call Date:</span>
      <div className="flex flex-wrap items-center gap-2 bg-white border border-gray-300 rounded px-2 py-1">
        {/* operator dropdown */}
        <select
          value={value.operator}
          onChange={handleOperatorChange}
          className="text-sm bg-transparent rounded px-2 py-1 border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          {OPERATOR_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* date inputs based on operator */}
        {showRange && (
          <div className="flex items-center gap-1 text-sm">
            <input
              type="date"
              value={value.from ?? ""}
              onChange={handleFromChange}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <span className="text-gray-500 text-xs">until (before)</span>
            <input
              type="date"
              value={value.to ?? ""}
              onChange={handleToChange}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        )}

        {showSingleDate && (
          <input
            type="date"
            value={value.from ?? ""}
            onChange={handleFromChange}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        )}

        {showRelative && (
          <div className="flex items-center gap-1 text-sm">
            {op === "is_in_the_last" && <span className="text-gray-500 text-xs">last</span>}
            <input
              type="number"
              min={1}
              value={value.quantity ?? ""}
              onChange={handleQuantityChange}
              placeholder="1"
              className="w-16 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <select
              value={value.unit ?? "days"}
              onChange={handleUnitChange}
              className="border border-gray-300 rounded px-2 py-1 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {UNIT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {showNothingElse && (
          <span className="text-xs text-gray-400 italic">
            {/* no extra inputs for these operators */}
          </span>
        )}
      </div>
    </label>
  );
};

