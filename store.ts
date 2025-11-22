import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Movie {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl?: string;
  duration: string;
  genre: string[];
  match: number;
  year: number;
  rating: string;
  isTop10?: number; // 0 if not, 1-10 if yes
  media_type: 'movie' | 'tv';
}

interface AppState {
  isChatOpen: boolean;
  isModalOpen: boolean;
  currentMovie: Movie | null;
  myList: Movie[];
  watchLaterList: Movie[];
  likedList: number[]; // Storing only IDs for liked items
  searchQuery: string;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  openModal: (movie: Movie) => void;
  closeModal: () => void;
  addToMyList: (movie: Movie) => void;
  removeFromMyList: (movieId: number) => void;
  addToWatchLater: (movie: Movie) => void;
  removeFromWatchLater: (movieId: number) => void;
  toggleLike: (movieId: number) => void;
  setSearchQuery: (query: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Persisted state
      myList: [],
      watchLaterList: [],
      likedList: [],
      
      // Non-persisted state
      isChatOpen: false,
      searchQuery: '',
      isModalOpen: false,
      currentMovie: null,
      
      // Actions
      openChat: () => set({ isChatOpen: true }),
      closeChat: () => set({ isChatOpen: false }),
      toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
      // Fix: Add modal actions and state
      openModal: (movie) => set({ isModalOpen: true, currentMovie: movie }),
      closeModal: () => set({ isModalOpen: false, currentMovie: null }),
      addToMyList: (movie) => set((state) => ({
        myList: state.myList.find(m => m.id === movie.id) ? state.myList : [...state.myList, movie]
      })),
      removeFromMyList: (movieId) => set((state) => ({
        myList: state.myList.filter((movie) => movie.id !== movieId)
      })),
       addToWatchLater: (movie) => set((state) => ({
        watchLaterList: state.watchLaterList.find(m => m.id === movie.id) ? state.watchLaterList : [...state.watchLaterList, movie]
      })),
      removeFromWatchLater: (movieId) => set((state) => ({
        watchLaterList: state.watchLaterList.filter((movie) => movie.id !== movieId)
      })),
      toggleLike: (movieId) => set((state) => ({
        likedList: state.likedList.includes(movieId)
          ? state.likedList.filter(id => id !== movieId)
          : [...state.likedList, movieId]
      })),
      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: 'streamflix-storage', // unique name for storage
      storage: createJSONStorage(() => localStorage), // use localStorage
      partialize: (state) => ({ 
          myList: state.myList,
          watchLaterList: state.watchLaterList,
          likedList: state.likedList
      }), // only persist specified state
    }
  )
);