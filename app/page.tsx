'use client';

import { Home, Library, ListMusic, Search, Settings, Upload, Play, Heart, Plus, ChevronLeft, ChevronRight, Volume2, Shuffle, Repeat2, SkipBack, SkipForward } from 'lucide-react';
import Link from 'next/link';
import { usePlayerStore } from '@/lib/player-store';

const tracks = [
  { id: 'demo-trex', title: 'Demo Audio Test', artist: 'MDN CC0 Sample', url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3', color: 'from-violet-500 to-fuchsia-500' },
  { id: 'demo-sunday', title: 'Sunday Morning', artist: 'Acoustic Collection', url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3', color: 'from-amber-400 to-orange-600' },
  { id: 'demo-ocean', title: 'Ocean Lights', artist: 'Late Night Vibes', url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3', color: 'from-cyan-400 to-blue-700' },
  { id: 'demo-afterglow', title: 'Afterglow', artist: 'Focus Room', url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3', color: 'from-emerald-400 to-teal-700' },
];

export default function HomePage() {
  const playTrack = usePlayerStore((state) => state.playTrack);
  return <main className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">♪</span> MySpotify</div>
      <nav className="nav-group"><a className="nav-link active"><Home size={19} />หน้าหลัก</a><a className="nav-link"><Search size={19} />ค้นหา</a><a className="nav-link"><Library size={19} />คลังเพลง</a></nav>
      <div className="nav-section"><div className="section-label">เพลย์ลิสต์ของคุณ <Plus size={16} /></div><a className="playlist-link"><ListMusic size={17} />เพลงที่ชอบ</a><a className="playlist-link">เพลงฟังตอนทำงาน</a><a className="playlist-link">เพลงโปรดของฉัน</a></div>
      <div className="sidebar-bottom"><Link href="/admin" className="nav-link"><Upload size={18} />จัดการเพลง</Link><a className="nav-link"><Settings size={18} />ตั้งค่า</a></div>
    </aside>
    <section className="content-area">
      <header className="topbar"><div className="history"><button><ChevronLeft size={20}/></button><button><ChevronRight size={20}/></button></div><div className="profile">ผู้ใช้ของฉัน <span className="avatar">P</span></div></header>
      <div className="content-scroll"><section className="hero"><div><p className="eyebrow">คลังเพลงส่วนตัวของคุณ</p><h1>ฟังเพลงที่คุณรัก<br/><span>ในแบบของคุณ</span></h1><p className="hero-copy">เพลงทั้งหมดของคุณ อยู่ในที่เดียว พร้อมฟังได้ทุกเวลา</p><button className="primary-button"><Play size={18} fill="currentColor"/>เริ่มฟังเพลง</button></div><div className="hero-orb" /></section>
        <section className="section-block"><div className="section-heading"><div><p className="eyebrow">คัดสรรมาให้คุณ</p><h2>เพลงที่น่าฟังวันนี้</h2></div><button className="text-button">ดูทั้งหมด</button></div><div className="track-grid">{tracks.map((track) => <article className="track-card" key={track.title} onClick={() => playTrack(track, tracks)}><div className={`cover-art ${track.color}`}><span>♪</span><button className="card-play" aria-label={`เล่น ${track.title}`}><Play size={17} fill="currentColor"/></button></div><h3>{track.title}</h3><p>{track.artist}</p></article>)}</div></section>
      </div>
    </section>
    <footer className="player"><div className="now-playing"><div className="mini-cover from-violet-500 to-fuchsia-500">♪</div><div><strong>ยังไม่มีเพลงที่เล่น</strong><span>เลือกเพลงเพื่อเริ่มฟัง</span></div><Heart size={17}/></div><div className="player-controls"><div className="control-row"><button><Shuffle size={16}/></button><button><SkipBack size={18} fill="currentColor"/></button><button className="play-button"><Play size={19} fill="currentColor"/></button><button><SkipForward size={18} fill="currentColor"/></button><button><Repeat2 size={16}/></button></div><div className="progress"><span>0:00</span><div className="progress-track"><div /></div><span>0:00</span></div></div><div className="volume"><Volume2 size={18}/><div className="volume-track"><div /></div></div></footer>
  </main>;
}

