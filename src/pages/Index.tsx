import { useState } from "react";
import { type Sport } from "@/data/mockData";
import SportFilter from "@/components/SportFilter";

const GamesPage = () => {
  const [sport, setSport] = useState<Sport>("NBA");

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Today's Games</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Live scores & lines
        </p>
      </div>

      <div className="mb-5">
        <SportFilter active={sport} onChange={setSport} />
      </div>

      <p className="text-center text-sm text-muted-foreground py-12">
        No {sport} games scheduled today
      </p>
    </div>
  );
};

export default GamesPage;
