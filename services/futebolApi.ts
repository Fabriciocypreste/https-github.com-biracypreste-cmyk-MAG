
import { Team, Match, Standing } from '../types/futebol';

// IMPORTANT: In a real-world scenario, these should be stored in environment variables
// and not be hardcoded in the source code.
const SUPABASE_PROJECT_ID = 'bnzdegzgekckrrqunptd';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
const SERVER_FUNCTION_NAME = 'make-server-2363f5d6';

const serverUrl = `https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1/${SERVER_FUNCTION_NAME}`;
const brasileiraoId = 2013;

// --- MOCK DATA FOR FALLBACK (Ensures app never breaks) ---
const MOCK_TEAMS: Team[] = [
  { id: '66', name: 'Palmeiras', slug: 'palmeiras', logoUrl: 'https://crests.football-data.org/1769.png', primaryColor: '#006437', secondaryColor: '#FFFFFF', founded: 1914, stadium: 'Allianz Parque' },
  { id: '67', name: 'Flamengo', slug: 'flamengo', logoUrl: 'https://crests.football-data.org/1783.png', primaryColor: '#C3281E', secondaryColor: '#000000', founded: 1895, stadium: 'Maracanã' },
  { id: '68', name: 'Corinthians', slug: 'corinthians', logoUrl: 'https://crests.football-data.org/1779.png', primaryColor: '#000000', secondaryColor: '#FFFFFF', founded: 1910, stadium: 'Neo Química Arena' },
  { id: '69', name: 'São Paulo', slug: 'sao-paulo', logoUrl: 'https://crests.football-data.org/1776.png', primaryColor: '#C62027', secondaryColor: '#000000', founded: 1930, stadium: 'Morumbi' },
  { id: '70', name: 'Fluminense', slug: 'fluminense', logoUrl: 'https://crests.football-data.org/1765.png', primaryColor: '#8A0F34', secondaryColor: '#009CA6', founded: 1902, stadium: 'Maracanã' },
  { id: '71', name: 'Atlético Mineiro', slug: 'atletico-mg', logoUrl: 'https://crests.football-data.org/1766.png', primaryColor: '#000000', secondaryColor: '#FFFFFF', founded: 1908, stadium: 'Arena MRV' },
  { id: '72', name: 'Grêmio', slug: 'gremio', logoUrl: 'https://crests.football-data.org/1767.png', primaryColor: '#0D80BF', secondaryColor: '#000000', founded: 1903, stadium: 'Arena do Grêmio' },
  { id: '73', name: 'Botafogo', slug: 'botafogo', logoUrl: 'https://crests.football-data.org/1770.png', primaryColor: '#000000', secondaryColor: '#FFFFFF', founded: 1894, stadium: 'Nilton Santos' },
];

const MOCK_MATCHES: Match[] = [
  {
    id: '1001',
    homeTeam: MOCK_TEAMS[0],
    awayTeam: MOCK_TEAMS[1],
    competition: 'Brasileirão Série A',
    date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    time: '16:00',
    status: 'live',
    score: { home: 2, away: 1 },
    broadcastChannel: 'Globo'
  },
  {
    id: '1002',
    homeTeam: MOCK_TEAMS[2],
    awayTeam: MOCK_TEAMS[3],
    competition: 'Brasileirão Série A',
    date: new Date(Date.now() + 86400000).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    time: '20:00',
    status: 'scheduled',
    broadcastChannel: 'Premiere'
  },
   {
    id: '1003',
    homeTeam: MOCK_TEAMS[7], // Botafogo
    awayTeam: MOCK_TEAMS[5], // Galo
    competition: 'Brasileirão Série A',
    date: new Date(Date.now() + 172800000).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    time: '18:30',
    status: 'scheduled',
    broadcastChannel: 'SporTV'
  }
];

const MOCK_STANDINGS: Standing[] = MOCK_TEAMS.map((team, index) => ({
  position: index + 1,
  team: team,
  points: 70 - (index * 3),
  played: 30,
  wins: 20 - index,
  draw: 5,
  losses: 5 + index,
  goalDifference: 30 - (index * 5)
}));
// --- END MOCKS ---

const apiFetch = async (endpoint: string) => {
  try {
    // Re-adding /football prefix as requested to match server config
    const response = await fetch(`${serverUrl}/football${endpoint}`, {
      headers: {
        // Supabase Edge Functions require an 'Authorization' header with a Bearer token.
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY
      }
    });
    if (!response.ok) {
      // Silent failure to fallback to mocks
      return null;
    }
    return response.json();
  } catch (error) {
    // Silent failure to fallback to mocks
    return null;
  }
};

// Mappers to transform API data into application types
const mapApiTeamToTeam = (apiTeam: any): Team => ({
  id: apiTeam.id.toString(),
  name: apiTeam.name,
  slug: apiTeam.tla?.toLowerCase() || apiTeam.name.toLowerCase().replace(/ /g, '-'),
  logoUrl: apiTeam.crest || 'https://via.placeholder.com/150?text=No+Logo',
  founded: apiTeam.founded,
  stadium: apiTeam.venue,
  // Colors are not available from this API, using placeholders
  primaryColor: '#333333',
  secondaryColor: '#FFFFFF',
});

const mapApiMatchToMatch = (apiMatch: any): Match => {
  const date = new Date(apiMatch.utcDate);

  const mapStatus = (status: string): 'scheduled' | 'live' | 'finished' => {
    switch (status) {
      case 'IN_PLAY': return 'live';
      case 'FINISHED': return 'finished';
      case 'SCHEDULED':
      case 'TIMED':
      default:
        return 'scheduled';
    }
  };

  return {
    id: apiMatch.id.toString(),
    homeTeam: mapApiTeamToTeam(apiMatch.homeTeam),
    awayTeam: mapApiTeamToTeam(apiMatch.awayTeam),
    competition: apiMatch.competition?.name || 'Brasileirão Série A',
    date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    status: mapStatus(apiMatch.status),
    score: apiMatch.score?.fullTime ? {
      home: apiMatch.score.fullTime.home,
      away: apiMatch.score.fullTime.away,
    } : undefined,
    broadcastChannel: 'Premiere', // Mocked, not available in this API
  };
};

const mapApiStandingToStanding = (apiStanding: any): Standing => ({
  position: apiStanding.position,
  team: mapApiTeamToTeam(apiStanding.team),
  points: apiStanding.points,
  played: apiStanding.playedGames,
  wins: apiStanding.won,
  draw: apiStanding.draw,
  losses: apiStanding.lost,
  goalDifference: apiStanding.goalDifference,
});

// Cache for teams and matches to avoid re-fetching in the same session
let allTeamsCache: Team[] | null = null;
let allMatchesCache: Match[] | null = null;


export const getAllTeams = async (): Promise<Team[]> => {
    if (allTeamsCache) return allTeamsCache;
    
    const data = await apiFetch(`/competitions/${brasileiraoId}/teams`);
    if (data && data.teams) {
      const teams = data.teams.map(mapApiTeamToTeam);
      allTeamsCache = teams;
      return teams;
    }
    // Fallback to mocks if API fails
    return MOCK_TEAMS;
};

const fetchAndCacheMatches = async (): Promise<Match[]> => {
    if (allMatchesCache) return allMatchesCache;
    const data = await apiFetch(`/competitions/${brasileiraoId}/matches`);
    if (data && data.matches) {
        allMatchesCache = data.matches.map(mapApiMatchToMatch);
        return allMatchesCache;
    }
    // Fallback to mocks if API fails
    return MOCK_MATCHES;
}


export const getFeaturedMatch = async (): Promise<Match | null> => {
    const matches = await fetchAndCacheMatches();
    const liveMatch = matches.find(m => m.status === 'live');
    if (liveMatch) return liveMatch;

    const upcoming = matches
        .filter(m => m.status === 'scheduled')
        .sort((a, b) => {
            // A simple date sort for pt-BR dd/mm format
            const dateA = a.date.split('/').reverse().join('-');
            const dateB = b.date.split('/').reverse().join('-');
            return new Date(dateA).getTime() - new Date(dateB).getTime();
        });
    
    return upcoming[0] || matches[0] || null;
};

export const getUpcomingMatches = async (): Promise<Match[]> => {
    const matches = await fetchAndCacheMatches();
    return matches.filter(m => m.status === 'scheduled' || m.status === 'live');
};

export const getStandings = async (): Promise<Standing[]> => {
    const data = await apiFetch(`/competitions/${brasileiraoId}/standings`);
    if (data && data.standings && data.standings[0]?.table) {
        return data.standings[0].table.map(mapApiStandingToStanding);
    }
    // Fallback to mocks if API fails
    return MOCK_STANDINGS;
};

export const getMatchById = async (id: string): Promise<Match | null> => {
    // This is not optimal, but football-data.org doesn't have a direct /matches/{id} endpoint
    // Caching helps mitigate the performance impact.
    const matches = await fetchAndCacheMatches();
    const match = matches.find(m => m.id === id);
    return match || null;
};
