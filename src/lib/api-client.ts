import axios from 'axios';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/constants/api';

/**
 * Singleton Axios instance for API requests
 */
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000,
});

// Variable to hold the getToken function from Clerk
let getToken: (() => Promise<string | null>) | null = null;

/**
 * Configure the API client with the Clerk getToken function.
 * This should be called once the app initializes.
 */
export const configureApiClient = (getTokenFn: () => Promise<string | null>) => {
    getToken = getTokenFn;
};

/**
 * Request Interceptor
 * Infuses the request with the Authorization header if available
 */
apiClient.interceptors.request.use(
    async (config) => {
        if (getToken) {
            try {
                const token = await Promise.race([
                    getToken(),
                    new Promise<string | null>((resolve) => setTimeout(() => resolve(null), 5000)),
                ]);
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.error('Error fetching token for request:', error);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response Interceptor
 * Handles global error responses like 401/403
 */
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const { response } = error;

        if (response) {
            const { status, data } = response;

            // Handle Unauthorized (401) and Forbidden (403)
            if (status === 401 || status === 403) {
                // We can optionally check if it's strictly a token expiry vs missing permissions
                // For now, treat both as "needs re-auth" if critical
                console.warn('Unauthorized or Forbidden access:', data?.message);

                // Optional: Trigger a redirect or show a specific modal
                // Note: Direct navigation outside React components can be tricky with standard routers, 
                // but window.location works for a hard reset/redirect to login.
                // Doing a soft navigation would require injecting the router navigate function.
                // For 401 specifically, often it means the session is dead.

                if (status === 401) {
                    toast.error('Session expired. Please sign in again.');
                    // Only redirect if not already on auth pages to avoid loops
                    if (!window.location.pathname.startsWith('/auth')) {
                        // setTimeout to allow toast to be seen briefly? Or immediate?
                        // Let's rely on the app's auth state change mostly, but if the backend rejects
                        // a token that Clerk thinks is valid (rare), this catches it.
                        // window.location.href = '/auth/log-in'; 
                    }
                } else {
                    toast.error('You do not have permission to perform this action.');
                }
            } else if (status >= 500) {
                toast.error('Server error. Please try again later.');
            }
        } else if (error.request) {
            // Network error (server down, no internet)
            toast.error('Network error. Please check your connection.');
        } else {
            console.error('API Error:', error.message);
        }

        return Promise.reject(error);
    }
);
