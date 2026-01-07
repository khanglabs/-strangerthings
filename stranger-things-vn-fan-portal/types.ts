
export interface Episode {
  title: string;
  url: string;
  description: string;
}

export interface Season {
  id: number;
  title: string;
  poster: string;
  episodes: Episode[];
}

export type ThemeMode = 'normal' | 'upside-down';
