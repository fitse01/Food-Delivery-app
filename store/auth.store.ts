import { getCurrentUser } from '@/lib/appwrite';
import { User } from '@/type';
import { create } from 'zustand';

type AuthType = {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;

    setIsAuthenticated: (value: boolean) => void;
    setUser: (user: User | null) => void;
    setIsLoading: (loading: boolean) => void;

    fetchAuthenticatedUser: () => Promise<void>;
}


const useAuthStore = create<AuthType>((set) => ({
    isAuthenticated: false,
    user: null,
    isLoading: true,

    setIsAuthenticated: (value) => set({ isAuthenticated: value }),
    setUser: (user) => set({ user }),
    setIsLoading: (value) => set({ isLoading: value }),

    fetchAuthenticatedUser: async () => {
        set({ isLoading: true });
        try {
            const user = await getCurrentUser()

            // if (user) set({ isAuthenticated: true, user: user as User });
            if (user) set({ isAuthenticated: true, user: user as unknown as User });

            else set({ isAuthenticated: false, user: null });

            // const response = await fetch('/api/auth/user');
            // if (!response.ok) throw new Error('Failed to fetch user');
            // const user = await response.json();
            // set({ user, isAuthenticated: true });
        } catch (e) {
            console.log('Error fetching authenticated user:', e);
            set({ isAuthenticated: false, user: null });
        } finally {
            set({ isLoading: false });
        }
    }
}))

export default useAuthStore;