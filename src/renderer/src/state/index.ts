import { createSignal } from 'solid-js';
import { Album, AudioState, Track } from "../types";

export const [tracks, setTracks] = createSignal<Track[]>([]);
export const [activeTrack, setActiveTrack] = createSignal<Track>();
export const [currentTime, setCurrentTime] = createSignal(0);
export const [duration, setDuration] = createSignal(0);
export const [activeAudio, setActiveAudio] = createSignal<HTMLAudioElement | null>(null);
export const [state, setState] = createSignal<AudioState>('stopped');
export const [getSearchResult, setSearchResult] = createSignal<Track[] | null>(null);
export const [getAlbums, setAlbums] = createSignal<Album[] | null>(null);
export const [repeat, setRepeat] = createSignal(false);

export const audioPlayer: { file: Track | null } = {
  file: null
};

export function playAudio() {
  if (!activeAudio() || !audioPlayer.file) {
    return;
  }
  activeAudio()?.play();
  setState('playing');
}

export function pauseAudio() {
  if (!activeAudio() || !audioPlayer.file) {
    return;
  }
  activeAudio()?.pause();
  setState('paused');
}

export function stopAudio() {
  if (!activeAudio() || !audioPlayer.file) {
    return;
  }

  activeAudio()?.pause();
  setCurrentTime(0);
  setState('stopped');
}

export function loadAudio(file: Track) {
  const audio = new Audio(`file://${file.path}`);
  audio.crossOrigin = 'anonymous';

  activeAudio()?.pause();
  setCurrentTime(0);

  audio.addEventListener('loadedmetadata', () => {
    setDuration(audio.duration);
  });

  audio.addEventListener('timeupdate', () => {
    setCurrentTime(audio.currentTime);
  });

  audio.addEventListener('ended', () => {
    if (repeat()) {
      loadAudio(file)
      return;
    }
    setState('stopped');
  });

  audioPlayer.file = file;
  setActiveAudio(audio);
  setState('stopped');
  playAudio();
}
