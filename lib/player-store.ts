import { create } from 'zustand';

export type RepeatMode = 'off' | 'all' | 'one';
export type Track = { id: string; title: string; artist: string; album?: string; url: string; coverUrl?: string; lrcUrl?: string; duration?: number; color?: string };

type PlayerState = {
  currentTrack: Track | null; queue: Track[]; queueIndex: number; isPlaying: boolean; volume: number; isShuffle: boolean; repeatMode: RepeatMode; currentTime: number; duration: number;
  playTrack: (track: Track, queue?: Track[]) => void; togglePlay: () => void; setPlaying: (value: boolean) => void; next: () => void; previous: () => void; seek: (time: number) => void; setVolume: (value: number) => void; toggleShuffle: () => void; cycleRepeat: () => void; setProgress: (time: number, duration: number) => void;
};

const shuffle = <T,>(items: T[]) => { const result = [...items]; for (let i = result.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; } return result; };

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null, queue: [], queueIndex: -1, isPlaying: false, volume: 0.8, isShuffle: false, repeatMode: 'off', currentTime: 0, duration: 0,
  playTrack: (track, queue = [track]) => { const list = queue.length ? queue : [track]; const index = list.findIndex((item) => item.id === track.id); set({ currentTrack: track, queue: list, queueIndex: index < 0 ? 0 : index, isPlaying: true, currentTime: 0 }); },
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })), setPlaying: (value) => set({ isPlaying: value }),
  next: () => set((state) => { if (!state.queue.length) return state; if (state.repeatMode === 'one') return { ...state, isPlaying: true, currentTime: 0 }; const list = state.isShuffle ? shuffle(state.queue) : state.queue; const nextIndex = state.queueIndex + 1; if (nextIndex >= list.length && state.repeatMode === 'off') return { ...state, isPlaying: false }; const index = nextIndex >= list.length ? 0 : nextIndex; return { ...state, queue: list, queueIndex: index, currentTrack: list[index], isPlaying: true, currentTime: 0 }; }),
  previous: () => set((state) => { if (!state.queue.length) return state; const index = state.queueIndex <= 0 ? state.queue.length - 1 : state.queueIndex - 1; return { ...state, queueIndex: index, currentTrack: state.queue[index], isPlaying: true, currentTime: 0 }; }),
  seek: (time) => set({ currentTime: time }), setVolume: (value) => set({ volume: Math.max(0, Math.min(1, value)) }), toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })), cycleRepeat: () => set((state) => ({ repeatMode: state.repeatMode === 'off' ? 'all' : state.repeatMode === 'all' ? 'one' : 'off' })), setProgress: (currentTime, duration) => set({ currentTime, duration }),
}));

