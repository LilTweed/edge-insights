// Player physical profiles and avatar data

export interface PlayerProfile {
  id: string;
  name: string;
  position: string;
  number: number;
  height: string;      // e.g. "6'9\""
  weight: number;      // lbs
  age: number;
  experience: number;  // years in league
  draftYear: number;
  college?: string;
  nationality?: string;
  avatarEmoji: string; // Fallback emoji icon
}

const profiles: PlayerProfile[] = [
  // NBA
  { id: "lb23", name: "LeBron James", position: "SF", number: 23, height: "6'9\"", weight: 250, age: 41, experience: 22, draftYear: 2003, college: "St. Vincent-St. Mary HS", avatarEmoji: "👑" },
  { id: "ad3", name: "Anthony Davis", position: "PF/C", number: 3, height: "6'10\"", weight: 253, age: 32, experience: 13, draftYear: 2012, college: "Kentucky", avatarEmoji: "🏀" },
  { id: "jt0", name: "Jayson Tatum", position: "SF", number: 0, height: "6'8\"", weight: 210, age: 27, experience: 8, draftYear: 2017, college: "Duke", avatarEmoji: "☘️" },
  { id: "jb7", name: "Jaylen Brown", position: "SG", number: 7, height: "6'6\"", weight: 223, age: 29, experience: 9, draftYear: 2016, college: "California", avatarEmoji: "🍀" },
  { id: "sc30", name: "Steph Curry", position: "PG", number: 30, height: "6'2\"", weight: 185, age: 37, experience: 16, draftYear: 2009, college: "Davidson", avatarEmoji: "🎯" },
  { id: "nj15", name: "Nikola Jokic", position: "C", number: 15, height: "6'11\"", weight: 284, age: 30, experience: 10, draftYear: 2014, college: "N/A", nationality: "Serbia", avatarEmoji: "🃏" },
  { id: "le11", name: "Luka Doncic", position: "PG", number: 77, height: "6'7\"", weight: 230, age: 26, experience: 7, draftYear: 2018, nationality: "Slovenia", avatarEmoji: "🪄" },
  { id: "ga34", name: "Giannis Antetokounmpo", position: "PF", number: 34, height: "6'11\"", weight: 243, age: 31, experience: 12, draftYear: 2013, nationality: "Greece", avatarEmoji: "🦌" },
  { id: "se1", name: "Shai Gilgeous-Alexander", position: "PG", number: 2, height: "6'6\"", weight: 195, age: 27, experience: 7, draftYear: 2018, college: "Kentucky", avatarEmoji: "⚡" },
  { id: "dm25", name: "Donovan Mitchell", position: "SG", number: 45, height: "6'1\"", weight: 215, age: 28, experience: 8, draftYear: 2017, college: "Louisville", avatarEmoji: "🕷️" },
  { id: "kd35", name: "Kevin Durant", position: "SF", number: 35, height: "6'10\"", weight: 240, age: 37, experience: 18, draftYear: 2007, college: "Texas", avatarEmoji: "🐍" },

  // NFL
  { id: "pm15", name: "Patrick Mahomes", position: "QB", number: 15, height: "6'3\"", weight: 230, age: 30, experience: 8, draftYear: 2017, college: "Texas Tech", avatarEmoji: "🏈" },
  { id: "ja17", name: "Josh Allen", position: "QB", number: 17, height: "6'5\"", weight: 237, age: 29, experience: 7, draftYear: 2018, college: "Wyoming", avatarEmoji: "🦬" },
  { id: "lj8", name: "Lamar Jackson", position: "QB", number: 8, height: "6'2\"", weight: 212, age: 29, experience: 7, draftYear: 2018, college: "Louisville", avatarEmoji: "🦅" },
  { id: "jh10", name: "Tyreek Hill", position: "WR", number: 10, height: "5'10\"", weight: 191, age: 32, experience: 9, draftYear: 2016, college: "West Alabama", avatarEmoji: "🐆" },
  { id: "dh4", name: "Derrick Henry", position: "RB", number: 22, height: "6'3\"", weight: 247, age: 32, experience: 9, draftYear: 2016, college: "Alabama", avatarEmoji: "🚂" },
  { id: "cm1", name: "Ja'Marr Chase", position: "WR", number: 1, height: "6'0\"", weight: 201, age: 25, experience: 4, draftYear: 2021, college: "LSU", avatarEmoji: "🐅" },
  { id: "jj99", name: "J.J. Watt", position: "DE", number: 99, height: "6'5\"", weight: 288, age: 36, experience: 12, draftYear: 2011, college: "Wisconsin", avatarEmoji: "💪" },

  // MLB
  { id: "aj99", name: "Aaron Judge", position: "RF", number: 99, height: "6'7\"", weight: 282, age: 33, experience: 9, draftYear: 2013, college: "Fresno State", avatarEmoji: "⚾" },
  { id: "so17", name: "Shohei Ohtani", position: "DH", number: 17, height: "6'4\"", weight: 210, age: 31, experience: 8, draftYear: 2018, nationality: "Japan", avatarEmoji: "⭐" },
  { id: "mt27", name: "Mike Trout", position: "CF", number: 27, height: "6'2\"", weight: 235, age: 34, experience: 14, draftYear: 2009, college: "Millville HS", avatarEmoji: "🎣" },
  { id: "gc28", name: "Gerrit Cole", position: "SP", number: 45, height: "6'4\"", weight: 220, age: 35, experience: 12, draftYear: 2011, college: "UCLA", avatarEmoji: "🔥" },
  { id: "ra45", name: "Spencer Strider", position: "SP", number: 65, height: "6'0\"", weight: 195, age: 26, experience: 3, draftYear: 2020, college: "Clemson", avatarEmoji: "💨" },
  { id: "fs27", name: "Freddie Freeman", position: "1B", number: 5, height: "6'5\"", weight: 220, age: 36, experience: 15, draftYear: 2007, avatarEmoji: "🏅" },
  { id: "ra22", name: "Ronald Acuna Jr.", position: "RF", number: 13, height: "6'0\"", weight: 205, age: 28, experience: 7, draftYear: 2014, nationality: "Venezuela", avatarEmoji: "💥" },

  // NHL
  { id: "cm97", name: "Connor McDavid", position: "C", number: 97, height: "6'1\"", weight: 193, age: 29, experience: 11, draftYear: 2015, nationality: "Canada", avatarEmoji: "🏒" },
  { id: "nk86", name: "Nikita Kucherov", position: "RW", number: 86, height: "5'11\"", weight: 178, age: 32, experience: 11, draftYear: 2011, nationality: "Russia", avatarEmoji: "⚡" },
  { id: "am34", name: "Auston Matthews", position: "C", number: 34, height: "6'3\"", weight: 208, age: 28, experience: 10, draftYear: 2016, nationality: "USA", avatarEmoji: "🍁" },
  { id: "lm8", name: "Cale Makar", position: "D", number: 8, height: "5'11\"", weight: 187, age: 27, experience: 6, draftYear: 2017, college: "UMass", nationality: "Canada", avatarEmoji: "🏔️" },
  { id: "dk71", name: "David Pastrnak", position: "RW", number: 88, height: "6'0\"", weight: 194, age: 29, experience: 10, draftYear: 2014, nationality: "Czech Republic", avatarEmoji: "🍝" },

  // Soccer
  { id: "eh9", name: "Erling Haaland", position: "ST", number: 9, height: "6'5\"", weight: 194, age: 25, experience: 7, draftYear: 0, nationality: "Norway", avatarEmoji: "🤖" },
  { id: "ms11", name: "Mohamed Salah", position: "RW", number: 11, height: "5'9\"", weight: 157, age: 33, experience: 14, draftYear: 0, nationality: "Egypt", avatarEmoji: "👑" },
  { id: "bs7", name: "Bukayo Saka", position: "RW", number: 7, height: "5'10\"", weight: 159, age: 24, experience: 6, draftYear: 0, nationality: "England", avatarEmoji: "⭐" },
  { id: "km10", name: "Kylian Mbappe", position: "ST", number: 10, height: "5'10\"", weight: 161, age: 27, experience: 10, draftYear: 0, nationality: "France", avatarEmoji: "🐢" },

  // UFC
  { id: "im1", name: "Islam Makhachev", position: "LW", number: 0, height: "5'10\"", weight: 155, age: 33, experience: 11, draftYear: 0, nationality: "Russia", avatarEmoji: "🦅" },
  { id: "co1", name: "Charles Oliveira", position: "LW", number: 0, height: "5'10\"", weight: 155, age: 35, experience: 15, draftYear: 0, nationality: "Brazil", avatarEmoji: "🇧🇷" },
  { id: "aj1", name: "Alex Pereira", position: "LHW", number: 0, height: "6'4\"", weight: 205, age: 38, experience: 6, draftYear: 0, nationality: "Brazil", avatarEmoji: "👊" },
  { id: "im2", name: "Israel Adesanya", position: "MW", number: 0, height: "6'4\"", weight: 185, age: 36, experience: 7, draftYear: 0, nationality: "New Zealand", avatarEmoji: "🎭" },
];

const profileMap = new Map(profiles.map((p) => [p.id, p]));

export function getPlayerProfile(playerId: string): PlayerProfile | undefined {
  return profileMap.get(playerId);
}

export function getInitials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}
