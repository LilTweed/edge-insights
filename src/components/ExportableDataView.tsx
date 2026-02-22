import { useRef, useState, useCallback } from "react";
import { toPng } from "html-to-image";
import { X, Camera, Download, Copy, Check } from "lucide-react";
import type { PropLine, Player, Game } from "@/data/mockData";
import { formatOdds } from "@/data/mockData";

// ─── CSV helpers ────────────────────────────────────────────────
const propsToCsv = (props: PropLine[]): string => {
  const header = "Player,Team,Stat,Line,Season Hit%,L10 Hit%,GP,FanDuel Over,FanDuel Under,DraftKings Over,DraftKings Under,Fanatics Over,Fanatics Under,BetMGM Over,BetMGM Under";
  const rows = props.map((p) => {
    const books = ["FanDuel", "DraftKings", "Fanatics", "BetMGM"];
    const bookCells = books.flatMap((b) => {
      const sb = p.sportsbooks.find((s) => s.sportsbook === b);
      return sb ? [formatOdds(sb.over), formatOdds(sb.under)] : ["—", "—"];
    });
    return [p.playerName, p.teamAbbr, p.stat, p.line, `${p.hitRate}%`, `${p.hitRateLast10}%`, p.gamesPlayed, ...bookCells].join(",");
  });
  return [header, ...rows].join("\n");
};

const downloadBlob = (content: string, filename: string, mime: string) => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

// ─── Types ──────────────────────────────────────────────────────
interface ExportableDataViewProps {
  open: boolean;
  onClose: () => void;
  title: string;
  props?: PropLine[];
  /** Optional extra content rendered inside the exportable area */
  children?: React.ReactNode;
}

const ExportableDataView = ({ open, onClose, title, props = [], children }: ExportableDataViewProps) => {
  const captureRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleScreenshot = useCallback(async () => {
    if (!captureRef.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(captureRef.current, {
        backgroundColor: "#ffffff",
        pixelRatio: 2,
        quality: 1,
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `lvrg-${title.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.png`;
      a.click();
    } catch (e) {
      console.error("Screenshot failed", e);
    } finally {
      setExporting(false);
    }
  }, [title]);

  const handleCsvExport = useCallback(() => {
    if (props.length === 0) return;
    const csv = propsToCsv(props);
    downloadBlob(csv, `lvrg-props-${Date.now()}.csv`, "text/csv");
  }, [props]);

  const handleCopyTable = useCallback(async () => {
    if (!captureRef.current) return;
    try {
      const text = captureRef.current.innerText;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Copy failed");
    }
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4 pt-12 animate-fade-in">
      <div className="relative w-full max-w-4xl rounded-2xl border border-border bg-card shadow-2xl animate-scale-in">
        {/* Toolbar */}
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-border bg-card px-5 py-3">
          <h2 className="text-sm font-bold text-foreground">📤 Export — {title}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleScreenshot}
              disabled={exporting}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Camera className="h-3.5 w-3.5" />
              {exporting ? "Saving…" : "Screenshot"}
            </button>
            {props.length > 0 && (
              <button
                onClick={handleCsvExport}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary/80 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                CSV
              </button>
            )}
            <button
              onClick={handleCopyTable}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary/80 transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button onClick={onClose} className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Capturable Area */}
        <div ref={captureRef} className="bg-white p-6">
          {/* Branding header for screenshot */}
          <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[hsl(213,56%,14%)] text-[10px] font-bold text-white">
                LV
              </div>
              <span className="text-sm font-bold text-gray-900">LVRG</span>
            </div>
            <span className="text-[10px] text-gray-400">{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
          </div>

          <h3 className="mb-3 text-base font-bold text-gray-900">{title}</h3>

          {/* Props Table */}
          {props.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-2 py-2 text-left font-semibold text-gray-600">Player</th>
                    <th className="px-2 py-2 text-left font-semibold text-gray-600">Stat</th>
                    <th className="px-2 py-2 text-right font-semibold text-gray-600">Line</th>
                    <th className="px-2 py-2 text-right font-semibold text-gray-600">Season</th>
                    <th className="px-2 py-2 text-right font-semibold text-gray-600">L10</th>
                    <th className="px-2 py-2 text-right font-semibold text-gray-600">GP</th>
                    {["FanDuel", "DraftKings", "Fanatics", "BetMGM"].map((b) => (
                      <th key={b} className="px-2 py-2 text-center font-semibold text-gray-600">{b}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {props.map((p) => (
                    <tr key={p.id} className="border-b border-gray-100">
                      <td className="px-2 py-2 font-medium text-gray-900">{p.playerName}</td>
                      <td className="px-2 py-2 text-gray-600">{p.stat}</td>
                      <td className="px-2 py-2 text-right font-mono font-bold text-gray-900">{p.line}</td>
                      <td className="px-2 py-2 text-right font-mono text-gray-700">{p.hitRate}%</td>
                      <td className="px-2 py-2 text-right font-mono text-gray-700">{p.hitRateLast10}%</td>
                      <td className="px-2 py-2 text-right font-mono text-gray-500">{p.gamesPlayed}</td>
                      {["FanDuel", "DraftKings", "Fanatics", "BetMGM"].map((b) => {
                        const sb = p.sportsbooks.find((s) => s.sportsbook === b);
                        return (
                          <td key={b} className="px-2 py-2 text-center font-mono text-[11px]">
                            {sb ? (
                              <span>
                                <span className="text-green-700">{formatOdds(sb.over)}</span>
                                {" / "}
                                <span className="text-red-700">{formatOdds(sb.under)}</span>
                              </span>
                            ) : "—"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {children}

          {/* Footer */}
          <div className="mt-4 border-t border-gray-200 pt-2 text-[9px] text-gray-400">
            Generated by LVRG · Hit rates reflect actual results, not projections · Data for informational purposes only
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportableDataView;
