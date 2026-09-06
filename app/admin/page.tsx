Warning: truncated output (original token count: 2590)
Total output lines: 54

'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BarChart3, ExternalLink, ListMusic, Settings, UploadCloud } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import './admin.css';
import './compact.css';

type AdminTrack = { id: string; title: string; artist: string; created_at: string; url?: string; cover_url?: string | null; lrc_url?: string | null };

const categorize = (track: AdminTrack) => {
  const text = `${track.title} ${track.artist}`.toLowerCase();
  if (/work|focus|study|ทำงาน|เรียน/.test(text)) return 'ทำงาน / โฟกัส';
  if (/chill|sleep|lofi|พัก|นอน/.test(text)) return 'Chill / Relax';
  if (/love|รัก|ใจ|sad|เศร้า/.test(text)) return 'Love / Mood';
  if (/thai|ไทย/.test(text)) return 'เพลงไทย';
  return 'อื่นๆ';
};

export default function AdminPage() {
  const [tracks, setTracks] = useState<AdminTrack[]>([]);
  const [siteName, setSiteName] = useState('Phumtify');
  const [savedName, setSavedName] = useState('');
  const [audio, setAudio] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [lrc, setLrc] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [showAllTracks, setShowAllTracks] = useState(false);

  const loadTracks = () => { if (supabase) supabase.from('tracks').select('id,title,artist,created_at,url,cover_url,lrc_url').order('created_at', { ascending: false }).then(({ data }) => setTracks(data ?? [])); };
  useEffect(() => { if (window.location.search.includes('all=1')) setShowAllTracks(true); const saved = window.localStorage.getItem('phumtify-site-name'); if (saved) { s…1590 tokens truncated…laceholder="ชื่อศิลปิน"/></label><label>ไฟล์ MP3<input type="file" accept="audio/mpeg,.mp3" onChange={pick(setAudio)}/></label><label>รูปปก <span className="optional">(ไม่บังคับ)</span><input type="file" accept="image/*" onChange={pick(setCover)}/></label><label>เนื้อเพลง LRC <span className="optional">(ไม่บังคับ)</span><input type="file" accept=".lrc,text/plain" onChange={pick(setLrc)}/></label><button className="primary-button" disabled={busy}>{busy?'กำลังอัปโหลด...':'อัปโหลดเพลง'}</button>{message&&<p className="form-message">{message}</p>}</form></div><div className={`admin-card admin-list ${showAllTracks ? "show-all" : ""}`}><div className="admin-heading"><ListMusic size={25}/><div><p className="eyebrow">YOUR LIBRARY</p><h2>เพลงในคลัง</h2></div></div>{tracks.length ? tracks.map((track) => <div className="admin-track" key={track.id}><span>♪</span><div><strong>{track.title}</strong><small>{track.artist}</small></div><em>{categorize(track)}</em><button type="button" className="delete-track" onClick={() => deleteTrack(track)}>ลบ</button></div>) : <p className="form-message">ยังไม่มีเพลงในคลัง</p>}<Link href="/library" className="admin-outline admin-all-link"><ListMusic size={15}/>ดูเพลงทั้งหมด</Link><Link href="/admin?all=1" className="admin-outline admin-all-link"><ListMusic size={15}/>ดูเพลงทั้งหมด</Link><div className="settings-box"><div className="admin-heading"><Settings size={20}/><h2>ตั้งค่าเว็บ</h2></div><form onSubmit={saveSettings}><label>ชื่อเว็บไซต์<input value={siteName} onChange={(e) => setSiteName(e.target.value)} /></label><button className="primary-button">บันทึกชื่อเว็บ</button></form></div></div></div></div></main>;
}








