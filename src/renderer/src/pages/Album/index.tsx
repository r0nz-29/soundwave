import { createSignal, For, onMount, Show } from 'solid-js';
import { useParams } from '@solidjs/router';
import { Track } from '../../types';
import Card from '../../components/TrackCard';

export default function Album() {
  const [tracks, setTracks] = createSignal<Track[] | null>(null);
  let { name } = useParams<{ name: string }>();
  name = decodeURIComponent(name);
  const [cover, setCover] = createSignal<string | null>(null);

  onMount(() => {
    if (window.ipcRenderer !== null) {
      window.ipcRenderer.send('get-tracks-from-album', { album: name });
      window.ipcRenderer.on('tracks-from-album', (event, rows) => {
        setTracks(rows);
        setCover(rows[0].img);
      });
    }
  });
  // /home/raunits/.local/share/soundwave/album_art/Bruno Mars - Versace on the Floor.mp3.jpg
  return (
    <div class="col-start-2 col-end-9 row-span-5 overflow-y-scroll">
      <Show when={cover() !== null}>
        <div
          class="album-header bg-cover bg-center"
          style={{ 'background-image': `url('file://${cover()}')` }}
        >
          <div class="p-8 flex flex-row justify-between items-baseline w-full h-full backdrop-blur-2xl">
            <p class="text-white text-6xl font-black z-10 drop-shadow-lg">{name}</p>
            <img
              src={`file://${cover()}`}
              alt={name}
              class="rounded-lg h-96 shadow-lg"
              elementtiming={''}
              fetchpriority={'high'}
            />
          </div>
        </div>
      </Show>
      <div class="p-8 pt-4 text-left w-full text-slate-500 z-10 bg-white h-full">
        <For
          each={tracks()}
          fallback={<p class="text-3xl text-center text-emerald-500">Loading...</p>}
        >
          {(track) => <Card track={track} />}
        </For>
      </div>
    </div>
  );
}
