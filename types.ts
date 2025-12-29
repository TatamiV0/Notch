export interface Song {
  title: string;
  artist: string;
  cover?: string;
  duration: number; // in seconds
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isStreaming?: boolean;
}

export enum AppState {
  IDLE = 'IDLE',
  MUSIC_OPEN = 'MUSIC_OPEN',
  AI_OPEN = 'AI_OPEN',
}