import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type WeatherImpactFilter = "any" | "high" | "moderate" | "low" | "none";

export interface AdvancedFilters {
  teams: string[];
  players: string[];
  stats: string[];
  minHitRate: number;
  maxLine: number | null;
  minLine: number | null;
  weatherImpact: WeatherImpactFilter;
}

interface AdvancedSearchProps {
  availableTeams: string[];
  availablePlayers: string[];
  availableStats: string[];
  filters: AdvancedFilters;
  onChange: (filters: AdvancedFilters) => void;
}

const FilterPill = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
    {label}
    <button onClick={onRemove} className="hover:text-destructive transition-colors" aria-label={`Remove ${label}`}>
      <X size={10} />
    </button>
  </span>
);

const MultiSelect = ({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (val: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const filtered = options.filter((o) => o.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="relative flex-1 min-w-[180px]">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground hover:border-primary/40 transition-colors"
      >
        <span className="truncate text-left">
          {selected.length === 0
            ? label
            : `${selected.length} ${label.toLowerCase()} selected`}
        </span>
        {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-card shadow-lg">
          <div className="p-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={`Search ${label.toLowerCase()}…`}
              className="w-full rounded-md border border-border bg-secondary px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring/30"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto px-1 pb-2">
            {filtered.length === 0 && (
              <p className="px-2 py-3 text-center text-[11px] text-muted-foreground">No matches</p>
            )}
            {filtered.map((opt) => {
              const isSelected = selected.includes(opt);
              return (
                <button
                  key={opt}
                  onClick={() => onToggle(opt)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs transition-colors",
                    isSelected
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground hover:bg-secondary"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border text-[8px]",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border"
                    )}
                  >
                    {isSelected && "✓"}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const AdvancedSearch = ({
  availableTeams,
  availablePlayers,
  availableStats,
  filters,
  onChange,
}: AdvancedSearchProps) => {
  const [expanded, setExpanded] = useState(false);

  const toggle = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  const activeCount =
    filters.teams.length + filters.players.length + filters.stats.length +
    (filters.minHitRate > 0 ? 1 : 0) +
    (filters.minLine !== null ? 1 : 0) +
    (filters.maxLine !== null ? 1 : 0) +
    (filters.weatherImpact !== "any" ? 1 : 0);

  const clearAll = () =>
    onChange({ teams: [], players: [], stats: [], minHitRate: 0, minLine: null, maxLine: null, weatherImpact: "any" });

  const weatherOptions: { value: WeatherImpactFilter; label: string; color: string }[] = [
    { value: "any", label: "Any", color: "" },
    { value: "high", label: "🔴 High", color: "text-destructive" },
    { value: "moderate", label: "🟡 Moderate", color: "text-yellow-500" },
    { value: "low", label: "🟢 Low", color: "text-success" },
    { value: "none", label: "☀️ None", color: "text-muted-foreground" },
  ];

  return (
    <div className="rounded-xl border border-border bg-card">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors rounded-xl"
      >
        <span className="flex items-center gap-2">
          Advanced Filters
          {activeCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {activeCount}
            </span>
          )}
        </span>
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {expanded && (
        <div className="border-t border-border px-4 pb-4 pt-3 space-y-4 animate-fade-in">
          {/* Multi-select dropdowns */}
          <div className="flex flex-wrap gap-3">
            <MultiSelect
              label="Teams"
              options={availableTeams}
              selected={filters.teams}
              onToggle={(v) => onChange({ ...filters, teams: toggle(filters.teams, v) })}
            />
            <MultiSelect
              label="Players"
              options={availablePlayers}
              selected={filters.players}
              onToggle={(v) => onChange({ ...filters, players: toggle(filters.players, v) })}
            />
            <MultiSelect
              label="Stat Categories"
              options={availableStats}
              selected={filters.stats}
              onToggle={(v) => onChange({ ...filters, stats: toggle(filters.stats, v) })}
            />
          </div>

          {/* Numeric range filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary/30 px-2.5 py-1.5">
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">Min HR:</span>
              <input
                type="number"
                min={0}
                max={100}
                value={filters.minHitRate || ""}
                onChange={(e) => onChange({ ...filters, minHitRate: Number(e.target.value) || 0 })}
                placeholder="0"
                className="w-12 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
              />
              <span className="text-[10px] text-muted-foreground">%</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary/30 px-2.5 py-1.5">
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">Line:</span>
              <input
                type="number"
                value={filters.minLine ?? ""}
                onChange={(e) => onChange({ ...filters, minLine: e.target.value ? Number(e.target.value) : null })}
                placeholder="Min"
                className="w-12 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
              />
              <span className="text-[10px] text-muted-foreground">–</span>
              <input
                type="number"
                value={filters.maxLine ?? ""}
                onChange={(e) => onChange({ ...filters, maxLine: e.target.value ? Number(e.target.value) : null })}
                placeholder="Max"
                className="w-12 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary/30 px-2.5 py-1.5">
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">Weather:</span>
              <select
                value={filters.weatherImpact}
                onChange={(e) => onChange({ ...filters, weatherImpact: e.target.value as WeatherImpactFilter })}
                className="bg-transparent text-xs text-foreground outline-none cursor-pointer"
              >
                {weatherOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {activeCount > 0 && (
              <button
                onClick={clearAll}
                className="ml-auto text-[11px] font-medium text-destructive hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Active filter pills */}
          {activeCount > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {filters.teams.map((t) => (
                <FilterPill key={`t-${t}`} label={t} onRemove={() => onChange({ ...filters, teams: filters.teams.filter((x) => x !== t) })} />
              ))}
              {filters.players.map((p) => (
                <FilterPill key={`p-${p}`} label={p} onRemove={() => onChange({ ...filters, players: filters.players.filter((x) => x !== p) })} />
              ))}
              {filters.stats.map((s) => (
                <FilterPill key={`s-${s}`} label={s} onRemove={() => onChange({ ...filters, stats: filters.stats.filter((x) => x !== s) })} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
