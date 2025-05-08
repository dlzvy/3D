import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import DanceModel from './DanceModel.jsx';
import './App.css';

// Daftar musik
const musicTracks = [
  {
    id: 'track1',
    name: '🎵 Cute',
    src: 'https://5xbkecsr5ywq6jzsjk4vpm4uuysrz425obaodxapjaszf3qr7sfa.arweave.net/7cKiClHuLQ8nMkq5V7OUpiUc811wQOHcD0glku4R_Io'
  },
  {
    id: 'track2',
    name: '🎶 Yummy',
    src: 'https://lwrzp5rugwpaxntfi6ikgzoufo2l2ld3ilayzbrc2u6hnlybtwiq.arweave.net/XaOX9jQ1ngu2ZUeQo2XUK7S9LHtCwYyGItU8dq8BnZE'
  },
  {
    id: 'track3',
    name: '💃 Cute + Yummy',
    src: 'https://3e5zt64axcqjqrpz5ieo2nw2ns3dv3h47ljyncm6xtciookgmv7a.arweave.net/2TuZ-4C4oJhF-eoI7TbabLY67Pz604aJnrzEhzlGZX4'
  }
];

// Komponen fallback untuk menampilkan jika Canvas error
function FallbackContent() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', 
                 alignItems: 'center', justifyContent: 'center', 
                 background: '#b52e9f', color: 'white', flexDirection: 'column' }}>
      <h2>Model 3D tidak dapat dimuat</h2>
      <p>Silakan periksa konsol untuk detail error</p>
    </div>
  );
}

function App() {
  const [isDancing, setIsDancing] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [canvasError, setCanvasError] = useState(false);
  const audioRef = useRef(null);

  const handleStartDance = () => {
    console.log("Dance Started");
    setIsDancing(true);
  };

  const handleStopDance = () => {
    console.log("Dance Stopped");
    setIsDancing(false);
  };

  const handlePlayMusic = (track) => {
    if (audioRef.current) {
      // Jika track berbeda, ganti sumbernya
      if (currentTrack !== track) {
        audioRef.current.src = track.src;
        setCurrentTrack(track);
      }
      
      audioRef.current.play().catch(err => {
        console.error("Error memutar musik:", err);
        alert("Tidak dapat memutar musik. Periksa konsol untuk info lebih lanjut.");
      });
    }
  };

  const handleStopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setCurrentTrack(null);
    }
  };

  // Periksa apakah WebGL didukung
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setCanvasError(true);
        console.error("WebGL tidak didukung di browser ini");
      }
    } catch (e) {
      setCanvasError(true);
      console.error("Error memeriksa dukungan WebGL:", e);
    }
  }, []);

  return (
    <div className="container">
      {canvasError ? (
        <FallbackContent />
      ) : (
        <Canvas camera={{ position: [0, 4, 5], fov: 50 }}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[3, 5, 5]} intensity={2} castShadow />
          <hemisphereLight intensity={0.5} groundColor="#ffffff" skyColor="#ffffff" />

          {/* Model dengan animasi, dibungkus dalam Suspense untuk error handling */}
          <Suspense fallback={null}>
            <DanceModel isDancing={isDancing} />
          </Suspense>

          {/* Lantai */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial color="#ffffff" metalness={0.3} roughness={0.8} />
          </mesh>

          <OrbitControls enableZoom={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 2} />
        </Canvas>
      )}

      {/* Kontrol */}
      <div className="controls-container">
        <div className="dance-controls">
          <button 
            onClick={handleStartDance} 
            className={`control-btn ${isDancing ? 'active' : ''}`}
          >
            💃 Start Dance
          </button>
          <button 
            onClick={handleStopDance} 
            className="control-btn"
          >
            ⏹ Stop Dance
          </button>
        </div>

        <div className="music-controls">
          {musicTracks.map((track) => (
            <button
              key={track.id}
              onClick={() => handlePlayMusic(track)}
              className={`control-btn ${currentTrack?.id === track.id ? 'active' : ''}`}
            >
              {track.name}
            </button>
          ))}
          <button 
            onClick={handleStopMusic} 
            className="control-btn"
          >
            ⏹ Stop Music
          </button>
        </div>
      </div>

      {/* Musik */}
      <audio ref={audioRef} loop>
        <source src="" type="audio/mpeg" />
      </audio>
    </div>
  );
}

export default App;