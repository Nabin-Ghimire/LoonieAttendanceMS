import { create } from "zustand";
import { persist } from 'zustand/middleware';


// Persist the `user` value so the app can show the authenticated UI immediately
// after a browser refresh. `undefined` will be used for the initial hydration
// while `self` is being fetched; once persisted state exists it will be used
// to avoid a UI flash.
export const userAuthStore = create(
  persist(
    (set) => ({
      // `undefined` means "still loading/hydrating"; `null` means explicitly logged out.
      user: undefined,
      // Accept either a raw user object or a wrapper `{ user: { ... } }` from the backend
      // and store the inner user object consistently.
      setUser: (payload) => {
        const normalized = payload?.user ?? payload ?? null;
        set({ user: normalized });
      },
      logout: () => set({ user: null }),
    }),
    {
      name: 'user-auth', // localStorage key
      partialize: (state) => ({ user: state.user }),
    }
  )
);