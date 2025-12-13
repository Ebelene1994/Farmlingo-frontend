/**
 * API Configuration
 * Centralized API endpoint configuration
 */

// Get API base URL from environment variable or use default
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// API Endpoints
export const API_ENDPOINTS = {
    // User endpoints
    users: {
        me: '/api/users/me',
        sync: '/api/users/sync',
    },
    // Add more endpoints as needed
} as const;

/**
 * Helper function to build full API URL
 */
export const buildApiUrl = (endpoint: string): string => {
    return `${API_BASE_URL}${endpoint}`;
};
