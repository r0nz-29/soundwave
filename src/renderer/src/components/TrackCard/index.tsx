import { BsClock } from 'solid-icons/bs'
import { AiOutlineStar } from 'solid-icons/ai'
import { Track } from '../../types'
import { loadAudio, setActiveTrack } from '../../state'

export default function Card({ track }: { track: Track }) {
  function select(track: Track) {
    setActiveTrack(track)
    loadAudio(track)
  }

  const totalMinutes = () => Math.floor(parseInt(track.length) / 60)
  const totalSeconds = () => (parseInt(track.length) - totalMinutes() * 60).toFixed(0)

  return (
    <div
      class='p-2 flex flex-row justify-between border border-slate-200 hover:shadow-lg cursor-pointer rounded-lg bg-white shadow-md'>
      <div
        onClick={() => select(track)}
        class='flex flex-row gap-x-4 justify-between items-center max-w-full w-full overflow-clip'
      >
        <img
          class='rounded-lg w-16'
          src={`file://${track.img}`}
          alt={track.title}
          elementtiming={''}
          fetchpriority={'high'}
        />
        <div class='w-full overflow-clip'>
          <p class='text-black text-md truncate'>{track.title}</p>
          <p class='text-slate-400 text-sm truncate'>{track.artist}</p>
          <p class='text-slate-400 text-sm truncate'>{track.genre}</p>
        </div>
      </div>
      <div class="flex flex-col justify-between items-end">
        <AiOutlineStar />
        <div class='flex flex-row items-center gap-x-2'>
          <BsClock />
          <p>{`${totalMinutes()}:${totalSeconds()}`}</p>
        </div>
      </div>
    </div>
  )
}

// <div
// 	onClick={() => select(track)}
// 	className="p-4 border border-slate-200 hover:border-emerald-300 hover:shadow-lg cursor-pointer rounded-lg bg-white shadow-md">
// 	<img className="rounded-lg mb-4" src={`file://${track.img}`} alt={track.title} elementtiming={""}
// 			 fetchpriority={"high"}/>
// 	<p className="text-black text-md truncate">{track.title}</p>
// 	<p className="text-slate-400 text-sm truncate">{track.artist}</p>
// 	<p className="text-slate-400 text-sm truncate">{track.album}</p>
// </div>
