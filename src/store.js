import { create } from 'zustand'

export const useAppStore = create((set) => ({
  steamId: '',
  profile: null,
  games: [],
  cs2Stats: null,
  news: [],
  loading: false,
  setSteamId: (steamId) => set({ steamId }),
  setProfile: (profile) => set({ profile }),
  setGames: (games) => set({ games }),
  setCs2Stats: (cs2Stats) => set({ cs2Stats }),
  setNews: (news) => set({ news }),
  setLoading: (loading) => set({ loading }),
}))
