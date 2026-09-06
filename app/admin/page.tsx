'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BarChart3, ExternalLink, ListMusic, Settings, UploadCloud } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import './admin.css';

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
  useEffect(() => { const saved = window.localStorage.getItem('phumtify-site-name'); if (saved) { setSiteName(saved); setSavedName(saved); } loadTracks(); }, []);
  const categories = useMemo(() => tracks.reduce<Record<string, number>>((acc, track) => { const key = categorize(track); acc[key] = (acc[key] ?? 0) + 1; return acc; }, {}), [tracks]);
  const artists = useMemo(() => tracks.reduce<Record<string, number>>((acc, track) => { acc[track.artist] = (acc[track.artist] ?? 0) + 1; return acc; }, {}), [tracks]);
  const topArtists = Object.entries(artists).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxArtistCount = Math.max(1, ...topArtists.map(([, count]) => count));
  const saveSettings = (e: FormEvent) => { e.preventDefault(); const value = siteName.trim() || 'Phumtify'; window.localStorage.setItem('phumtify-site-name', value); setSavedName(value); };
  const pick = (setter: (file: File | null) => void) => (e: ChangeEvent<HTMLInputElement>) => setter(e.target.files?.[0] || null);
  async function deleteTrack(track: AdminTrack) { const client=supabase; if(!client || !window.confirm(`ลบเพลง “${track.title}” และไฟล์ที่เกี่ยวข้องใช่ไหม?`)) return; setMessage('กำลังลบเพลง...'); try { const files: Record<string,string[]> = { audio: [], covers: [], lyrics: [] }; for (const [bucket, url] of Object.entries({ audio: track.url, covers: track.cover_url, lyrics: track.lrc_url })) { if (url) { const marker=`/storage/v1/object/public/${bucket}/`; const index=url.indexOf(marker); if(index>=0) files[bucket].push(decodeURIComponent(url.slice(index+marker.length))); } } for (const bucket of Object.keys(files)) if(files[bucket].length) { const removed=await client.storage.from(bucket).remove(files[bucket]); if(removed.error) throw removed.error; } const result=await client.from('tracks').delete().eq('id',track.id); if(result.error) throw result.error; for (const bucket of Object.keys(files)) if(files[bucket].length) await client.storage.from(bucket).remove(files[bucket]); setMessage('ลบเพลงเรียบร้อยแล้ว'); loadTracks(); } catch(error) { setMessage(error instanceof Error ? error.message : 'ลบเพลงไม่สำเร็จ'); } }
  async function submit(e: FormEvent) { e.preventDefault(); const client = supabase; if (!client || !audio || !title || !artist) { setMessage('กรุณาตั้งค่า Supabase และกรอกข้อมูลให้ครบ'); return; } setBusy(true); setMessage('กำลังอัปโหลด...'); try { const id = crypto.randomUUID(); const upload = async (bucket: string, file: File, ext: string) => { const result = await client.storage.from(bucket).upload(`${id}.${ext}`, file, { upsert: true }); if (result.error) throw result.error; return client.storage.from(bucket).getPublicUrl(`${id}.${ext}`).data.publicUrl; }; const url = await upload('audio', audio, 'mp3'); const cover_url = cover ? await upload('covers', cover, cover.name.split('.').pop() || 'jpg') : null; const lrc_url = lrc ? await upload('lyrics', lrc, 'lrc') : null; const result = await client.from('tracks').insert({ id, title, artist, url, cover_url, lrc_url }); if (result.error) throw result.error; setMessage('อัปโหลดสำเร็จแล้ว'); setTitle(''); setArtist(''); setAudio(null); setCover(null); setLrc(null); loadTracks(); } catch (error) { setMessage(error instanceof Error ? error.message : 'อัปโหลดไม่สำเร็จ'); } finally { setBusy(false); } }

  return <main className="admin-page"><Link href="/" className="back-link"><ArrowLeft size={17}/>กลับหน้าหลัก</Link><div className="admin-shell"><header className="admin-top"><div><p className="eyebrow">ADMIN DASHBOARD</p><h1>{savedName || 'Phumtify'}</h1><p>จัดการคลังเพลง วิเคราะห์ข้อมูล และตั้งค่าเว็บ</p></div><div className="admin-actions"><Link href="/" className="admin-outline"><ExternalLink size={15}/>ดูหน้าเว็บ</Link><Link href="/library" className="admin-outline"><ListMusic size={15}/>คลังเพลง</Link></div></header><div className="stats-grid"><div className="stat-card"><BarChart3 size={20}/><strong>{tracks.length}</strong><span>เพลงทั้งหมด</span></div><div className="stat-card"><ListMusic size={20}/><strong>{Object.keys(artists).length}</strong><span>ศิลปิน</span></div><div className="stat-card"><UploadCloud size={20}/><strong>{Object.keys(categories).length}</strong><span>หมวดอัตโนมัติ</span></div></div><div className="analytics-grid"><section className="analytics-card"><div className="analytics-title"><div><p className="eyebrow">ANALYTICS</p><h2>เพลงตามศิลปิน</h2></div><BarChart3 size={20}/></div>{topArtists.length ? <div className="bar-chart">{topArtists.map(([name, count]) => <div className="bar-row" key={name}><span>{name}</span><div><i style={{width:`${(count / maxArtistCount) * 100}%`}} /></div><b>{count}</b></div>)}</div> : <p className="form-message">ยังไม่มีข้อมูลสำหรับกราฟ</p>}</section><section className="analytics-card"><div className="analytics-title"><div><p className="eyebrow">SMART CATEGORIES</p><h2>แยกหมวดอัตโนมัติ</h2></div><span className="auto-badge">AUTO</span></div><div className="category-grid">{Object.entries(categories).map(([name, count]) => <div className="category-pill" key={name}><strong>{count}</strong><span>{name}</span></div>)}</div><p className="analytics-note">ระบบวิเคราะห์จากชื่อเพลงและศิลปิน สามารถปรับหมวดเพิ่มได้ภายหลัง</p></section></div><div className="admin-columns"><div className="admin-card"><div className="admin-heading"><UploadCloud size={25}/><div><p className="eyebrow">LIBRARY MANAGEMENT</p><h1>เพิ่มเพลงเข้าคลัง</h1></div></div><form onSubmit={submit}><label>ชื่อเพลง<input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="ชื่อเพลง"/></label><label>ศิลปิน<input value={artist} onChange={(e)=>setArtist(e.target.value)} placeholder="ชื่อศิลปิน"/></label><label>ไฟล์ MP3<input type="file" accept="audio/mpeg,.mp3" onChange={pick(setAudio)}/></label><label>รูปปก <span className="optional">(ไม่บังคับ)</span><input type="file" accept="image/*" onChange={pick(setCover)}/></label><label>เนื้อเพลง LRC <span className="optional">(ไม่บังคับ)</span><input type="file" accept=".lrc,text/plain" onChange={pick(setLrc)}/></label><button className="primary-button" disabled={busy}>{busy?'กำลังอัปโหลด...':'อัปโหลดเพลง'}</button>{message&&<p className="form-message">{message}</p>}</form></div><div className="admin-card admin-list"><div className="admin-heading"><ListMusic size={25}/><div><p className="eyebrow">YOUR LIBRARY</p><h2>เพลงในคลัง</h2></div></div>{tracks.length ? tracks.map((track) => <div className="admin-track" key={track.id}><span>♪</span><div><strong>{track.title}</strong><small>{track.artist}</small></div><em>{categorize(track)}</em><button type="button" className="delete-track" onClick={() => deleteTrack(track)}>ลบ</button></div>) : <p className="form-message">ยังไม่มีเพลงในคลัง</p>}<div className="settings-box"><div className="admin-heading"><Settings size={20}/><h2>ตั้งค่าเว็บ</h2></div><form onSubmit={saveSettings}><label>ชื่อเว็บไซต์<input value={siteName} onChange={(e) => setSiteName(e.target.value)} /></label><button className="primary-button">บันทึกชื่อเว็บ</button></form></div></div></div></div></main>;
}




