import { Movie } from '../../store';
import { MOCK_MOVIES } from '../../constants';

// This file simulates a backend API for content curation.
// In a real app, this would be a fetch call to a server.

export interface CuratedList {
    id: 'heroCandidates' | 'originals' | 'trending';
    movies: Movie[];
}

// Default curated content if none is in localStorage
const DEFAULT_CURATED_CONTENT: CuratedList[] = [
    {
        id: 'heroCandidates',
        movies: MOCK_MOVIES.slice(0, 2)
    },
    {
        id: 'originals',
        movies: [MOCK_MOVIES[0], MOCK_MOVIES[2], MOCK_MOVIES[3]]
    },
    {
        id: 'trending',
        movies: [...MOCK_MOVIES.slice(0, 4)].sort(() => 0.5 - Math.random()) // Randomize
    }
];

const STORAGE_KEY = 'streamflix-curated-content';

// Simulate fetching the curated lists
export const getCuratedContent = async (): Promise<CuratedList[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const storedContent = localStorage.getItem(STORAGE_KEY);
            if (storedContent) {
                resolve(JSON.parse(storedContent));
            } else {
                // Initialize with default content if nothing is stored
                localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CURATED_CONTENT));
                resolve(DEFAULT_CURATED_CONTENT);
            }
        }, 500); // Simulate network delay
    });
};

// Simulate updating the curated lists
export const updateCuratedContent = async (updatedLists: CuratedList[]): Promise<{ success: true }> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLists));
            resolve({ success: true });
        }, 500); // Simulate network delay
    });
};
