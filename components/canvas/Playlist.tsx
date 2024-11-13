import React from 'react';

interface Track {
  url: string;
  title: string;
}

interface PlaylistProps {
  tracks: Track[];
  currentTrackIndex: number;
  handleSongSelect: (index: number) => void;
}

const Playlist: React.FC<PlaylistProps> = ({ tracks, currentTrackIndex, handleSongSelect }) => {
  return (
    <div className="mt-6 lg:mt-0">
      <h4 className="text-xl text-purple-800 font-semibold ml-3 mb-2">Playlist</h4>
      <ul className="max-h-screen overflow-y-auto">
        {tracks.map((track, index) => (
          <li
            key={index}
            onClick={() => handleSongSelect(index)}
            className={`p-2 m-2 rounded-lg cursor-pointer text-slate-300 ${
              index === currentTrackIndex ? 'bg-blue-500' : 'hover:bg-gray-700'
            }`}
          >
            {track.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Playlist;



