import { For, Show } from 'solid-js'
import Card from '../../components/TrackCard'
import AlbumCard from '../../components/AlbumCard'
import { getSearchResult, searchAlbums, setSearchAlbums, setSearchResult } from '../../state'
import { useParams } from '@solidjs/router'
import { Album } from '../../types'

export default function SearchResults() {
  const { type } = useParams()

  function getSearchResults(e: Event) {
    // @ts-ignore
    const term = e.currentTarget.value
    console.log(term)
    window.ipcRenderer.send('get-search-results', { term })
    window.ipcRenderer.on('search-results', (_event, rows) => {
      console.log(rows)
      setSearchResult(rows)
    })
  }

  function getAlbumSearchResults(e: Event) {
    // @ts-ignore
    const term = e.currentTarget.value
    console.log(term)
    window.ipcRenderer.send('get-album-search-results', { term })
    window.ipcRenderer.on('album-search-results', (_event, rows) => {
      console.log('got')
      const set = new Set()
      const albums: Album[] = []
      for (const row of rows as Album[]) {
        if (set.has(row.name)) continue
        set.add(row.name)
        albums.push(row)
      }
      setSearchAlbums(albums)
    })
  }

  if (type === 'albums') return (
    <div class='p-8 col-start-2 col-end-9 row-span-5 overflow-y-scroll'>
      <input
        placeholder='Search for an album'
        type='text'
        name='search'
        onChange={getAlbumSearchResults}
        class='border border-slate-300 text-sm w-full p-2 pl-4 rounded-lg hover:shadow-md focus:hover:shadow-md focus:outline-none bg-white'
      />
      <br />
      <br />
      <p class='text-slate-900 text-2xl'>
        <Show when={searchAlbums() !== null} fallback={<p>loading...</p>}>
          Found {searchAlbums()?.length} matches
        </Show>
      </p>
      <div class="mt-4 grid grid-cols-7 gap-x-4 gap-y-2">
        <For
          each={searchAlbums()}
          fallback={<p class='text-3xl text-center text-emerald-500'>Loading...</p>}
        >
          {(album) => {
            return <AlbumCard album={album} />
          }}
        </For>
      </div>
    </div>
  )

  else return (
    <div class='p-8 col-start-2 col-end-9 row-span-5 overflow-y-scroll'>
      <input
        placeholder='Search for a song'
        type='text'
        name='search'
        onChange={getSearchResults}
        class='border border-slate-300 text-sm w-full p-2 pl-4 rounded-lg hover:shadow-md focus:hover:shadow-md focus:outline-none bg-white'
      />
      <br />
      <br />
      <p class='text-slate-900 text-2xl'>
        <Show when={getSearchResult() !== null} fallback={<p>loading...</p>}>
          Found {getSearchResult()?.length} matches
        </Show>
      </p>
      <table class='mt-4 table-auto text-left text-slate-500'>
        <tbody>
        <For
          each={getSearchResult()}
          fallback={<p class='text-3xl text-center text-emerald-500'>Loading...</p>}
        >
          {(track) => {
            return <Card track={track} />
          }}
        </For>
        </tbody>
      </table>
    </div>
  )
}
