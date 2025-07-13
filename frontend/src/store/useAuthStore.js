import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLogging: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/auth/check');
      set({ authUser: res.data });
    } catch (error) {
      console.error('Error checking auth:', error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (formData) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post('/auth/signup', formData);
      toast.success('Sign up successful! Please log in.');
      set({ authUser: res.data });
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error(error.response?.data?.message || 'Sign up failed');
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (formData) => {
    set({ isLogging: true });
    try {
      const res = await axiosInstance.post('/auth/login', formData);
      set({ authUser: res.data });
      toast.success('Logged in successfully');
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      set({ isLogging: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
      set({ authUser: null });
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error(error.response?.data?.message || 'Logout failed');
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put('/auth/update-profile', data);
      set((state) => ({
        authUser: { ...state.authUser, ...res.data },
      }));
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Profile update failed');
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
