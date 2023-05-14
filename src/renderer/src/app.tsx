import { Component } from 'solid-js';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import Albums from './pages/Albums';
import Album from './pages/Album';
import BottomPlayer from './components/BottomPlayer';
import { Route, Routes } from '@solidjs/router';

const App: Component = () => {
  return (
    <div class="grid grid-cols-8 grid-rows-5 h-screen w-full">
      <Sidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<SearchResults />} />
        <Route path="/albums" element={<Albums />} />
        <Route path="/album/:name" element={<Album />} />
      </Routes>
      <BottomPlayer />
    </div>
  );
};

export default App;
