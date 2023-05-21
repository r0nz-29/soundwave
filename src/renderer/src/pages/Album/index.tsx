import { createSignal, For, onMount, Show } from 'solid-js'
import { useNavigate, useParams } from '@solidjs/router'
import { Track } from '../../types'
import Card from '../../components/TrackCard'
import { BsArrowLeft, BsPlayFill } from 'solid-icons/bs'
import { createQueue } from '../../state'

export default function Album() {
  const [tracks, setTracks] = createSignal<Track[] | null>(null)
  let { name } = useParams<{ name: string }>()
  name = decodeURIComponent(name)
  const [cover, setCover] = createSignal<string | null>(null)
  const navigate = useNavigate()

  onMount(() => {
    if (window.ipcRenderer !== null) {
      window.ipcRenderer.send('get-tracks-from-album', { album: name })
      window.ipcRenderer.on('tracks-from-album', (_event, rows) => {
        setTracks(rows)
        setCover(rows[0].img)
      })
    }
  })

  return (
    <div class='col-start-2 col-end-9 row-span-5 overflow-y-scroll'>
      <Show when={cover() !== null}>
        <div
          class='album-header bg-cover bg-center'
          style={{ 'background-image': `url('file://${cover()}')` }}
        >
          <div class='relative p-8 flex flex-row justify-between items-center w-full h-full backdrop-blur-2xl'>
            <button
              onClick={() => navigate(-1)}
              class='absolute top-0 left-4 text-white text-xl font-black z-10 drop-shadow-lg mt-4 px-6 py-2 rounded-lg bg-white/[.1] hover:bg-white/[.15] active:bg-white/[.2]'>
              <BsArrowLeft />
            </button>

            <div class='self-end'>
              <p class='text-white text-6xl font-black z-10 drop-shadow-lg'>{name}</p>
              <button
                onClick={() => createQueue(tracks())}
                class='flex flex-row items-center gap-x-2 text-white text-xl font-black z-10 drop-shadow-lg mt-4 px-6 py-2 rounded-lg bg-white/[.1] hover:bg-white/[.15] active:bg-white/[.2]'>
                <BsPlayFill />
              </button>
            </div>
            <img
              src={`file://${cover()}`}
              alt={name}
              class='rounded-lg h-96 shadow-lg'
              elementtiming={''}
              fetchpriority={'high'}
            />
          </div>
        </div>
      </Show>
      <div class='p-8 grid grid-cols-3 gap-4 gap-y-2'>
        <For
          each={tracks()}
          fallback={<p class='text-3xl text-center text-emerald-500'>Loading...</p>}
        >
          {(track) => <Card track={track} noImg />}
        </For>
      </div>
    </div>
  )
}
