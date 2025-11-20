import { create } from "zustand";


export const userAuthStore = create((set) => ({

  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),

}))