'use client';
import { useEffect, useMemo, useRef } from 'react';
import { usePlayerStore } from '@/lib/player-store';
import { parseLrc } from '@/lib/lyrics';
export function LyricsView({ source }: { source: string }) { const time=usePlayerStore((s)=>s.currentTime); const lines=useMemo(()=>parseLrc(source),[source]); const active=lines.reduce((i,l,n)=>l.time<=time?n:i,0); const ref=useRef<HTMLParagraphElement>(null); useEffect(()=>{ref.current?.scrollIntoView({behavior:'smooth',block:'center'});},[active]); return <div className="lyrics-panel">{lines.map((line,i)=><p key={`${line.time}-${i}`} ref={i===active?ref:undefined} className={i===active?'active':''}>{line.text}</p>)}</div>; }
