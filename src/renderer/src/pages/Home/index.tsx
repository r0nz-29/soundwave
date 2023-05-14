import { For, onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { setActiveTrack, setSearchResult, setTracks, tracks } from '../../state'
import Card from '../../components/TrackCard';
import { Track } from '../../types'

export default function Home() {
  const navigate = useNavigate();

  onMount(() => {
    if (window.ipcRenderer !== null) {
      window.ipcRenderer.send('get-tracks', null);
      window.ipcRenderer.on('tracks', (_event, rows: Track[]) => {
        setTracks(rows);
        setActiveTrack(rows[Math.floor(Math.random() * rows.length-1)])
      });
      window.ipcRenderer.on('music-metadata-error', (_event, error) => {
        console.error('Error retrieving music metadata:', error);
      });
    }
  });

  function getSearchResults(e: Event) {
    // @ts-ignore
    const term = e.currentTarget.value;
    console.log(term);
    window.ipcRenderer.send('get-search-results', { term });
    window.ipcRenderer.on('search-results', (_event, rows) => {
      setSearchResult(rows);
      navigate('/results');
    });
  }

  return (
    <div class="p-8 col-start-2 col-end-9 row-span-5 overflow-y-scroll">
      <input
        placeholder="Search for a song"
        type="text"
        name="search"
        onChange={getSearchResults}
        class="border border-slate-300 text-sm w-full p-2 pl-4 rounded-lg hover:shadow-md focus:hover:shadow-md focus:outline-none bg-white"
      />
      <br />
      <br />
      <p class="text-slate-900 text-2xl">Top Tracks</p>
      <div class="mt-4 text-left w-full text-slate-500 grid grid-cols-4 gap-4">
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
