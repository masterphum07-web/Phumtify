'use client';

import Link from 'next/link';
import { ChevronDown, Heart, ListPlus, Pause, Play, Repeat, Shuffle, SkipBack, SkipForward } from 'lucide-react';
import { usePlayerStore } from '../../lib/player-store';
import type { Track } from '../../lib/player-store';

const demo: Track = { id: 'demo-trex', title: 'Demo Audio Test', artist: 'MDN CC0 Sample', url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3', color: 'from-violet-500 to-fuchsia-500' };
const lyrics = ['ตัวอย่างเนื้อเพลง', 'เลือกเพลงจากคลังเพื่อดูเนื้อเพลงของคุณ', 'เนื้อเพลงจะแสดงและเลื่อนตามจังหวะเพลง', 'คุณสามารถเลื่อนดูเนื้อหาได้ตามต้องการ'];

export default function PlayerPage() {
  const track = usePlayerStore((s) => s.currentTrack) ?? demo;
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const isShuffle = usePlayerStore((s) => s.isShuffle);
  const repeatMode = usePlayerStore((s) => s.repeatMode);
  const liked = usePlayerStore((s) => s.likedIds.includes(track.id));
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);
  const playTrack = usePlayerStore((s) => s.playTrack);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const next = usePlayerStore((s) => s.next);
  const previous = usePlayerStore((s) => s.previous);
  const seek = usePlayerStore((s) => s.seek);
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle);
  const cycleRepeat = usePlayerStore((s) => s.cycleRepeat);
  const toggleLike = usePlayerStore((s) => s.toggleLike);
  const addToQueue = usePlayerStore((s) => s.addToQueue);
  const time = (value: number) => `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`;
  return <main className={`full-player bg-gradient-to-br ${track.color ?? 'from-violet-700 to-slate-950'}`}><div className="player-backdrop" /><header className="full-player-header"><Link href="/" aria-label="ปิดหน้าเล่นเพลง"><ChevronDown size={28} /></Link><span>กำลังเล่น</span><button type="button" aria-label="ตัวเลือก"><span>•••</span></button></header><section className="player-main"><div className="large-cover">♪</div><div className="full-track-meta"><div><h1>{track.title}</h1><p>{track.artist}</p></div><button type="button" className={liked ? 'liked' : ''} aria-label="เพลงที่ชอบ" onClick={() => toggleLike(track.id)}><Heart size={24} fill={liked ? 'currentColor' : 'none'} /></button></div><input className="full-progress" type="range" min="0" max={duration || 0.1} value={Math.min(currentTime, duration || 0.1)} step="0.1" onChange={(e) => seek(Number(e.target.value))} aria-label="ตำแหน่งเพลง" /><div className="time-row"><span>{time(currentTime)}</span><span>{time(duration)}</span></div><div className="full-controls"><button type="button" className={isShuffle ? 'active-control' : ''} onClick={toggleShuffle} title={isShuffle ? 'ปิดสุ่มเพลง' : 'เปิดสุ่มเพลง'}><Shuffle size={22} /></button><button type="button" onClick={previous} disabled={!usePlayerStore.getState().currentTrack}><SkipBack size={30} fill="currentColor" /></button><button type="button" className="full-play" onClick={() => { if (!usePlayerStore.getState().currentTrack) playTrack(track, [track]); else togglePlay(); }} aria-label={isPlaying ? 'หยุดเพลง' : 'เล่นเพลง'}>{isPlaying ? <Pause size={30} fill="currentColor" /> : <Play size={30} fill="currentColor" />}</button><button type="button" onClick={next}><SkipForward size={30} fill="currentColor" /></button><button type="button" className={repeatMode !== 'off' ? 'active-control' : ''} onClick={cycleRepeat} title="เปลี่ยนโหมดเล่นซ้ำ"><Repeat size={22} /></button></div><div className="player-extra"><button type="button" onClick={() => addToQueue(track)}><ListPlus size={21} />เพิ่มเข้าคิว</button><Link href="/library">เปิดคลังเพลง</Link></div><div className="lyrics-panel"><h2>เนื้อเพลง</h2>{lyrics.map((line, index) => <p className={index === 0 ? 'lyrics-active' : ''} key={line}>{line}</p>)}</div></section></main>;
}

