
export interface Team {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  primaryColor?: string;
  secondaryColor?: string;
  founded?: number;
  stadium?: string;
  // New fields from SportsDB
  bannerUrl?: string;
  description?: string;
  stadiumThumb?: string;
  stadiumCapacity?: string;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  competition: string;
  date: string;
  time: string;
  status: 'scheduled' | 'live' | 'finished';
  score?: { home: number; away: number };
  broadcastChannel?: string;
}

export interface SportsDbPlayer {
    idPlayer: string;
    strPlayer: string;
    strPosition: string;
    strCutout: string; // cutout photo
    strNumber?: string;
}

export interface Scorer {
  id: string;
  name: string;
  team: string;
  teamLogoUrl?: string;
  goals: number;
  matches: number;
  photoUrl?: string;
}

export interface Standing {
  position: number;
  team: Team;
  points: number;
  played: number;
  wins: number;
  draw: number;
  losses: number;
  goalDifference: number;
}

export interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    description: string;
    thumbnail: string;
    category: string;
}
