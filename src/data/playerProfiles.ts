// Player physical profiles and avatar data

export interface PlayerProfile {
  id: string;
  name: string;
  position: string;
  number: number;
  height: string;
  weight: number;
  age: number;
  experience: number;
  draftYear: number;
  college?: string;
  nationality?: string;
  avatarEmoji: string;
  avatarUrl?: string; // Official headshot URL
}

const profiles: PlayerProfile[] = [
  // NBA — cdn.nba.com headshots
  { id: "lb23", name: "LeBron James", position: "SF", number: 23, height: "6'9\"", weight: 250, age: 41, experience: 22, draftYear: 2003, college: "St. Vincent-St. Mary HS", avatarEmoji: "👑", avatarUrl: "https://cdn.nba.com/headshots/nba/latest/260x190/2544.png" },
  { id: "ad3", name: "Anthony Davis", position: "PF/C", number: 3, height: "6'10\"", weight: 253, age: 32, experience: 13, draftYear: 2012, college: "Kentucky", avatarEmoji: "🏀", avatarUrl: "https://cdn.nba.com/headshots/nba/latest/260x190/203076.png" },
  { id: "jt0", name: "Jayson Tatum", position: "SF", number: 0, height: "6'8\"", weight: 210, age: 27, experience: 8, draftYear: 2017, college: "Duke", avatarEmoji: "☘️", avatarUrl: "https://cdn.nba.com/headshots/nba/latest/260x190/1628369.png" },
  { id: "jb7", name: "Jaylen Brown", position: "SG", number: 7, height: "6'6\"", weight: 223, age: 29, experience: 9, draftYear: 2016, college: "California", avatarEmoji: "🍀", avatarUrl: "https://cdn.nba.com/headshots/nba/latest/260x190/1627759.png" },
  { id: "sc30", name: "Steph Curry", position: "PG", number: 30, height: "6'2\"", weight: 185, age: 37, experience: 16, draftYear: 2009, college: "Davidson", avatarEmoji: "🎯", avatarUrl: "https://cdn.nba.com/headshots/nba/latest/260x190/201939.png" },
  { id: "nj15", name: "Nikola Jokic", position: "C", number: 15, height: "6'11\"", weight: 284, age: 30, experience: 10, draftYear: 2014, college: "N/A", nationality: "Serbia", avatarEmoji: "🃏", avatarUrl: "https://cdn.nba.com/headshots/nba/latest/260x190/203999.png" },
  { id: "le11", name: "Luka Doncic", position: "PG", number: 77, height: "6'7\"", weight: 230, age: 26, experience: 7, draftYear: 2018, nationality: "Slovenia", avatarEmoji: "🪄", avatarUrl: "https://cdn.nba.com/headshots/nba/latest/260x190/1629029.png" },
  { id: "ga34", name: "Giannis Antetokounmpo", position: "PF", number: 34, height: "6'11\"", weight: 243, age: 31, experience: 12, draftYear: 2013, nationality: "Greece", avatarEmoji: "🦌", avatarUrl: "https://cdn.nba.com/headshots/nba/latest/260x190/203507.png" },
  { id: "se1", name: "Shai Gilgeous-Alexander", position: "PG", number: 2, height: "6'6\"", weight: 195, age: 27, experience: 7, draftYear: 2018, college: "Kentucky", avatarEmoji: "⚡", avatarUrl: "https://cdn.nba.com/headshots/nba/latest/260x190/1628983.png" },
  { id: "dm25", name: "Donovan Mitchell", position: "SG", number: 45, height: "6'1\"", weight: 215, age: 28, experience: 8, draftYear: 2017, college: "Louisville", avatarEmoji: "🕷️", avatarUrl: "https://cdn.nba.com/headshots/nba/latest/260x190/1628378.png" },
  { id: "kd35", name: "Kevin Durant", position: "SF", number: 35, height: "6'10\"", weight: 240, age: 37, experience: 18, draftYear: 2007, college: "Texas", avatarEmoji: "🐍", avatarUrl: "https://cdn.nba.com/headshots/nba/latest/260x190/201142.png" },

  // NFL — ESPN headshots
  { id: "pm15", name: "Patrick Mahomes", position: "QB", number: 15, height: "6'3\"", weight: 230, age: 30, experience: 8, draftYear: 2017, college: "Texas Tech", avatarEmoji: "🏈", avatarUrl: "https://a.espncdn.com/i/headshots/nfl/players/full/3139477.png" },
  { id: "ja17", name: "Josh Allen", position: "QB", number: 17, height: "6'5\"", weight: 237, age: 29, experience: 7, draftYear: 2018, college: "Wyoming", avatarEmoji: "🦬", avatarUrl: "https://a.espncdn.com/i/headshots/nfl/players/full/3918298.png" },
  { id: "lj8", name: "Lamar Jackson", position: "QB", number: 8, height: "6'2\"", weight: 212, age: 29, experience: 7, draftYear: 2018, college: "Louisville", avatarEmoji: "🦅", avatarUrl: "https://a.espncdn.com/i/headshots/nfl/players/full/3916387.png" },
  { id: "jh10", name: "Tyreek Hill", position: "WR", number: 10, height: "5'10\"", weight: 191, age: 32, experience: 9, draftYear: 2016, college: "West Alabama", avatarEmoji: "🐆", avatarUrl: "https://a.espncdn.com/i/headshots/nfl/players/full/3116406.png" },
  { id: "dh4", name: "Derrick Henry", position: "RB", number: 22, height: "6'3\"", weight: 247, age: 32, experience: 9, draftYear: 2016, college: "Alabama", avatarEmoji: "🚂", avatarUrl: "https://a.espncdn.com/i/headshots/nfl/players/full/3043078.png" },
  { id: "cm1", name: "Ja'Marr Chase", position: "WR", number: 1, height: "6'0\"", weight: 201, age: 25, experience: 4, draftYear: 2021, college: "LSU", avatarEmoji: "🐅", avatarUrl: "https://a.espncdn.com/i/headshots/nfl/players/full/4362628.png" },
  { id: "jj99", name: "J.J. Watt", position: "DE", number: 99, height: "6'5\"", weight: 288, age: 36, experience: 12, draftYear: 2011, college: "Wisconsin", avatarEmoji: "💪", avatarUrl: "https://a.espncdn.com/i/headshots/nfl/players/full/13982.png" },

  // MLB — MLB CDN
  { id: "aj99", name: "Aaron Judge", position: "RF", number: 99, height: "6'7\"", weight: 282, age: 33, experience: 9, draftYear: 2013, college: "Fresno State", avatarEmoji: "⚾", avatarUrl: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/592450/headshot/67/current" },
  { id: "so17", name: "Shohei Ohtani", position: "DH", number: 17, height: "6'4\"", weight: 210, age: 31, experience: 8, draftYear: 2018, nationality: "Japan", avatarEmoji: "⭐", avatarUrl: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/660271/headshot/67/current" },
  { id: "mt27", name: "Mike Trout", position: "CF", number: 27, height: "6'2\"", weight: 235, age: 34, experience: 14, draftYear: 2009, college: "Millville HS", avatarEmoji: "🎣", avatarUrl: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/545361/headshot/67/current" },
  { id: "gc28", name: "Gerrit Cole", position: "SP", number: 45, height: "6'4\"", weight: 220, age: 35, experience: 12, draftYear: 2011, college: "UCLA", avatarEmoji: "🔥", avatarUrl: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/543037/headshot/67/current" },
  { id: "ra45", name: "Spencer Strider", position: "SP", number: 65, height: "6'0\"", weight: 195, age: 26, experience: 3, draftYear: 2020, college: "Clemson", avatarEmoji: "💨", avatarUrl: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/675911/headshot/67/current" },
  { id: "fs27", name: "Freddie Freeman", position: "1B", number: 5, height: "6'5\"", weight: 220, age: 36, experience: 15, draftYear: 2007, avatarEmoji: "🏅", avatarUrl: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/518692/headshot/67/current" },
  { id: "ra22", name: "Ronald Acuna Jr.", position: "RF", number: 13, height: "6'0\"", weight: 205, age: 28, experience: 7, draftYear: 2014, nationality: "Venezuela", avatarEmoji: "💥", avatarUrl: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/660670/headshot/67/current" },

  // NHL — NHL CDN
  { id: "cm97", name: "Connor McDavid", position: "C", number: 97, height: "6'1\"", weight: 193, age: 29, experience: 11, draftYear: 2015, nationality: "Canada", avatarEmoji: "🏒", avatarUrl: "https://cms.nhl.bamgrid.com/images/headshots/current/168x168/8478402.jpg" },
  { id: "nk86", name: "Nikita Kucherov", position: "RW", number: 86, height: "5'11\"", weight: 178, age: 32, experience: 11, draftYear: 2011, nationality: "Russia", avatarEmoji: "⚡", avatarUrl: "https://cms.nhl.bamgrid.com/images/headshots/current/168x168/8476453.jpg" },
  { id: "am34", name: "Auston Matthews", position: "C", number: 34, height: "6'3\"", weight: 208, age: 28, experience: 10, draftYear: 2016, nationality: "USA", avatarEmoji: "🍁", avatarUrl: "https://cms.nhl.bamgrid.com/images/headshots/current/168x168/8479318.jpg" },
  { id: "lm8", name: "Cale Makar", position: "D", number: 8, height: "5'11\"", weight: 187, age: 27, experience: 6, draftYear: 2017, college: "UMass", nationality: "Canada", avatarEmoji: "🏔️", avatarUrl: "https://cms.nhl.bamgrid.com/images/headshots/current/168x168/8480069.jpg" },
  { id: "dk71", name: "David Pastrnak", position: "RW", number: 88, height: "6'0\"", weight: 194, age: 29, experience: 10, draftYear: 2014, nationality: "Czech Republic", avatarEmoji: "🍝", avatarUrl: "https://cms.nhl.bamgrid.com/images/headshots/current/168x168/8477956.jpg" },

  // Soccer — ESPN
  { id: "eh9", name: "Erling Haaland", position: "ST", number: 9, height: "6'5\"", weight: 194, age: 25, experience: 7, draftYear: 0, nationality: "Norway", avatarEmoji: "🤖", avatarUrl: "https://a.espncdn.com/i/headshots/soccer/players/full/253288.png" },
  { id: "ms11", name: "Mohamed Salah", position: "RW", number: 11, height: "5'9\"", weight: 157, age: 33, experience: 14, draftYear: 0, nationality: "Egypt", avatarEmoji: "👑", avatarUrl: "https://a.espncdn.com/i/headshots/soccer/players/full/153345.png" },
  { id: "bs7", name: "Bukayo Saka", position: "RW", number: 7, height: "5'10\"", weight: 159, age: 24, experience: 6, draftYear: 0, nationality: "England", avatarEmoji: "⭐", avatarUrl: "https://a.espncdn.com/i/headshots/soccer/players/full/247582.png" },
  { id: "km10", name: "Kylian Mbappe", position: "ST", number: 10, height: "5'10\"", weight: 161, age: 27, experience: 10, draftYear: 0, nationality: "France", avatarEmoji: "🐢", avatarUrl: "https://a.espncdn.com/i/headshots/soccer/players/full/231388.png" },

  // UFC — ESPN MMA
  { id: "im1", name: "Islam Makhachev", position: "LW", number: 0, height: "5'10\"", weight: 155, age: 33, experience: 11, draftYear: 0, nationality: "Russia", avatarEmoji: "🦅", avatarUrl: "https://a.espncdn.com/i/headshots/mma/players/full/2969014.png" },
  { id: "co1", name: "Charles Oliveira", position: "LW", number: 0, height: "5'10\"", weight: 155, age: 35, experience: 15, draftYear: 0, nationality: "Brazil", avatarEmoji: "🇧🇷", avatarUrl: "https://a.espncdn.com/i/headshots/mma/players/full/2335683.png" },
  { id: "aj1", name: "Alex Pereira", position: "LHW", number: 0, height: "6'4\"", weight: 205, age: 38, experience: 6, draftYear: 0, nationality: "Brazil", avatarEmoji: "👊", avatarUrl: "https://a.espncdn.com/i/headshots/mma/players/full/4697263.png" },
  { id: "im2", name: "Israel Adesanya", position: "MW", number: 0, height: "6'4\"", weight: 185, age: 36, experience: 7, draftYear: 0, nationality: "New Zealand", avatarEmoji: "🎭", avatarUrl: "https://a.espncdn.com/i/headshots/mma/players/full/3985632.png" },
];

const profileMap = new Map(profiles.map((p) => [p.id, p]));

export function getPlayerProfile(playerId: string): PlayerProfile | undefined {
  return profileMap.get(playerId);
}

export function getInitials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}
