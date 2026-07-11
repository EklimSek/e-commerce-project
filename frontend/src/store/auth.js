import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchWithAuth } from '../utils/fetchWithAuth.js';

const useAuthStore = create(persist((set, get) => ({

    user: null, // store user object
    isLoggedIn: false, 

    setUser: (user) => set({user, isLoggedIn: true }),

    clearUser: () => set({ user: null, isLoggedIn: false }),

    checkAuth: async () => {
        const wasLoggedIn = get().isLoggedIn;

        try{
            const res = await fetchWithAuth("/api/cart");
            if(!res.ok){
                get().clearUser();
                return { authenticated: false, wasLoggedIn };
            }

            const data = await res.json();
            set({ user: data.data.user, isLoggedIn: true });

            return { authenticated: true, cart: data.data.cart };

        }catch(error){
            get().clearUser();
            return { authenticated: false, wasLoggedIn };
        }
    }
}),{
    name: "auth-storage",
    partialize: (state) => ({ user: state.user, isLoggedIn: state.isLoggedIn })
}))

export default useAuthStore;