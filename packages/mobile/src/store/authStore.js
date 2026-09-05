import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,

  initialize: async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token')
      const user = await AsyncStorage.getItem('user')
      if (token && user) {
        set({
          token,
          user: JSON.parse(user),
          isAuthenticated: true,
        })
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error)
    } finally {
      set({ loading: false })
    }
  },

  login: async (user, token) => {
    await AsyncStorage.setItem('auth_token', token)
    await AsyncStorage.setItem('user', JSON.stringify(user))
    set({ user, token, isAuthenticated: true })
  },

  logout: async () => {
    await AsyncStorage.removeItem('auth_token')
    await AsyncStorage.removeItem('user')
    set({ user: null, token: null, isAuthenticated: false })
  },

  setUser: (user) => set({ user }),
}))
