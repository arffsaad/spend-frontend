"use client";
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
export interface MsgState {
  loginPage: string
  spendsPage: string
  walletPage: string
  instalmentsPage: string
  msgType: string
  setLoginPage: (msg: string) => void
  setSpendsPage: (msg: string) => void
  setWalletPage: (msg: string) => void
  setInstalmentsPage: (msg: string) => void
  setMsgType: (msg: string) => void
}

export type Msgs = {
  loginPage: string
  spendsPage: string
  walletPage: string
  instalmentsPage: string
  msgType: string
}

const useMsgStore = create<MsgState>()(
  persist(
    (set) => ({
      loginPage: '',
      setLoginPage: (msg: string) => set((state) => ({ loginPage: msg })),
      spendsPage: '',
      setSpendsPage: (msg: string) => set((state) => ({ spendsPage: msg })),
      walletPage: '',
      setWalletPage: (msg: string) => set((state) => ({ walletPage: msg })),
      instalmentsPage: '',
      setInstalmentsPage: (msg: string) => set((state) => ({ instalmentsPage: msg })),
      msgType: '',
      setMsgType: (msg: string) => set((state) => ({ msgType: msg }))
    }),
    {
      name: "notification",
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);

export default useMsgStore;