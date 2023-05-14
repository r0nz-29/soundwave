import { RiBuildingsHome2Fill } from 'solid-icons/ri';
import { For } from 'solid-js';
import { TbPlaylist } from 'solid-icons/tb';
import { CgAlbum } from 'solid-icons/cg';
import { BiRegularMicrophone } from 'solid-icons/bi';
import { A } from '@solidjs/router';

const links = [
  { Icon: RiBuildingsHome2Fill, label: 'Home', href: '/' },
  { Icon: TbPlaylist, label: 'Playlists', href: '/playlists' },
  { Icon: CgAlbum, label: 'Albums', href: '/albums' },
  { Icon: BiRegularMicrophone, label: 'Artists', href: '/artists' }
];

export default function Sidebar() {
  return (
    <div class="border-r col-span-1 row-span-5">
      <p class="text-2xl p-8 font-bold text-black">Soundwave</p>
      <For each={links}>
        {(link) => (
          <A
            href={link.href}
            class="flex flex-row justify-start items-center p-4 px-8 gap-x-4 hover:bg-slate-100 cursor-pointer"
          >
            <link.Icon class="text-slate-600 text-2xl" />
            <p class="text-sm text-slate-600">{link.label}</p>
          </A>
        )}
      </For>
    </div>
  );
}
