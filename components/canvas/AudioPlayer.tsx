"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipForward,
  SkipBack,
} from "lucide-react";
import tracks from "@/lib/tracks";
import Playlist from "./Playlist";

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const AudioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isClient, setIsClient] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  const [lastVisualizerData, setLastVisualizerData] =
    useState<Uint8Array | null>(null);
  const defaultFrequencyData = useRef(new Uint8Array(128).fill(50));

  useEffect(() => {
    setIsClient(true);
  }, []);

  const animateDefault = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    time: number
  ) => {
    const bufferLength = defaultFrequencyData.current.length;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 4;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const value = Math.sin(i * 0.05 + time * 0.002) * 30 + 50;
      defaultFrequencyData.current[i] = value;

      const barHeight = (value / 255) * canvas.height * 0.8;

      const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
      //   gradient.addColorStop(0, '#2c3e50');
      //   gradient.addColorStop(0.5, '#3498db');
      //   gradient.addColorStop(1, '#2980b9');

      gradient.addColorStop(0, "#6a1b9a");
      gradient.addColorStop(0.5, "#ff4081");
      gradient.addColorStop(1, "#448aff");

      ctx.fillStyle = gradient;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

      x += barWidth + 1;
    }
  };

  useEffect(() => {
    if (!isClient || !audioRef.current || audioContextRef.current) return;

    const initializeAudioContext = () => {
      try {
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;

        sourceRef.current = audioContextRef.current.createMediaElementSource(
          audioRef.current!
        );
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
      } catch (error) {
        console.error("Error initializing audio context:", error);
      }
    };

    initializeAudioContext();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isClient]);

  useEffect(() => {
    let animationId: number;
    let startTime = performance.now();

    const draw = (timestamp: number) => {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (isPlaying && analyserRef.current) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);
        setLastVisualizerData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const barWidth = (canvas.width / bufferLength) * 4;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * canvas.height;

          const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
          //   gradient.addColorStop(0, '#4444ff');
          //   gradient.addColorStop(0.5, '#0000ff');
          //   gradient.addColorStop(1, '#000066');

          gradient.addColorStop(0, "#ff4081");
          gradient.addColorStop(0.5, "#7c4dff");
          gradient.addColorStop(1, "#448aff");

          ctx.fillStyle = gradient;
          ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

          x += barWidth + 1;
        }
      } else if (lastVisualizerData && !isPlaying) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const barWidth = (canvas.width / lastVisualizerData.length) * 4;
        let x = 0;

        for (let i = 0; i < lastVisualizerData.length; i++) {
          const barHeight = (lastVisualizerData[i] / 255) * canvas.height;

          const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
          //   gradient.addColorStop(0, '#333399');
          //   gradient.addColorStop(0.5, '#000066');
          //   gradient.addColorStop(1, '#000033');

          gradient.addColorStop(0, "#6a1b9a");
          gradient.addColorStop(0.5, "#ff4081");
          gradient.addColorStop(1, "#448aff");

          ctx.fillStyle = gradient;
          ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

          x += barWidth + 1;
        }
      } else {
        animateDefault(ctx, canvas, timestamp - startTime);
      }

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isPlaying, lastVisualizerData]);

  const currentTrack = tracks[currentTrackIndex];

  const togglePlayPause = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        await audioRef.current.pause();
      } else {
        if (audioContextRef.current?.state === "suspended") {
          await audioContextRef.current.resume();
        }
        await audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error("Error toggling play/pause:", error);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = (e.target as HTMLDivElement).getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setProgress((newTime / audioRef.current.duration) * 100);
  };

  const handleVolumeToggle = () => {
    if (!audioRef.current) return;
    setIsMuted(!isMuted);
    audioRef.current.muted = !isMuted;
  };

  const handleVolumeChange = (value: number[]) => {
    if (audioRef.current) {
      const newVolume = value[0] / 100;
      setVolume(newVolume);
      audioRef.current.volume = newVolume;
    }
  };

  const handleTrackChange = async (newIndex: number) => {
    setCurrentTrackIndex(newIndex);
    setProgress(0);
    setCurrentTime(0);
    setIsPlaying(false);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Error playing track:", error);
      }
    }
  };

  const handleNextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    handleTrackChange(nextIndex);

    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }, 0);
  };

  const handlePreviousTrack = () => {
    const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    handleTrackChange(prevIndex);
  };

  const handleSongSelect = (index: number) => {
    handleTrackChange(index);
  };

  const updateProgress = () => {
    if (audioRef.current) {
      setProgress(
        (audioRef.current.currentTime / audioRef.current.duration) * 100
      );
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <>
      <div className="h-full flex lg:flex-row space-x-4 flex-col ">
        <div className="flex flex-col lg:w-2/3 space-y-4 md:w-full">
          <div className="w-full h-[150px] lg:h-1/2 bg-gray-900 rounded-lg shadow-md">
            <canvas
              ref={canvasRef}
              width="400"
              height="150"
              className="w-full h-full"
            />
          </div>

          <div className="w-full p-4 bg-gray-800 text-white rounded-lg shadow-md">
            <audio
              ref={audioRef}
              src={currentTrack.url}
              onTimeUpdate={updateProgress}
              onLoadedMetadata={onLoadedMetadata}
              onEnded={handleNextTrack}
            />

            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold">{currentTrack.title}</h3>
            </div>

            <div className="flex items-center justify-around mb-4">
              <Button onClick={handleVolumeToggle}>
                {isMuted ? <VolumeX /> : <Volume2 />}
              </Button>

              <Button onClick={handlePreviousTrack}>
                <SkipBack />
              </Button>

              <Button onClick={togglePlayPause}>
                {isPlaying ? <Pause /> : <Play />}
              </Button>

              <Button onClick={handleNextTrack}>
                <SkipForward />
              </Button>

              <Slider
                value={[volume * 100]}
                onValueChange={handleVolumeChange}
                className="w-32 cursor-pointer"
                disabled={isMuted}
              />
            </div>

            <div
              className="relative w-full h-2 bg-gray-600 rounded-full cursor-pointer"
              onClick={handleProgressClick}
            >
              <div
                className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex justify-between mt-2 text-sm">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        <div className="lg:w-1/3 w-full">
          <Playlist
            tracks={tracks}
            currentTrackIndex={currentTrackIndex}
            handleSongSelect={handleSongSelect}
          />
        </div>
      </div>
    </>
  );
};

export default AudioPlayer;
