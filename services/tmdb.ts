
import { Movie } from '../store';

const API_KEY = "ddb1bdf6aa91bdf335797853884b0c1d";
const BASE_URL = "https://api.themoviedb.org/3";

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Season {
  id: number;
  name: string;
  poster_path: string | null;
  season_number: number;
  episode_count: number;
  air_date: string;
}

export interface Details {
  logoUrl?: string;
  rating?: string;
  cast: CastMember[];
  seasons?: Season[];
  runtime?: number; // in minutes for movies
  numberOfSeasons?: number; // for tv
  trailerKey?: string;
}

// Helper para adicionar o parâmetro de idioma português
const withLang = (url: string) => `${url}&language=pt-BR`;

export const requests = {
  fetchTrending: withLang(`${BASE_URL}/trending/all/week?api_key=${API_KEY}`),
  fetchNetflixOriginals: withLang(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_networks=213`),
  fetchTopRated: withLang(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`),
  fetchActionMovies: withLang(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=28`),
  fetchComedyMovies: withLang(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=35`),
  fetchHorrorMovies: withLang(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=27`),
  fetchRomanceMovies: withLang(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=10749`),
  fetchDocumentaries: withLang(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=99`),
  fetchTVShows: withLang(`${BASE_URL}/discover/tv?api_key=${API_KEY}`),
};

const GENRES: { [key: number]: string } = {
  28: "Ação", 12: "Aventura", 16: "Animação", 35: "Comédia", 80: "Crime", 
  99: "Documentário", 18: "Drama", 10751: "Família", 14: "Fantasia", 36: "História", 
  27: "Terror", 10402: "Música", 9648: "Mistério", 10749: "Romance", 878: "Ficção Científica", 
  10770: "Filme TV", 53: "Suspense", 10752: "Guerra", 37: "Faroeste",
  10759: "Ação e Aventura", 10762: "Kids", 10763: "News", 10764: "Reality", 
  10765: "Sci-Fi & Fantasy", 10766: "Novela", 10767: "Talk", 10768: "War & Politics"
};

export const mapToAppMovie = (result: any): Movie => {
  const isTv = result.media_type === 'tv' || !!result.name;
  
  return {
    id: result.id,
    title: result.title || result.name || result.original_name,
    description: result.overview,
    thumbnailUrl: `https://image.tmdb.org/t/p/w500${result.backdrop_path || result.poster_path}`,
    duration: isTv ? `${Math.floor(Math.random() * 3) + 1} Temporadas` : `${Math.floor(Math.random() * 60) + 90}m`,
    genre: result.genre_ids ? result.genre_ids.map((id: number) => GENRES[id] || 'Geral').filter(Boolean) : ['Geral'],
    match: Math.floor(result.vote_average * 10) || Math.floor(Math.random() * 15) + 85,
    year: new Date(result.release_date || result.first_air_date || '2023-01-01').getFullYear(),
    rating: isTv ? '16' : '14', // Mock de classificação
    isTop10: 0,
    media_type: isTv ? 'tv' : 'movie',
  };
};

export const fetchMovies = async (url: string): Promise<Movie[]> => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (data.results) {
      return data.results
        .filter((result: any) => result.backdrop_path && result.overview) // Filtra itens sem imagem ou descrição
        .map(mapToAppMovie);
    }
    return [];
  } catch (error) {
    console.error("Falha ao buscar filmes:", error);
    return [];
  }
};

export const fetchDetails = async (id: number, media_type: 'movie' | 'tv'): Promise<Details | null> => {
  const appendToResponse = 'credits,images,videos,' + (media_type === 'tv' ? 'content_ratings' : 'release_dates');
  const url = withLang(`${BASE_URL}/${media_type}/${id}?api_key=${API_KEY}&append_to_response=${appendToResponse}&include_image_language=pt,en,null`);
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    const logos = data.images?.logos || [];
    const ptLogo = logos.find((l: any) => l.iso_639_1 === 'pt');
    const enLogo = logos.find((l: any) => l.iso_639_1 === 'en');
    const bestLogo = ptLogo || enLogo || logos[0];
    const logoUrl = bestLogo ? `https://image.tmdb.org/t/p/w500${bestLogo.file_path}` : undefined;
    
    let rating: string | undefined;
    if (media_type === 'tv') {
      const brRating = data.content_ratings?.results?.find((r: any) => r.iso_3166_1 === 'BR');
      rating = brRating?.rating || '14';
    } else {
      const brRelease = data.release_dates?.results?.find((r: any) => r.iso_3166_1 === 'BR');
      rating = brRelease?.release_dates[0]?.certification || 'L';
    }
    
    const cast = (data.credits?.cast || []).slice(0, 10).map((c: any) => ({
      id: c.id, name: c.name, character: c.character,
      profile_path: c.profile_path ? `https://image.tmdb.org/t/p/w200${c.profile_path}` : null,
    }));
    
    const seasons = media_type === 'tv' ? data.seasons?.map((s: any) => ({
      id: s.id, name: s.name,
      poster_path: s.poster_path ? `https://image.tmdb.org/t/p/w300${s.poster_path}` : null,
      season_number: s.season_number, episode_count: s.episode_count, air_date: s.air_date
    })) : undefined;
    
    const videos = data.videos?.results || [];
    const trailer = videos.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube') || videos.find((v: any) => v.site === 'YouTube');
    const trailerKey = trailer?.key;

    return {
      logoUrl, rating, cast, seasons, trailerKey,
      runtime: data.runtime,
      numberOfSeasons: data.number_of_seasons,
    };

  } catch (error) {
    console.error(`Falha ao buscar detalhes para ${media_type} ${id}:`, error);
    return null;
  }
};