'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, Home as HomeIcon, Library, ListMusic, MoreHorizontal, Pause, Play, Repeat, Search, Shuffle, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import type { Track } from '../lib/player-store';
import { usePlayerStore } from '../lib/player-store';
import { supabase } from '../lib/supabase';

const coverColors = ['from-violet-500 to-fuchsia-500', 'from-amber-400 to-orange-600', 'from-cyan-400 to-blue-700', 'from-emerald-400 to-teal-700'];

const formatTime = (value: number) => `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`;

export default function Home() {
  const [tracks, setTracks] = useState<Track[]>([]);
  useEffect(() => { let active = true; if (!supabase) return; supabase.from('tracks').select('*').order('created_at', { ascending: false }).then(({ data }) => { if (active) setTracks((data ?? []).map((track, index) => ({ id: track.id, title: track.title, artist: track.artist, album: track.album ?? undefined, url: track.url, coverUrl: track.cover_url ?? undefined, lrcUrl: track.lrc_url ?? undefined, color: coverColors[index % coverColors.length] }))); }); return () => { active = false; }; }, []);
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const isShuffle = usePlayerStore((s) => s.isShuffle);
  const repeatMode = usePlayerStore((s) => s.repeatMode);
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);
  const volume = usePlayerStore((s) => s.volume);
  const playTrack = usePlayerStore((s) => s.playTrack);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const next = usePlayerStore((s) => s.next);
  const previous = usePlayerStore((s) => s.previous);
  const seek = usePlayerStore((s) => s.seek);
  const setVolume = usePlayerStore((s) => s.setVolume);
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle);
  const cycleRepeat = usePlayerStore((s) => s.cycleRepeat);
  const likedIds = usePlayerStore((s) => s.likedIds);
  const toggleLike = usePlayerStore((s) => s.toggleLike);
  const playNext = usePlayerStore((s) => s.playNext);
  const addToQueue = usePlayerStore((s) => s.addToQueue);
  const removeFromQueue = usePlayerStore((s) => s.removeFromQueue);
  const queue = usePlayerStore((s) => s.queue);
  const [queueOpen, setQueueOpen] = useState(false);
  const progress = useMemo(() => duration > 0 ? (currentTime / duration) * 100 : 0, [currentTime, duration]);

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">♪</span><span>Phumtify</span></div>
      <nav className="nav-group">
        <Link className="nav-link active" href="/"><HomeIcon size={20} /><span>หน้าหลัก</span></Link>
        <button className="nav-link" type="button" onClick={() => document.getElementById('search')?.focus()}><Search size={20} /><span>ค้นหา</span></button>
        <Link className="nav-link" href="/library"><Library size={20} /><span>คลังเพลง</span></Link><Link className="nav-link" href="/player"><Play size={20} /><span>กำลังเล่น</span></Link>
      </nav>
      <div className="nav-section"><div className="section-label"><span>เพลย์ลิสต์</span><ListMusic size={15} /></div><button className="playlist-link" type="button" onClick={() => tracks[0] && playTrack(tracks[0], tracks)}><Play size={14} />ทดลองฟัง</button></div>
      <Link className="nav-link" href="/admin"><ListMusic size={18} />จัดการเพลง</Link>
    </aside>
    <main className="content-area">
      <header className="topbar"><div className="history"><button type="button" aria-label="ย้อนกลับ"><ChevronLeft size={18} /></button><button type="button" aria-label="ไปข้างหน้า"><ChevronRight size={18} /></button></div><input id="search" className="search-input" placeholder="ค้นหาเพลง ศิลปิน หรืออัลบั้ม" /><div className="profile"><span>ผู้ฟังส่วนตัว</span><span className="avatar">P</span></div></header>
      <section className="content-scroll" id="library">
        <div className="hero"><div><p className="eyebrow">PERSONAL MUSIC SPACE</p><h1>เพลงของคุณ<br /><span>เล่นได้ทุกที่</span></h1><p className="hero-copy">คลังเพลงส่วนตัว ไม่มีโฆษณา พร้อมเล่นต่อเนื่องแม้ล็อกหน้าจอ</p><button className="primary-button" type="button" onClick={() => playTrack(tracks[0], tracks)}><Play size={16} fill="currentColor" />เริ่มฟังเพลง</button></div><div className="hero-orb">♫</div></div>
        <div className="section-heading"><div><p className="eyebrow">QUICK PICKS</p><h2>เพลงแนะนำ</h2></div><button type="button" className="text-button" onClick={() => playTrack(tracks[0], tracks)}>เล่นทั้งหมด</button></div><div className="player-guide"><span><Shuffle size={14} /> สุ่มเพลง: {isShuffle ? 'เปิดอยู่' : 'ปิดอยู่'}</span><span><Repeat size={14} /> เล่นซ้ำ: {repeatMode === 'off' ? 'ปิดอยู่' : repeatMode === 'all' ? 'ทั้งหมด' : 'เพลงเดียว'}</span><small>กดไอคอนด้านล่างเพื่อเปลี่ยนโหมด</small></div>
        <div className="track-grid">{tracks.length ? tracks.map((track) => <article className={`track-card ${currentTrack?.id === track.id ? 'selected' : ''}`} key={track.id} onClick={() => playTrack(track, tracks)}><div className={`cover-art bg-gradient-to-br ${track.color}`}><span>♪</span><button type="button" aria-label={`เล่น ${track.title}`} onClick={(e) => { e.stopPropagation(); playTrack(track, tracks); }}><Play size={18} fill="currentColor" /></button></div><div className="track-actions"><button type="button" aria-label={likedIds.includes(track.id) ? 'นำออกจากเพลงที่ชอบ' : 'เพิ่มในเพลงที่ชอบ'} className={likedIds.includes(track.id) ? 'liked' : ''} onClick={(e) => { e.stopPropagation(); toggleLike(track.id); }}><Heart size={15} fill={likedIds.includes(track.id) ? 'currentColor' : 'none'} /></button><button type="button" onClick={(e) => { e.stopPropagation(); playNext(track); }}>เล่นถัดไป</button><button type="button" onClick={(e) => { e.stopPropagation(); addToQueue(track); }}>เพิ่มเข้าคิว</button></div><h3>{track.title}</h3><p>{track.artist}</p></article>) : <p className="empty-state">ยังไม่มีเพลงในคลัง ไปที่ “จัดการเพลง” เพื่ออัปโหลดเพลงแรกของคุณ</p>}</div>
      </section>
    </main>
    {queueOpen && <div className="queue-panel"><div className="queue-panel-header"><div><p className="eyebrow">UP NEXT</p><h2>คิวเพลง</h2></div><button type="button" onClick={() => setQueueOpen(false)} aria-label="ปิดคิวเพลง">×</button></div><p className="queue-caption">{queue.length ? `${queue.length} เพลงในคิว • เพลงที่เลือกจะเล่นต่อจากเพลงปัจจุบัน` : 'ยังไม่มีเพลงในคิว'}</p><div className="queue-items">{queue.map((item, index) => <div className={`queue-item ${currentTrack?.id === item.id ? 'current' : ''}`} key={item.id}><button type="button" className="queue-play" onClick={() => playTrack(item, queue)}><span>{index + 1}</span><span><strong>{item.title}</strong><small>{item.artist}</small></span></button>{currentTrack?.id !== item.id && <button type="button" className="queue-remove" onClick={() => removeFromQueue(item.id)} aria-label={`ลบ ${item.title} ออกจากคิว`}>×</button>}</div>)}</div></div>}
    <footer className="player"><Link href="/player" className="now-playing" aria-label="เปิดหน้าเพลงที่กำลังเล่น">{currentTrack ? <div className={`mini-cover bg-gradient-to-br ${currentTrack.color ?? 'from-violet-500 to-fuchsia-500'}`}>♪</div> : <div className="mini-cover">♪</div>}<div><strong>{currentTrack?.title ?? 'ยังไม่มีเพลงที่เล่น'}</strong><span>{currentTrack?.artist ?? 'เลือกเพลงเพื่อเริ่มฟัง'}</span></div><button type="button" className={currentTrack && likedIds.includes(currentTrack.id) ? 'liked' : ''} aria-label="เพลงที่ชอบ" onClick={() => currentTrack && toggleLike(currentTrack.id)}><Heart size={16} fill={currentTrack && likedIds.includes(currentTrack.id) ? 'currentColor' : 'none'} /></button></Link><div className="player-controls"><div className="control-row"><button type="button" aria-label="สุ่มเพลง" className={isShuffle ? 'active-control' : ''} onClick={toggleShuffle}><Shuffle size={16} /></button><button type="button" aria-label="เพลงก่อนหน้า" onClick={previous} disabled={!currentTrack}><SkipBack size={18} /></button><button type="button" className="play-button" aria-label={isPlaying ? 'หยุดชั่วคราว' : 'เล่นเพลง'} onClick={togglePlay} disabled={!currentTrack}>{isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}</button><button type="button" aria-label="เพลงถัดไป" onClick={next} disabled={!currentTrack}><SkipForward size={18} /></button><button type="button" aria-label="วนซ้ำ" className={repeatMode !== 'off' ? 'active-control' : ''} onClick={cycleRepeat}><Repeat size={16} /></button></div><div className="progress"><span>{formatTime(currentTime)}</span><input className="progress-range" type="range" min="0" max={duration || 0.1} step="0.1" value={Math.min(currentTime, duration || 0.1)} onChange={(e) => seek(Number(e.target.value))} style={{ '--progress': `${progress}%` } as React.CSSProperties} aria-label="ตำแหน่งเพลง" /><span>{formatTime(duration)}</span></div></div><div className="volume"><Volume2 size={16} /><input className="volume-range" type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(Number(e.target.value))} aria-label="ระดับเสียง" /><button type="button" className="queue-open" onClick={() => setQueueOpen(true)} aria-label="เปิดคิวเพลง" title="เปิดคิวเพลง"><MoreHorizontal size={18} /></button></div></footer>
  </div>;
}













