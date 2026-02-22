import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, RefreshCw, AlertTriangle } from "lucide-react";

const PRESET_PATHS = [
  { label: "NFL Week 1", path: "nfl/official/trial/v7/en/games/2025/REG/01/schedule.json" },
  { label: "NBA Schedule", path: "nba/trial/v8/en/games/2025/01/15/schedule.json" },
  { label: "MLB Schedule", path: "mlb/trial/v7/en/games/2025/04/01/schedule.json" },
];

const SportsRadarTestPage = () => {
  const [path, setPath] = useState(PRESET_PATHS[0].path);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; status?: number } | null>(null);
  const [rawJson, setRawJson] = useState<string | null>(null);
  const [tableRows, setTableRows] = useState<Record<string, unknown>[]>([]);
  const [tableKeys, setTableKeys] = useState<string[]>([]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setTableRows([]);
    setTableKeys([]);
    setRawJson(null);

    try {
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sportradar-proxy`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ path }),
        }
      );

      const text = await resp.text();
      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      if (!resp.ok) {
        setError({
          message: typeof data === "object" ? data.error || JSON.stringify(data) : text,
          status: resp.status,
        });
        setRawJson(typeof data === "string" ? data : JSON.stringify(data, null, 2));
        return;
      }

      setRawJson(JSON.stringify(data, null, 2));

      // Auto-detect array data for table rendering
      const rows = findFirstArray(data);
      if (rows.length > 0) {
        const keys = extractKeys(rows.slice(0, 5));
        setTableKeys(keys);
        setTableRows(rows);
      }
    } catch (err) {
      setError({ message: err instanceof Error ? err.message : "Network error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">SportsRadar Proxy Test</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          POST to <code className="rounded bg-secondary px-1.5 py-0.5 text-xs font-mono">sportradar-proxy</code> with any SportsRadar API path
        </p>
      </div>

      {/* Preset buttons */}
      <div className="mb-4 flex flex-wrap gap-2">
        {PRESET_PATHS.map((p) => (
          <button
            key={p.path}
            onClick={() => setPath(p.path)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              path === p.path
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Custom path input */}
      <div className="mb-4 space-y-2">
        <Label htmlFor="path" className="text-xs font-medium">API Path</Label>
        <div className="flex gap-2">
          <Input
            id="path"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="nfl/official/trial/v7/en/games/..."
            className="font-mono text-xs"
          />
          <Button onClick={fetchData} disabled={loading || !path.trim()}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            {loading ? "Fetching…" : "Fetch"}
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground">
          Full URL: <code className="font-mono">https://api.sportradar.com/{path}</code>
        </p>
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4 space-y-1">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-sm font-semibold text-destructive">
              {error.status ? `Error ${error.status}` : "Error"}
            </span>
          </div>
          <p className="text-sm text-destructive/80">{error.message}</p>
        </div>
      )}

      {/* Table */}
      {tableRows.length > 0 && (
        <div className="mb-6 rounded-xl border border-border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {tableKeys.map((k) => (
                  <TableHead key={k} className="text-[10px] uppercase whitespace-nowrap">{k}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableRows.map((row, i) => (
                <TableRow key={i}>
                  {tableKeys.map((k) => (
                    <TableCell key={k} className="text-xs font-mono whitespace-nowrap max-w-[200px] truncate">
                      {renderCell(getNestedValue(row, k))}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="border-t border-border px-4 py-2">
            <span className="text-[10px] text-muted-foreground">{tableRows.length} row{tableRows.length !== 1 ? "s" : ""}</span>
          </div>
        </div>
      )}

      {tableRows.length === 0 && !loading && !error && rawJson && (
        <p className="mb-4 text-xs text-muted-foreground">No array data found to render as table — see raw JSON below</p>
      )}

      {!rawJson && !loading && !error && (
        <p className="text-sm text-muted-foreground py-8 text-center">
          Enter a path and click Fetch to test the proxy
        </p>
      )}

      {/* Raw JSON */}
      {rawJson && (
        <div>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Raw JSON</h2>
          <pre className="max-h-96 overflow-auto rounded-lg border border-border bg-secondary/50 p-4 text-[10px] font-mono text-muted-foreground">
            {rawJson}
          </pre>
        </div>
      )}
    </div>
  );
};

/** Recursively find the first array of objects in a JSON tree */
function findFirstArray(obj: any, depth = 0): Record<string, unknown>[] {
  if (depth > 5) return [];
  if (Array.isArray(obj) && obj.length > 0 && typeof obj[0] === "object") return obj;
  if (typeof obj === "object" && obj !== null) {
    for (const val of Object.values(obj)) {
      const found = findFirstArray(val, depth + 1);
      if (found.length > 0) return found;
    }
  }
  return [];
}

/** Extract flat keys from sample rows */
function extractKeys(rows: Record<string, unknown>[]): string[] {
  const keys = new Set<string>();
  rows.forEach((r) => {
    Object.entries(r).forEach(([k, v]) => {
      if (typeof v !== "object" || v === null) keys.add(k);
      else if (typeof v === "object" && !Array.isArray(v)) {
        // Flatten one level: e.g. home.name
        Object.entries(v as Record<string, unknown>).forEach(([sk, sv]) => {
          if (typeof sv !== "object" || sv === null) keys.add(`${k}.${sk}`);
        });
      }
    });
  });
  return Array.from(keys);
}

/** Get nested value via dot-path */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((curr, key) => {
    if (curr && typeof curr === "object" && key in (curr as Record<string, unknown>)) {
      return (curr as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

/** Render a cell value */
function renderCell(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export default SportsRadarTestPage;
