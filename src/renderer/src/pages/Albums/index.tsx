import { For, onMount } from 'solid-js';
import { Album } from '../../types';
import { getAlbums, setAlbums } from '../../state';
import Card from '../../components/AlbumCard';

export default function Albums() {
  onMount(() => {
    if (window.ipcRenderer !== null) {
      window.ipcRenderer.send('get-albums', null);
      window.ipcRenderer.on('albums', (event, rows) => {
        const set = new Set();
        const albums = [];

        for (const row of rows as Album[]) {
          if (set.has(row.name)) continue;
          set.add(row.name);
          albums.push(row);
        }

        setAlbums(albums);
      });
    }
  });

  return (
    <div class="p-8 col-start-2 col-end-9 row-span-5 overflow-y-scroll">
      {/*<input*/}
      {/*	placeholder="Search for a song"*/}
      {/*	type="text"*/}
      {/*	name="search"*/}
      {/*	onChange={getSearchResults}*/}
      {/*	class="border border-slate-300 text-sm w-full p-2 pl-4 rounded-lg hover:shadow-md focus:hover:shadow-md focus:outline-none bg-white"*/}
      {/*/>*/}
      <br />
      <br />
      <p class="text-slate-900 text-2xl">Albums</p>
      <div class="grid grid-cols-7 gap-4 mt-4">
        <For
          each={getAlbums()}
          fallback={<p class="text-3xl text-center text-emerald-500">Loading...</p>}
        >
          {(album) => <Card album={album} />}
        </For>
      </div>
    </div>
  );
}
