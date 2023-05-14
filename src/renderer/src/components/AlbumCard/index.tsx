import { useNavigate } from '@solidjs/router';
import { Album } from '../../types';

export default function Card({ album }: { album: Album }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate('/album/' + encodeURIComponent(album.name))}
      class="p-4 border border-slate-200 hover:border-emerald-300 hover:shadow-lg cursor-pointer rounded-lg bg-white shadow-md"
    >
      <img
        class="rounded-lg mb-4"
        src={`file://${album.img}`}
        alt={album.name}
        elementtiming={''}
        fetchpriority={'high'}
      />
      <p class="text-black text-md truncate">{album.name}</p>
      <p class="text-slate-400 text-sm truncate">{album.artist}</p>
      <p class="text-slate-400 text-sm truncate">{album.genre}</p>
    </div>
  );
}
