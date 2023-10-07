"use client";
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
export interface UserState {
  user: string
  token: string
  id: number
  email: string
  setUser: (user: string) => void
  setToken: (token: string) => void
  setId: (id: number) => void
  setEmail: (email: string) => void
  resetUser: () => void
}

export type User = {
  user: string
  token: string
  id: number
  email: string
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: '',
      token: '',
      id: 0,
      email: '',
      setUser: (user: string) => set({ user }),
      setToken: (token: string) => set({ token }),
      setId: (id: number) => set({ id }),
      setEmail: (email: string) => set({ email }),
      resetUser: () => set({ user: '', token: '', id: 0, email: '' }),
    }),
    {
      name: "userInfo",
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);

export function setLoggedInUser(UserState: User) {
  useUserStore.setState(UserState)
}

export function getLoggedInUser() {
  const userState = {
    user: useUserStore.getState().user,
    token: useUserStore.getState().token,
    id: useUserStore.getState().id,
    email: useUserStore.getState().email
  }
  return userState;
}

export function resetLoggedInUser() {
  useUserStore((state) => state.setEmail("undefined"))
  useUserStore((state) => state.setId(0))
  useUserStore((state) => state.setUser("undefined"))
  useUserStore((state) => state.setToken("undefined"))
}

export default useUserStore;