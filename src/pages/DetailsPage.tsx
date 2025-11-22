import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Play, Plus, ThumbsUp, Check, Loader, Clock, Star } from 'lucide-react';
import { Movie, useStore } from '../store';
import { getContentById } from '../services/m3uService';
import { fetchDetails, Details, CastMember, Season } from '../services/tmdb';
import Row from '../components/Row';
import { getAllContent } from '../services/m3uService';

const AppLoader = () => (
    <div className="h-screen w-screen bg-[#141414] flex items-center justify-center">
        <Loader className="w-12 h-12 animate-spin text-red-500" />
    </div>
);

export default function DetailsPage() {
    const [content, setContent] = useState<Movie | null>(null);
    const [details, setDetails] = useState<Details | null>(null);
    const [allContent, setAllContent] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const { 
        myList, addToMyList, removeFromMyList,
        watchLaterList, addToWatchLater, removeFromWatchLater,
        likedList, toggleLike
    } = useStore();
    
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const pathParts = window.location.pathname.split('/');
            const mediaType = pathParts[2] as 'tv' | 'movie';
            const contentId = pathParts[3];

            if (contentId) {
                const [item, tmdbDetails, allItems] = await Promise.all([
                    getContentById(Number(contentId)),
                    fetchDetails(Number(contentId), mediaType),
                    getAllContent()
                ]);
                setContent(item);
                setDetails(tmdbDetails);
                setAllContent(allItems);
            }
            setIsLoading(false);
            window.scrollTo(0, 0);
        };
        fetchData();
    }, []);

    const similarContent = useMemo(() => {
        if (!content || allContent.length === 0) return [];
        return allContent.filter(item => 
            item.id !== content.id &&
            item.genre.some(g => content.genre.includes(g))
        ).slice(0, 20);
    }, [content, allContent]);


    if (isLoading) return <AppLoader />;
    if (!content) {
        return (
            <div className="h-screen w-screen bg-[#141414] flex flex-col items-center justify-center gap-4">
                <p className="text-2xl font-bold">Conteúdo não encontrado</p>
                <a href="/" className="bg-red-600 px-4 py-2 rounded-md font-semibold hover:bg-red-700 transition">Voltar ao Início</a>
            </div>
        );
    }
    
    const isInList = myList.some(m => m.id === content.id);
    const isInWatchLater = watchLaterList.some(m => m.id === content.id);
    const isLiked = likedList.includes(content.id);

    return (
        <div className="bg-[#141414] min-h-screen text-white">
            <a href="/" className="absolute top-6 left-6 z-30 p-2 bg-black/50 rounded-full hover:bg-black/80 transition">
                <ArrowLeft className="w-7 h-7" />
            </a>

            {/* Hero Section */}
            <div className="relative h-[60vh] md:h-[80vh] w-full">
                <img src={content.thumbnailUrl.replace('w500', 'original')} alt={content.title} className="w-full h-full object-cover brightness-50" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/30" />
                <div className="absolute bottom-0 left-0 w-full px-8 md:px-16 pb-12 md:pb-20">
                    {details?.logoUrl ? (
                        <img src={details.logoUrl} alt={`${content.title} logo`} className="max-h-24 md:max-h-40 max-w-[60%] md:max-w-[40%] object-contain mb-6 drop-shadow-lg" />
                    ) : (
                        <h1 className="text-4xl md:text-7xl font-black text-white drop-shadow-2xl mb-6">{content.title}</h1>
                    )}

                    <div className="flex items-center gap-3">
                        <a href={`/watch/${content.id}`} className="bg-white text-black px-6 py-2.5 rounded font-bold flex items-center gap-2 hover:bg-opacity-80 transition text-lg">
                            <Play className="w-6 h-6 fill-black" /> Assistir
                        </a>
                        <button onClick={() => isInList ? removeFromMyList(content.id) : addToMyList(content)} className={`p-3 rounded-full border-2 transition ${isInList ? 'border-green-400 bg-green-900/30 text-green-400 hover:bg-green-900/50' : 'bg-gray-500/50 text-white border-gray-400/80 hover:border-white'}`}>
                            {isInList ? <Check className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                        </button>
                        <button onClick={() => toggleLike(content.id)} className={`p-3 rounded-full border-2 transition ${isLiked ? 'border-primary bg-primary/20 text-primary' : 'bg-gray-500/50 text-white border-gray-400/80 hover:border-white'}`}>
                            <ThumbsUp className={`w-6 h-6 ${isLiked ? 'fill-primary' : ''}`} />
                        </button>
                        <button onClick={() => isInWatchLater ? removeFromWatchLater(content.id) : addToWatchLater(content)} className={`p-3 rounded-full border-2 transition ${isInWatchLater ? 'border-blue-500 bg-blue-500/20 text-blue-400' : 'bg-gray-500/50 text-white border-gray-400/80 hover:border-white'}`}>
                            <Clock className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-8 md:px-16 py-8 grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center gap-4 text-base">
                        <span className="text-green-400 font-bold">{content.match}% Relevante</span>
                        <span className="text-gray-400">{content.year}</span>
                        <span className="border border-gray-500 px-1.5 text-sm rounded text-white">{details?.rating || content.rating}</span>
                        <span className="text-gray-400">{details?.runtime ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m` : content.duration}</span>
                    </div>
                    <p className="text-white text-lg leading-relaxed font-light">{content.description}</p>
                </div>
                
                <div className="text-base space-y-4">
                    <div>
                        <span className="text-gray-500">Gêneros: </span>
                        <span className="text-white">{content.genre.join(', ')}</span>
                    </div>
                    <div>
                        <span className="text-gray-500">Este título é: </span>
                        <span className="text-white">Empolgante</span>
                    </div>
                </div>
            </div>

            {/* Cast Section */}
            {details?.cast && details.cast.length > 0 && (
                <div className="px-8 md:px-16 py-8">
                    <h2 className="text-2xl font-bold mb-6">Elenco</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {details.cast.map(actor => <CastMemberCard key={actor.id} actor={actor} />)}
                    </div>
                </div>
            )}
            
            {/* Seasons Section */}
            {content.media_type === 'tv' && details?.seasons && details.seasons.length > 0 && (
                <div className="px-8 md:px-16 py-8">
                    <h2 className="text-2xl font-bold mb-6">Temporadas</h2>
                     <div className="bg-[#1E1E1E] rounded-xl border border-white/10 p-6">
                         {details.seasons.filter(s => s.season_number > 0).map(season => (
                            <div key={season.id} className="flex items-center gap-6 p-4 border-b border-white/10 last:border-b-0 hover:bg-white/5 rounded-lg -mx-4 transition">
                                <img 
                                    src={season.poster_path || 'https://placehold.co/150x225/1f1f1f/FFF?text=?'} 
                                    alt={season.name} 
                                    className="w-20 rounded-md"
                                />
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold">{season.name}</h3>
                                    <p className="text-sm text-gray-400">{season.episode_count} episódios • {new Date(season.air_date).getFullYear()}</p>
                                </div>
                            </div>
                         ))}
                     </div>
                </div>
            )}


            {/* More Like This Section */}
            {similarContent.length > 0 && (
                <div className="py-8">
                    <Row title="Mais como este" data={similarContent} />
                </div>
            )}

        </div>
    );
}


const CastMemberCard: React.FC<{ actor: CastMember }> = ({ actor }) => (
    <div className="flex flex-col items-center text-center group">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mb-3 border-2 border-transparent group-hover:border-red-500 transition-colors shadow-lg">
            <img 
                src={actor.profile_path || 'https://placehold.co/200x200/2a2a2a/FFF?text=?'} 
                alt={actor.name} 
                className="w-full h-full object-cover"
                loading="lazy"
            />
        </div>
        <p className="font-bold text-sm text-white">{actor.name}</p>
        <p className="text-xs text-gray-400">{actor.character}</p>
    </div>
);