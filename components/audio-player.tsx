'use client';

import { useEffect, useRef } from 'react';
import { usePlayerStore } from '@/lib/player-store';

export function AudioEngine() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const track = usePlayerStore((state) => state.currentTrack);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const volume = usePlayerStore((state) => state.volume);
  const repeatMode = usePlayerStore((state) => state.repeatMode);
  const { setPlaying, next, setProgress } = usePlayerStore();

  useEffect(() => { const audio = audioRef.current; if (!audio || !track) return; audio.src = track.url; audio.load(); if (isPlaying) void audio.play().catch(() => setPlaying(false)); }, [track]);
  useEffect(() => { const audio = audioRef.current; if (!audio) return; audio.volume = volume; if (isPlaying && track) void audio.play().catch(() => setPlaying(false)); else audio.pause(); }, [isPlaying, volume, track, setPlaying]);
  useEffect(() => { const audio = audioRef.current; if (!audio) return; const onTime = () => setProgress(audio.currentTime, audio.duration || 0); const onEnded = () => { if (repeatMode === 'one') { audio.currentTime = 0; void audio.play(); } else next(); }; audio.addEventListener('timeupdate', onTime); audio.addEventListener('ended', onEnded); return () => { audio.removeEventListener('timeupdate', onTime); audio.removeEventListener('ended', onEnded); }; }, [next, repeatMode, setProgress]);
  useEffect(() => { if (!('mediaSession' in navigator) || !track) return; navigator.mediaSession.metadata = new MediaMetadata({ title: track.title, artist: track.artist, album: track.album || 'MySpotify', artwork: track.coverUrl ? [{ src: track.coverUrl }] : [] }); navigator.mediaSession.setActionHandler('play', () => setPlaying(true)); navigator.mediaSession.setActionHandler('pause', () => setPlaying(false)); navigator.mediaSession.setActionHandler('nexttrack', next); }, [track, next, setPlaying]);
  return <audio ref={audioRef} preload="metadata" aria-hidden="true" />;
}

