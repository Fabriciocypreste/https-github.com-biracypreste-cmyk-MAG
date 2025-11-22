
export interface Team {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  primaryColor?: string;
  secondaryColor?: string;
  founded?: number;
  stadium?: string;
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

export interface Player {
  id: string;
  name: string;
  position: string;
  photoUrl: string;
  teamId: string;
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
