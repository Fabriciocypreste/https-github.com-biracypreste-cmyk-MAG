import { Movie } from '../store';

const M3U_URL_KEY = 'streamflix-m3u-url';
const M3U_CONTENT_KEY = 'streamflix-m3u-content';

// Hashing function for creating a stable, numeric ID from a string (e.g., URL)
const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

export const setM3UUrl = (url: string): void => {
  localStorage.setItem(M3U_URL_KEY, url);
};

export const getM3UUrl = (): string | null => {
  return localStorage.getItem(M3U_URL_KEY);
};

const parseM3U = (m3uText: string): Movie[] => {
  const lines = m3uText.split('\n');
  const items: Movie[] = [];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('#EXTINF:')) {
      const infoLine = lines[i];
      const urlLine = lines[i + 1]?.trim();
      
      if (!urlLine || urlLine.startsWith('#')) continue;

      const titleMatch = infoLine.match(/,(.+)$/);
      const title = titleMatch ? titleMatch[1].trim().replace(/"/g, '') : 'Untitled';
      
      const logoMatch = infoLine.match(/tvg-logo="([^"]+)"/);
      const thumbnailUrl = logoMatch ? logoMatch[1] : `https://placehold.co/500x281/141414/FFF?text=${encodeURIComponent(title.substring(0, 15))}`;
      
      const groupMatch = infoLine.match(/group-title="([^"]+)"/);
      const groupTitle = groupMatch ? groupMatch[1].replace(/"/g, '') : 'Geral';
      
      let media_type: 'movie' | 'tv' = 'tv';
      const groupLower = groupTitle.toLowerCase();

      if (groupLower.includes('filme') || groupLower.includes('movie')) {
          media_type = 'movie';
      }
      
      const id = simpleHash(urlLine);

      items.push({
        id,
        title,
        thumbnailUrl,
        videoUrl: urlLine,
        genre: [groupTitle],
        media_type,
        description: `Conteúdo da categoria: ${groupTitle}. Assista agora.`,
        duration: media_type === 'movie' ? `${Math.floor(Math.random() * 60) + 90}m` : 'Ao Vivo',
        match: 85 + Math.floor(Math.random() * 15),
        year: new Date().getFullYear() - Math.floor(Math.random() * 5),
        rating: '14',
      });
    }
  }
  return items;
};

export const syncM3UData = async (): Promise<{ total: number; movies: number; series: number; channels: number }> => {
    const url = getM3UUrl();
    if (!url) {
        throw new Error("M3U URL not set.");
    }

    // Use a CORS proxy if needed for cross-origin requests
    const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch M3U file: ${response.statusText}`);
    }
    const m3uText = await response.text();
    const content = parseM3U(m3uText);

    localStorage.setItem(M3U_CONTENT_KEY, JSON.stringify(content));

    const movies = content.filter(c => c.media_type === 'movie').length;
    const series = content.filter(c => c.media_type === 'tv' && !c.genre.some(g => g.toLowerCase().includes('canais'))).length;
    const channels = content.filter(c => c.genre.some(g => g.toLowerCase().includes('canais'))).length;

    return { total: content.length, movies, series, channels };
};

export const getAllContent = async (): Promise<Movie[]> => {
    return new Promise((resolve) => {
        const storedContent = localStorage.getItem(M3U_CONTENT_KEY);
        if (storedContent) {
            resolve(JSON.parse(storedContent));
        } else {
            resolve([]);
        }
    });
};

export const getContentById = async (id: number): Promise<Movie | null> => {
    const allContent = await getAllContent();
    return allContent.find(item => item.id === id) || null;
}
