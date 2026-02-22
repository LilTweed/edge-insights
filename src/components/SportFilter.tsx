import type { Sport } from "@/data/mockData";

interface SportFilterProps {
  active: Sport;
  onChange: (sport: Sport) => void;
  sports?: Sport[];
}

const defaultSports: Sport[] = ["NBA", "NFL", "NCAAB", "NCAAF", "MLB", "NHL", "UFC", "PGA", "WNBA"];

const sportLabels: Record<Sport, string> = {
  NBA: "NBA",
  NFL: "NFL",
  NCAAB: "College BBall",
  NCAAF: "College FB",
  MLB: "MLB",
  NHL: "NHL",
  UFC: "UFC",
  PGA: "Golf",
  WNBA: "WNBA",
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
              ? "rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition-all duration-200"
              : "rounded-full bg-secondary/60 px-4 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground"
          }
        >
          {sportLabels[sport]}
        </button>
      ))}
    </div>
  );
};

export default SportFilter;
