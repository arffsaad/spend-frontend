import { create } from 'zustand'

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
  resetToken: () => void
  resetId: () => void
  resetEmail: () => void
}

export const useUserStore = create<UserState>()((set) => ({
  user: "undefined",
  token: "undefined",
  id: 0,
  email: "undefined",
  setUser: (user: string) => set({ user }),
  setToken: (token: string) => set({ token }),
  setId: (id: number) => set({ id }),
  setEmail: (email: string) => set({ email }),
  resetUser: () => set({ user: "undefined" }),
  resetToken: () => set({ token: "undefined" }),
  resetId: () => set({ id: 0 }),
  resetEmail: () => set({ email: "undefined" }),
}))

export function setLoggedInUser(UserState: UserState) {
  useUserStore.setState(UserState)
}

export function getLoggedInUser() {
  return useUserStore.getState()
}

export function resetLoggedInUser() {
  useUserStore((state) => state.setEmail("undefined"))
  useUserStore((state) => state.setId(0))
  useUserStore((state) => state.setUser("undefined"))
  useUserStore((state) => state.setToken("undefined"))
}