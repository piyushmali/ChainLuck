import { create } from 'zustand'

interface Winner {
  address: string
  amount: string
  roundId: number
}

interface AppState {
  // Winner Modal
  showWinnerModal: boolean
  winners: Winner[]
  
  // Actions
  setWinners: (winners: Winner[]) => void
  showWinnerModalWithWinners: (winners: Winner[]) => void
  hideWinnerModal: () => void
  reset: () => void
}

const initialState = {
  showWinnerModal: false,
  winners: [],
}

export const useAppStore = create<AppState>((set) => ({
  ...initialState,
  
  setWinners: (winners) => set({ winners }),
  
  showWinnerModalWithWinners: (winners) => set({ 
    winners, 
    showWinnerModal: true 
  }),
  
  hideWinnerModal: () => set({ showWinnerModal: false }),
  
  reset: () => set(initialState),
})) 