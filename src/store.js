import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAppStore = create(
  persist(
    (set, get) => ({
      steamId: '',
      profile: null,
      games: [],
      cs2Stats: null,
      news: [],
      loading: false,
      darkMode: true,
      setSteamId: (steamId) => set({ steamId }),
      setProfile: (profile) => set({ profile }),
      setGames: (games) => set({ games }),
      setCs2Stats: (cs2Stats) => set({ cs2Stats }),
      setNews: (news) => set({ news }),
      setLoading: (loading) => set({ loading }),
      toggleDarkMode: () => set({ darkMode: !get().darkMode }),
    }),
    {
      name: 'steam-dashboard-storage',
      partialize: (state) => ({ 
        steamId: state.steamId, 
        darkMode: state.darkMode 
      }),
    }
  )
)
