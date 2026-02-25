import type { Sport } from "@/data/mockData";

interface SportFilterProps {
  active: Sport;
  onChange: (sport: Sport) => void;
  sports?: Sport[];
}

const defaultSports: Sport[] = ["NBA", "NFL", "NCAAB", "NCAAF", "MLB", "NHL", "UFC", "PGA", "Soccer"];

const sportLabels: Record<Sport, string> = {
  NBA: "NBA",
  NFL: "NFL",
  NCAAB: "College BBall",
  NCAAF: "College FB",
  MLB: "MLB",
  NHL: "NHL",
  UFC: "UFC",
  PGA: "Golf",
  Soccer: "Soccer",
};

const SportFilter = ({ active, onChange, sports = defaultSports }: SportFilterProps) => {
  return (
    <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
      <div className="flex gap-1.5 w-max">
        {sports.map((sport) => (
          <button
            key={sport}
            onClick={() => onChange(sport)}
            className={
              active === sport
                ? "min-h-[44px] rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-all duration-200 whitespace-nowrap"
                : "min-h-[44px] rounded-full bg-secondary/60 px-4 py-2 text-xs font-medium text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground whitespace-nowrap"
            }
          >
            {sportLabels[sport]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SportFilter;
