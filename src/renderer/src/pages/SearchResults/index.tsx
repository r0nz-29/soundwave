import { For, Show } from 'solid-js';
import Card from '../../components/TrackCard';
import { getSearchResult, setSearchResult } from '../../state';

export default function SearchResults() {
  function getSearchResults(e: Event) {
    // @ts-ignore
    const term = e.currentTarget.value;
    console.log(term);
    window.ipcRenderer.send('get-search-results', { term });
    window.ipcRenderer.on('search-results', (event, rows) => {
      console.log(rows);
      setSearchResult(rows);
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
      <p class="text-slate-900 text-2xl">
        <Show when={getSearchResult() !== null} fallback={<p>loading...</p>}>
          Found {getSearchResult()?.length} matches
        </Show>
      </p>
      <table class="mt-4 table-auto text-left text-slate-500">
        <tbody>
          <For
            each={getSearchResult()}
            fallback={<p class="text-3xl text-center text-emerald-500">Loading...</p>}
          >
            {(track) => <Card track={track} />}
          </For>
        </tbody>
      </table>
    </div>
  );
}
