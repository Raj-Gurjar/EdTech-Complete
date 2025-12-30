/**
 * Token utility functions for managing JWT tokens
 * Handles token validation, expiration checking, and storage
 */

interface TokenPayload {
  id: string;
  email: string;
  accountType: string;
  exp: number;
  iat: number;
}

/**
 * Decode JWT token without verification (for client-side expiration check)
 * @param token - JWT token string
 * @returns Decoded token payload or null if invalid
 */
export const decodeToken = (token: string): TokenPayload | null => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 * @param token - JWT token string
 * @returns true if token is expired or invalid, false otherwise
 */
export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  // Add 5 minute buffer before actual expiration
  const expirationTime = decoded.exp * 1000; // Convert to milliseconds
  const currentTime = Date.now();
  const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
  
  return currentTime >= (expirationTime - bufferTime);
};

/**
 * Get time until token expires in milliseconds
 * @param token - JWT token string
 * @returns Time in milliseconds until expiration, or 0 if expired/invalid
 */
export const getTokenExpirationTime = (token: string | null): number => {
  if (!token) return 0;
  
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return 0;
  
  const expirationTime = decoded.exp * 1000;
  const currentTime = Date.now();
  const timeUntilExpiration = expirationTime - currentTime;
  
  return timeUntilExpiration > 0 ? timeUntilExpiration : 0;
};

/**
 * Get token from localStorage
 * @returns Token string or null
 */
export const getStoredToken = (): string | null => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    // Handle both string and JSON stringified tokens
    const parsedToken = token.startsWith('"') ? JSON.parse(token) : token;
    return parsedToken;
  } catch (error) {
    console.error('Error getting stored token:', error);
    return null;
  }
};

/**
 * Save token to localStorage
 * @param token - JWT token string
 */
export const saveToken = (token: string): void => {
  try {
    localStorage.setItem('token', JSON.stringify(token));
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

/**
 * Remove token from localStorage
 */
export const removeToken = (): void => {
  try {
    localStorage.removeItem('token');
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

/**
 * Check if token is valid (exists and not expired)
 * @param token - JWT token string (optional, will get from localStorage if not provided)
 * @returns true if token is valid, false otherwise
 */
export const isTokenValid = (token?: string | null): boolean => {
  const tokenToCheck = token || getStoredToken();
  if (!tokenToCheck) return false;
  
  return !isTokenExpired(tokenToCheck);
};

