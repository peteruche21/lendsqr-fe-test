import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { UserDetails, UserStatus } from '@/types'

interface UserState {
  // Store full details for retrieval as per specs
  userCache: Record<string, UserDetails>
  // Store manual status overrides (Blacklist/Activate)
  statusOverrides: Record<string, UserStatus>
  
  // Actions
  saveUser: (user: UserDetails) => void
  updateUserStatus: (userId: string, status: UserStatus) => void
  getUserStatus: (userId: string, remoteStatus: UserStatus) => UserStatus
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      userCache: {},
      statusOverrides: {},

      saveUser: (user) => 
        set((state) => ({
          userCache: { ...state.userCache, [user.id]: user }
        })),

      updateUserStatus: (userId, status) => 
        set((state) => ({
          statusOverrides: { ...state.statusOverrides, [userId]: status }
        })),

      getUserStatus: (userId, remoteStatus) => {
        const override = get().statusOverrides[userId]
        return override ?? remoteStatus
      }
    }),
    {
      name: 'lendsqr-user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
