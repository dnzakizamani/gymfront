import { create } from 'zustand';

const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,

    login: (userData) => {
        set({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
        });
    },

    logout: () => {
        localStorage.removeItem('token');
        set({
            user: null,
            isAuthenticated: false,
        });
    },

    setLoading: (loading) => set({ isLoading: loading }),
    setUser: (userData) => set({ user: userData, isAuthenticated: true }),
}));

export default useAuthStore;
