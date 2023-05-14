export type Track = {
  id: number;
  title: string;
  artist: string;
  album: string;
  year: string;
  genre: string;
  length: string;
  path: string;
  img: string;
};

export type Album = {
  img: string;
  name: string;
  artist: string;
  genre: string;
};

export type AudioState = 'playing' | 'paused' | 'stopped';

export interface AudioPlayer {
  file: Track | null;
  audio: HTMLAudioElement | null;
  state: AudioState;
  currentTime: number;
  duration: number;
}
