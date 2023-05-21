import { createSignal } from 'solid-js'
import { Album, AudioState, Track } from '../types'

export const [tracks, setTracks] = createSignal<Track[]>([])
export const [activeTrack, setActiveTrack] = createSignal<Track>()
export const [currentTime, setCurrentTime] = createSignal(0)
export const [duration, setDuration] = createSignal(0)
export const [activeAudio, setActiveAudio] = createSignal<HTMLAudioElement | null>(null)
export const [state, setState] = createSignal<AudioState>('stopped')
export const [getSearchResult, setSearchResult] = createSignal<Track[] | null>(null)
export const [searchAlbums, setSearchAlbums] = createSignal<Album[] | null>(null)
export const [getAlbums, setAlbums] = createSignal<Album[] | null>(null)
export const [repeat, setRepeat] = createSignal(false)
export const [queue, setQueue] = createSignal<Track[]>([])
let index: null | number = null

export const audioPlayer: { file: Track | null } = {
  file: null
}

export function playAudio() {
  if (!activeAudio() || !audioPlayer.file) {
    return
  }
  activeAudio()?.play()
  setState('playing')
}

export function pauseAudio() {
  if (!activeAudio() || !audioPlayer.file) {
    return
  }
  activeAudio()?.pause()
  setState('paused')
}

export function stopAudio() {
  if (!activeAudio() || !audioPlayer.file) {
    return
  }

  activeAudio()?.pause()
  setCurrentTime(0)
  setState('stopped')
}

export function seek(newTime: number) {
  if (!activeAudio()) return
  // @ts-ignore
  activeAudio().currentTime = newTime
  setCurrentTime(newTime)
}

export function loadAudio(file: Track) {
  const audio = new Audio(`file://${file.path}`)
  audio.crossOrigin = 'anonymous'

  activeAudio()?.pause()
  setCurrentTime(0)

  audio.addEventListener('loadedmetadata', () => {
    setDuration(audio.duration)
  })

  audio.addEventListener('timeupdate', () => {
    setCurrentTime(audio.currentTime)
  })

  audio.addEventListener('ended', () => {
    if (repeat()) {
      loadAudio(file)
      return
    }
    setState('stopped')
  })

  audioPlayer.file = file
  setActiveAudio(audio)
  setState('stopped')
  playAudio()
}

export function createQueue(tracks: Track[] | null = null) {
  if (index && queue().length > 0 && (index >= queue().length))
    return

  if (queue().length > 0 && index !== null) {
    const nextTrack = queue()[++index]
    loadAudio(nextTrack)
    setActiveTrack(nextTrack)
    activeAudio()?.addEventListener('ended', () => {
      if (index === queue().length - 1) return
      if (index === null) return
      createQueue()
    })
    return
  }

  if (tracks === null) return

  setQueue(tracks)
  index = 0
  const nextTrack = queue()[index]
  loadAudio(nextTrack)
  setActiveTrack(nextTrack)

  activeAudio()?.addEventListener('ended', () => {
    if (index === queue().length - 1) return
    if (index === null) return
    createQueue()
  })
}
