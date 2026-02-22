import type { Sport } from "@/data/mockData";

interface SportFilterProps {
  active: Sport;
  onChange: (sport: Sport) => void;
  sports?: Sport[];
}

const defaultSports: Sport[] = ["NBA", "NFL", "NCAAB", "NCAAF", "MLB", "NHL"];

const sportLabels: Record<Sport, string> = {
  NBA: "NBA",
  NFL: "NFL",
  NCAAB: "College BBall",
  NCAAF: "College FB",
  MLB: "MLB",
  NHL: "NHL",
};

const SportFilter = ({ active, onChange, sports = defaultSports }: SportFilterProps) => {
  return (
    <div className="flex flex-wrap gap-1.5">
      {sports.map((sport) => (
        <button
          key={sport}
          onClick={() => onChange(sport)}
          className={
            active === sport
              ? "rounded-lg bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground transition-colors"
              : "rounded-lg bg-secondary px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          }
        >
          {sportLabels[sport]}
        </button>
      ))}
    </div>
  );
};

export default SportFilter;
