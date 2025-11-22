import { Team, Match, Standing, NewsItem, SportsDbPlayer } from '../types/futebol';

// IMPORTANT: In a real-world scenario, these should be stored in environment variables
// and not be hardcoded in the source code.
const SUPABASE_PROJECT_ID = 'bnzdegzgekckrrqunptd';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
const SERVER_FUNCTION_NAME = 'make-server-2363f5d6';

const serverUrl = `https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1/${SERVER_FUNCTION_NAME}`;
const brasileiraoId = 2013;

// --- MOCK DATA FOR FALLBACK (Ensures app never breaks) ---
const MOCK_TEAMS: Team[] = [
  { id: '1766', name: 'Atlético Mineiro', slug: 'atletico-mg', logoUrl: 'https://crests.football-data.org/1766.png', primaryColor: '#000000', secondaryColor: '#FFFFFF', founded: 1908, stadium: 'Arena MRV' },
  { id: '1773', name: 'Bahia', slug: 'bahia', logoUrl: 'https://crests.football-data.org/1773.png', primaryColor: '#0088CC', secondaryColor: '#FFFFFF', founded: 1931, stadium: 'Arena Fonte Nova' },
  { id: '1770', name: 'Botafogo', slug: 'botafogo', logoUrl: 'https://crests.football-data.org/1770.png', primaryColor: '#000000', secondaryColor: '#FFFFFF', founded: 1894, stadium: 'Nilton Santos' },
  { id: '4291', name: 'Ceará', slug: 'ceara', logoUrl: 'https://crests.football-data.org/4291.png', primaryColor: '#000000', secondaryColor: '#FFFFFF', founded: 1914, stadium: 'Castelão' },
  { id: '1779', name: 'Corinthians', slug: 'corinthians', logoUrl: 'https://crests.football-data.org/1779.png', primaryColor: '#000000', secondaryColor: '#FFFFFF', founded: 1910, stadium: 'Neo Química Arena' },
  { id: '1775', name: 'Cruzeiro', slug: 'cruzeiro', logoUrl: 'https://crests.football-data.org/1775.png', primaryColor: '#003A94', secondaryColor: '#FFFFFF', founded: 1921, stadium: 'Mineirão' },
  { id: '1783', name: 'Flamengo', slug: 'flamengo', logoUrl: 'https://crests.football-data.org/1783.png', primaryColor: '#C3281E', secondaryColor: '#000000', founded: 1895, stadium: 'Maracanã' },
  { id: '1765', name: 'Fluminense', slug: 'fluminense', logoUrl: 'https://crests.football-data.org/1765.png', primaryColor: '#8A0F34', secondaryColor: '#009CA6', founded: 1902, stadium: 'Maracanã' },
  { id: '1768', name: 'Fortaleza', slug: 'fortaleza', logoUrl: 'https://crests.football-data.org/1768.png', primaryColor: '#1D4F99', secondaryColor: '#E21E26', founded: 1918, stadium: 'Castelão' },
  { id: '1767', name: 'Grêmio', slug: 'gremio', logoUrl: 'https://crests.football-data.org/1767.png', primaryColor: '#0D80BF', secondaryColor: '#000000', founded: 1903, stadium: 'Arena do Grêmio' },
  { id: '1785', name: 'Internacional', slug: 'internacional', logoUrl: 'https://crests.football-data.org/1785.png', primaryColor: '#C8102E', secondaryColor: '#FFFFFF', founded: 1909, stadium: 'Beira-Rio' },
  { id: '4289', name: 'Juventude', slug: 'juventude', logoUrl: 'https://crests.football-data.org/4289.svg', primaryColor: '#009444', secondaryColor: '#FFFFFF', founded: 1913, stadium: 'Alfredo Jaconi' },
  { id: '6001', name: 'Mirassol', slug: 'mirassol', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Mirassol_Futebol_Clube_logo.svg', primaryColor: '#FDD116', secondaryColor: '#006437', founded: 1925, stadium: 'Maião' },
  { id: '1769', name: 'Palmeiras', slug: 'palmeiras', logoUrl: 'https://crests.football-data.org/1769.svg', primaryColor: '#006437', secondaryColor: '#FFFFFF', founded: 1914, stadium: 'Allianz Parque' },
  { id: '6676', name: 'Red Bull Bragantino', slug: 'bragantino', logoUrl: 'https://crests.football-data.org/6676.png', primaryColor: '#E30613', secondaryColor: '#FFFFFF', founded: 1928, stadium: 'Nabi Abi Chedid' },
  { id: '1777', name: 'Santos', slug: 'santos', logoUrl: 'https://crests.football-data.org/1777.png', primaryColor: '#000000', secondaryColor: '#FFFFFF', founded: 1912, stadium: 'Vila Belmiro' },
  { id: '1776', name: 'São Paulo', slug: 'sao-paulo', logoUrl: 'https://crests.football-data.org/1776.png', primaryColor: '#C62027', secondaryColor: '#000000', founded: 1930, stadium: 'Morumbi' },
  { id: '1780', name: 'Sport Recife', slug: 'sport-recife', logoUrl: 'https://crests.football-data.org/1780.png', primaryColor: '#E21E26', secondaryColor: '#000000', founded: 1905, stadium: 'Ilha do Retiro' },
  { id: '1774', name: 'Vasco da Gama', slug: 'vasco-da-gama', logoUrl: 'https://crests.football-data.org/1774.png', primaryColor: '#000000', secondaryColor: '#FFFFFF', founded: 1898, stadium: 'São Januário' },
  { id: '4286', name: 'Vitória', slug: 'vitoria', logoUrl: 'https://crests.football-data.org/4286.png', primaryColor: '#FF0000', secondaryColor: '#000000', founded: 1899, stadium: 'Barradão' },
];

const MOCK_MATCHES: Match[] = [
  {
    id: '1001',
    homeTeam: MOCK_TEAMS[13], // Palmeiras
    awayTeam: MOCK_TEAMS[6], // Flamengo
    competition: 'Brasileirão Série A',
    date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    time: '16:00',
    status: 'live',
    score: { home: 1, away: 0 },
    broadcastChannel: 'Globo'
  },
  {
    id: '1002',
    homeTeam: MOCK_TEAMS[4], // Corinthians
    awayTeam: MOCK_TEAMS[16], // São Paulo
    competition: 'Brasileirão Série A',
    date: new Date(Date.now() + 86400000).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    time: '20:00',
    status: 'scheduled',
    broadcastChannel: 'Premiere'
  },
   {
    id: '1003',
    homeTeam: MOCK_TEAMS[9], // Grêmio
    awayTeam: MOCK_TEAMS[10], // Internacional
    competition: 'Brasileirão Série A',
    date: new Date(Date.now() + 172800000).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    time: '18:30',
    status: 'scheduled',
    broadcastChannel: 'SporTV'
  }
];

const MOCK_STANDINGS: Standing[] = MOCK_TEAMS.map((team, index) => {
    const wins = Math.floor(24 - index * 1);
    const losses = 3 + Math.floor(index * 0.8);
    const played = 32;
    const draw = played - wins - losses;
    const points = (wins * 3) + draw;

    return {
        position: index + 1,
        team: team,
        points: points,
        played: played,
        wins: wins,
        draw: draw,
        losses: losses,
        goalDifference: 40 - index * 2
    }
});
// --- END MOCKS ---

const apiFetch = async (endpoint: string) => {
  try {
    const response = await fetch(`${serverUrl}/football${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY
      }
    });
    if (!response.ok) { return null; }
    return response.json();
  } catch (error) { return null; }
};

const genericApiFetch = async (endpoint: string) => {
  try {
    const response = await fetch(`${serverUrl}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY
      }
    });
    if (!response.ok) { return null; }
    return response.json();
  } catch (error) {
    console.error(`API fetch error for ${endpoint}:`, error);
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
    broadcastChannel: 'Premiere', // Mocked
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
      // Let's check if the API returned a full list. If not, use our better mock.
      if (teams.length > 15) {
         allTeamsCache = teams;
         return teams;
      }
    }
    allTeamsCache = MOCK_TEAMS;
    return MOCK_TEAMS;
};

const fetchAndCacheMatches = async (): Promise<Match[]> => {
    if (allMatchesCache) return allMatchesCache;
    const data = await apiFetch(`/competitions/${brasileiraoId}/matches`);
    if (data && data.matches) {
        allMatchesCache = data.matches.map(mapApiMatchToMatch);
        return allMatchesCache;
    }
    return MOCK_MATCHES;
}

export const getFeaturedMatch = async (): Promise<Match | null> => {
    const matches = await fetchAndCacheMatches();
    const liveMatch = matches.find(m => m.status === 'live');
    if (liveMatch) return liveMatch;
    const upcoming = matches.filter(m => m.status === 'scheduled').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return upcoming[0] || matches[0] || null;
};

export const getUpcomingMatches = async (): Promise<Match[]> => {
    const matches = await fetchAndCacheMatches();
    return matches.filter(m => m.status === 'scheduled' || m.status === 'live');
};

export const getStandings = async (): Promise<Standing[]> => {
    const data = await apiFetch(`/competitions/${brasileiraoId}/standings`);
    if (data && data.standings && data.standings[0]?.table) {
        // Check if API returned a full table, otherwise use mock
        if (data.standings[0].table.length > 15) {
            return data.standings[0].table.map(mapApiStandingToStanding);
        }
    }
    return MOCK_STANDINGS;
};

export const getMatchById = async (id: string): Promise<Match | null> => {
    const matches = await fetchAndCacheMatches();
    return matches.find(m => m.id === id) || null;
};

// --- NEW API FUNCTIONS ---

// TheSportsDB
export const getSportsDbTeam = async (teamName: string): Promise<any | null> => {
    const data = await genericApiFetch(`/sportsdb/search/team/${encodeURIComponent(teamName)}`);
    return data?.teams?.[0] || null;
}

export const getSportsDbPlayersByTeamId = async (teamId: string): Promise<SportsDbPlayer[]> => {
    const data = await genericApiFetch(`/sportsdb/team/${teamId}/players`);
    return data?.player || [];
}

// GloboEsporte RSS
export const getSoccerNews = async (teamSlug?: string): Promise<NewsItem[]> => {
    const endpoint = teamSlug ? `/soccer-news?team=${teamSlug}` : '/soccer-news';
    const data = await genericApiFetch(endpoint);
    return data?.items || [];
};

// Sportmonks
export const getLiveMatches = async (): Promise<any[]> => {
    const data = await genericApiFetch('/sportmonks/matches/live');
    return data?.data || [];
}