import { useState, useEffect } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import UpgradeGate from "@/components/UpgradeGate";
import { type Sport } from "@/data/mockData";
import SportFilter from "@/components/SportFilter";
import { Search, Plus, Trash2, StickyNote, X, Heart } from "lucide-react";
import FavoritesSection from "@/components/FavoritesSection";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface StatNote {
  id: string;
  title: string;
  body: string;
  sport: Sport;
  timestamp: number;
  tags: string[];
}

export default function StatNotesPage() {
  const { tier, isAdvanced: hasAdvanced } = useSubscription();
  const [sport, setSport] = useState<Sport>("NBA");
  const [notes, setNotes] = useState<StatNote[]>(() => {
    try { return JSON.parse(localStorage.getItem("lvrg-stat-notes") || "[]"); } catch { return []; }
  });
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteBody, setNewNoteBody] = useState("");
  const [newNoteTags, setNewNoteTags] = useState("");
  const [noteSearch, setNoteSearch] = useState("");
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);
  const [noteSportFilter, setNoteSportFilter] = useState<Sport | "ALL">("ALL");

  useEffect(() => { localStorage.setItem("lvrg-stat-notes", JSON.stringify(notes)); }, [notes]);

  const addNote = () => {
    if (!newNoteTitle.trim()) return;
    const note: StatNote = {
      id: Date.now().toString(),
      title: newNoteTitle.trim(),
      body: newNoteBody.trim(),
      sport,
      timestamp: Date.now(),
      tags: newNoteTags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    setNotes((prev) => [note, ...prev]);
    setNewNoteTitle("");
    setNewNoteBody("");
    setNewNoteTags("");
  };

  const deleteNote = (id: string) => setNotes((prev) => prev.filter((n) => n.id !== id));

  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags)));
  const filteredNotes = notes.filter((n) => {
    if (noteSportFilter !== "ALL" && n.sport !== noteSportFilter) return false;
    if (activeTagFilter && !n.tags.includes(activeTagFilter)) return false;
    if (noteSearch) {
      const q = noteSearch.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q) || n.tags.some((t) => t.toLowerCase().includes(q));
    }
    return true;
  });

  if (!hasAdvanced) {
    return (
      <div className="container py-10">
        <UpgradeGate requiredTier="advanced" currentTier={tier} feature="Stat Notes">
          <div />
        </UpgradeGate>
      </div>
    );
  }

  return (
    <div className="container flex h-[calc(100vh-3.5rem)] flex-col py-4">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <StickyNote size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Notes & Favorites</h1>
            <p className="text-xs text-muted-foreground">Save observations & track your favorites</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="favorites" className="flex flex-1 flex-col overflow-hidden">
        <TabsList className="w-fit mb-3">
          <TabsTrigger value="favorites" className="gap-1.5 min-h-[44px]">
            <Heart size={14} /> Favorites
          </TabsTrigger>
          <TabsTrigger value="notes" className="gap-1.5 min-h-[44px]">
            <StickyNote size={14} /> Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="favorites" className="flex-1 overflow-auto mt-0">
          <FavoritesSection />
        </TabsContent>

        <TabsContent value="notes" className="flex-1 flex flex-col overflow-hidden mt-0">

      <div className="mb-3">
        <SportFilter active={sport} onChange={setSport} />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card/50">
        {/* New note form */}
        <div className="border-b border-border p-4 space-y-2">
          <input
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
            placeholder="Note title… e.g. 'Tatum averaging +4 PTS in last 5'"
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
          <textarea
            value={newNoteBody}
            onChange={(e) => setNewNoteBody(e.target.value)}
            placeholder="Details, reasoning, observations…"
            rows={2}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 resize-none"
          />
          <div className="flex items-center gap-2">
            <input
              value={newNoteTags}
              onChange={(e) => setNewNoteTags(e.target.value)}
              placeholder="Tags (comma separated)… e.g. trending, over"
              className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
            <button
              onClick={addNote}
              disabled={!newNoteTitle.trim()}
              className="inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Plus size={14} />
              Save
            </button>
          </div>
        </div>

        {/* Search & filter bar */}
        <div className="border-b border-border px-4 py-2.5 space-y-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={noteSearch}
                onChange={(e) => setNoteSearch(e.target.value)}
                placeholder="Search notes…"
                className="w-full rounded-lg border border-border bg-card pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>
            <select
              value={noteSportFilter}
              onChange={(e) => setNoteSportFilter(e.target.value as Sport | "ALL")}
              className="rounded-lg border border-border bg-card px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
            >
              <option value="ALL">All Sports</option>
              {(["NBA", "NFL", "MLB", "NHL", "NCAAB", "NCAAF", "LOL", "CS2", "VAL"] as Sport[]).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {activeTagFilter && (
                <button
                  onClick={() => setActiveTagFilter(null)}
                  className="rounded-full border border-destructive/30 bg-destructive/10 px-2 py-0.5 text-[9px] font-medium text-destructive hover:bg-destructive/20 transition-colors"
                >
                  ✕ Clear
                </button>
              )}
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTagFilter(activeTagFilter === tag ? null : tag)}
                  className={`rounded-full border px-2 py-0.5 text-[9px] font-medium transition-colors ${
                    activeTagFilter === tag
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
          <div className="text-[10px] text-muted-foreground">
            {filteredNotes.length} of {notes.length} note{notes.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Notes list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredNotes.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
              <StickyNote size={28} className="text-muted-foreground/40" />
              <p className="text-xs text-muted-foreground">
                {notes.length === 0 ? "No notes yet — add observations, trends, and stat notes above" : "No notes match your filters"}
              </p>
            </div>
          )}
          {filteredNotes.map((note) => (
            <div key={note.id} className="rounded-xl border border-border bg-card p-3.5 animate-fade-in">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="rounded bg-secondary px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground">{note.sport}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(note.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-foreground">{note.title}</h4>
                  {note.body && <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{note.body}</p>}
                  {note.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {note.tags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setActiveTagFilter(tag)}
                          className={`rounded-full border px-2 py-0.5 text-[9px] font-medium transition-colors cursor-pointer ${
                            activeTagFilter === tag
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={() => deleteNote(note.id)} className="rounded p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
