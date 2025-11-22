
import React from 'react';
import { Match, Standing, Team } from '../types/futebol';
import MatchHero from '../components/futebol/MatchHero';
import MatchesRow from '../components/futebol/MatchesRow';
import StandingsTable from '../components/futebol/StandingsTable';
import { TeamCard } from '../components/futebol/TeamCard';
import { Loader, Shield } from 'lucide-react';

interface FutebolPageProps {
  featuredMatch: Match | null;
  upcomingMatches: Match[];
  standings: Standing[];
  teams: Team[];
}

const FutebolPage: React.FC<FutebolPageProps> = ({ featuredMatch, upcomingMatches, standings, teams }) => {

  const isLoading = !featuredMatch || upcomingMatches.length === 0 || standings.length === 0 || teams.length === 0;

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-screen">
            <Loader className="w-12 h-12 animate-spin text-red-500" />
        </div>
    );
  }

  return (
    <div className="flex flex-col">
      <MatchHero match={featuredMatch} />
      <div className="flex flex-col gap-4 md:gap-8 pt-8">
        <MatchesRow title="Próximos Jogos" data={upcomingMatches} />
        <StandingsTable standings={standings} />
        
        {/* Teams Grid Section */}
        <section className="px-[4%] md:px-[60px] py-8">
            <h2 className="text-xl lg:text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-gray-400" />
                Clubes Participantes
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {teams.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
        </section>
      </div>
    </div>
  );
};

export default FutebolPage;
