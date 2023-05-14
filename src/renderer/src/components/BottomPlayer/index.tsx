import { Show } from 'solid-js'
import { BsPauseFill, BsPlayFill, BsRepeat } from 'solid-icons/bs'
import {
  activeAudio,
  activeTrack,
  currentTime,
  duration,
  pauseAudio,
  playAudio,
  repeat,
  setCurrentTime,
  setRepeat,
  state
} from '../../state'

export default function BottomPlayer() {
  const totalMinutes = () => Math.floor(duration() / 60)
  const totalSeconds = () => (duration() - totalMinutes() * 60).toFixed(0)

  const currentMinutes = () => Math.floor(currentTime() / 60)
  const currentSeconds = () => (currentTime() - currentMinutes() * 60).toFixed(0)

  function setAudioTime(time: number) {
    if (!activeAudio()) {
      return
    }
    setCurrentTime(time)
  }

  return (
    <div class='p-4 flex flex-row justify-start items-center col-start-1 col-end-9 bg-white w-full border-t'>
      <div class='flex flex-row items-center gap-x-4 w-fit'>
        <img
          class='w-16 rounded-lg'
          src={`file://${activeTrack()?.img as string}`}
          alt={activeTrack()?.title}
          elementtiming={''}
          fetchpriority={'high'}
        />
        <div class='flex flex-col justify-between items-stretch w-64'>
          <p class='text-md text-black truncate overflow-ellipsis'>{activeTrack()?.title}</p>
          <p class='text-sm text-slate-400 truncate overflow-ellipsis max-w-full'>
            {activeTrack()?.artist}
          </p>
        </div>
      </div>
      <Show
        when={state() === 'playing'}
        fallback={
          <button onClick={playAudio} class='bg-white p-3 rounded-full'>
            <BsPlayFill class='text-4xl' />
          </button>
        }
      >
        <button onClick={pauseAudio} class='bg-white p-3 rounded-full'>
          <BsPauseFill class='text-4xl' />
        </button>
      </Show>
      <div class='flex flex-row justify-between items-center gap-x-3'>
        <p class='text-black'>{`${currentMinutes()}:${currentSeconds()}`}</p>
        <input
          type='range'
          min='0'
          class='w-80'
          max={duration()}
          value={currentTime()}
          onInput={(e) => setAudioTime(Number(e.currentTarget.value))}
        />
        <p class='text-black'>{`${totalMinutes()}:${totalSeconds()}`}</p>
      </div>
      <Show when={repeat()} fallback={<button onClick={() => setRepeat(true)} class='bg-white p-3 rounded-full'>
        <BsRepeat class='text-xl' />
      </button>}>
        <button onClick={() => setRepeat(false)} class='text-emerald-500 bg-white p-3 rounded-full'>
          <BsRepeat class='text-xl' />
        </button>
      </Show>
    </div>
  )
}
