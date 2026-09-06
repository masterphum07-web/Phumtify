'use client';

import Link from 'next/link';
import { Heart, Home, Library, Youtube, ListMusic, Pause, Play, Search, Upload } from 'lucide-react';
import type { Track } from '../../lib/player-store';
import { useEffect, useState } from 'react';
import { usePlayerStore } from '../../lib/player-store';
import { supabase } from '../../lib/supabase';
import './library.css';

const coverColors = ['from-violet-500 to-fuchsia-500', 'from-amber-400 to-orange-600', 'from-cyan-400 to-blue-700', 'from-emerald-400 to-teal-700'];



export default function LibraryPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  useEffect(() => { let active = true; if (!supabase) return; supabase.from('tracks').select('*').order('created_at', { ascending: false }).then(({ data }) => { if (active) setTracks((data ?? []).map((track, index) => ({ id: track.id, title: track.title, artist: track.artist, album: track.album ?? undefined, url: track.url, coverUrl: track.cover_url ?? undefined, lrcUrl: track.lrc_url ?? undefined, color: coverColors[index % coverColors.length] }))); }); return () => { active = false; }; }, []);
  const cards = [
    { title: 'เพลงที่ชอบ', subtitle: 'เพลงที่คุณกดถูกใจ', icon: '♥', color: 'from-pink-500 to-rose-700', tracks },
    { title: 'เพลงที่เล่นล่าสุด', subtitle: 'กลับไปฟังต่อได้ทันที', icon: '◷', color: 'from-blue-500 to-indigo-700', tracks: tracks.slice(0, 3) },
    { title: 'เพลงฟังตอนทำงาน', subtitle: 'เพลย์ลิสต์ของคุณ', icon: '♫', color: 'from-amber-400 to-orange-700', tracks: tracks.slice(1, 4) },
  ];
  const playTrack = usePlayerStore((s) => s.playTrack);
  const current = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  return <div className="app-shell"><aside className="sidebar"><div className="brand"><span className="brand-mark"><img src="/Phumtify/phumtify-logo.png" alt="" /></span><span>Phumtify</span></div><nav className="nav-group"><Link className="nav-link" href="/"><Home size={20} /><span>หน้าหลัก</span></Link><button className="nav-link" type="button"><Search size={20} /><span>ค้นหา</span></button><Link className="nav-link active" href="/library"><Library size={20} /><span>คลังเพลง</span></Link><Link className="nav-link" href="/player"><Play size={20} /><span>กำลังเล่น</span></Link></nav><div className="nav-section"><div className="section-label"><span>เพลย์ลิสต์</span><ListMusic size={15} /></div><button className="playlist-link" type="button" onClick={() => playTrack(tracks[0], tracks)}><Play size={14} />เพลงที่ชอบ</button><button className="playlist-link" type="button" onClick={() => playTrack(tracks[1], tracks)}>เพลงฟังตอนทำงาน</button></div><Link className="nav-link" href="/admin"><Upload size={20} /><span>จัดการเพลง</span></Link></aside><main className="content-area"><header className="topbar"><div className="profile">คลังเพลงของฉัน <span className="avatar">P</span></div></header><section className="content-scroll"><p className="eyebrow">YOUR LIBRARY</p><h1 className="page-title">คลังเพลง</h1><p className="hero-copy">รวมเพลงและเพลย์ลิสต์ทั้งหมดของคุณไว้ในที่เดียว</p><div className="library-cards">{cards.map((card) => <button type="button" className="library-card" key={card.title} onClick={() => playTrack(card.tracks[0], card.tracks)}><div className={`library-card-icon bg-gradient-to-br ${card.color}`}>{card.icon}</div><div><h2>{card.title}</h2><p>{card.subtitle}</p><span>{card.tracks.length} เพลง</span></div><Play size={20} /></button>)}</div><div className="section-heading"><div><p className="eyebrow">ALL TRACKS</p><h2>เพลงทั้งหมด</h2></div><button className="text-button" type="button" onClick={() => playTrack(tracks[0], tracks)}>เล่นทั้งหมด</button></div><div className="library-list">{tracks.map((track, index) => <button type="button" className={`library-row ${current?.id === track.id ? 'selected' : ''}`} key={track.id} onClick={() => playTrack(track, tracks)}><span>{index + 1}</span><span className={`mini-cover ${track.coverUrl ? '' : 'no-cover'}`}>{track.coverUrl ? <img src={track.coverUrl} alt="" /> : "ยังไม่มีปก"}</span><span className="library-row-info"><strong>{track.title}</strong><small>{track.artist}</small></span><Heart size={16} /></button>)}</div></section></main>{current && <footer className="library-mini-player"><Link href="/player" className="library-mini-info"><span className={`mini-cover ${current.coverUrl ? '' : 'no-cover'}`}>{current.coverUrl ? <img src={current.coverUrl} alt="" /> : "♪"}</span><span><strong>{current.title}</strong><small>{current.artist}</small></span></Link><button type="button" className="library-mini-play" onClick={togglePlay} aria-label={isPlaying ? 'หยุดเพลง' : 'เล่นเพลง'}>{isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}</button></footer>}</div>;
}






















