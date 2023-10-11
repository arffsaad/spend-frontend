"use client";
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
export interface MsgState {
  loginPage: string
  setLoginPage: (msg: string) => void
}

export type Msgs = {
  loginPage: string
}

const useMsgStore = create<MsgState>()(
  persist(
    (set) => ({
      loginPage: '',
      setLoginPage: (msg: string) => set((state) => ({ loginPage: msg })),
    }),
    {
      name: "notification",
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);

export default useMsgStore;