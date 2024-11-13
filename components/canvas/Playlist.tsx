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
      <h4 className="text-lg text-white font-semibold mb-2">Playlist</h4>
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



















// import React from 'react';

// interface Track {
//   url: string;
//   title: string;
//   tags: string[];
// }

// interface PlaylistProps {
//   tracks: Track[];
//   currentTrackIndex: number;
//   handleSongSelect: (index: number) => void;
// }

// const Playlist: React.FC<PlaylistProps> = ({ tracks, currentTrackIndex, handleSongSelect }) => {
//   return (
//     <div className="h-[32rem] bg-gray-800 p-4 flex flex-col mt-4">
//       <h4 className="text-lg text-white font-semibold mb-4">Playlist</h4>
//       <ul className="flex-grow overflow-y-auto">
//         {tracks.map((track, index) => (
//           <li
//             key={index}
//             onClick={() => handleSongSelect(index)}
//             className={`p-2 m-2 rounded-lg cursor-pointer text-slate-300 ${
//               index === currentTrackIndex ? 'bg-blue-500' : 'hover:bg-gray-700'
//             }`}
//           >
//             {track.title}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Playlist;
