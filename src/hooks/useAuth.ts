import { useState, useEffect, useCallback } from "react";
import { mockArticleService, User } from "@/lib/mockData";
import {
  loginUser,
  registerUser,
  AuthResponse,
  RegisterResponse,
  LoginResponse,
  decodeJWT,
} from "@/lib/authService";

// Constants
const STORAGE_KEYS = {
  USER: "auth_user",
  TOKEN: "auth_token",
} as const;

// Type guards
const isValidUserRole = (role: string): role is "USER" | "ADMIN" => {
  return role === "USER" || role === "ADMIN";
};

const isValidAuthResponse = (
  response: AuthResponse
): response is AuthResponse & {
  user: NonNullable<AuthResponse["user"]>;
  token: NonNullable<AuthResponse["token"]>;
} => {
  return Boolean(response.success && response.user && response.token);
};

interface StorageError extends Error {
  name: "StorageError";
}

/**
 * Custom hook for managing authentication state using sessionStorage
 */
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Clear stored authentication data
   */
  const clearStoredAuth = useCallback((): void => {
    try {
      sessionStorage.removeItem(STORAGE_KEYS.USER);
      sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error("Error clearing sessionStorage:", error);
    }
  }, []);

  /**
   * Get stored user data from sessionStorage
   */
  const loadUserFromStorage = useCallback((): User | null => {
    try {
      const storedUser = sessionStorage.getItem(STORAGE_KEYS.USER);
      const storedToken = sessionStorage.getItem(STORAGE_KEYS.TOKEN);

      if (!storedUser || !storedToken) {
        return null;
      }

      const userData = JSON.parse(storedUser) as User;

      // Validate user data structure
      if (
        !userData.id ||
        !userData.name ||
        !userData.email ||
        !isValidUserRole(userData.role)
      ) {
        throw new Error("Invalid user data structure");
      }

      return userData;
    } catch (error) {
      console.error("Error loading user from sessionStorage:", error);
      // Clear corrupted data
      clearStoredAuth();
      return null;
    }
  }, [clearStoredAuth]);

  /**
   * Store user data and token in sessionStorage
   */
  const storeAuthData = useCallback((userData: User, token: string): void => {
    try {
      sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      sessionStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } catch (error) {
      const storageError = new Error(
        "Failed to store authentication data"
      ) as StorageError;
      storageError.name = "StorageError";
      throw storageError;
    }
  }, []);

  /**
   * Handle login success with new JWT token response format
   */
  const handleLoginSuccess = useCallback(
    (response: LoginResponse): User => {
      if (!response.accessToken) {
        throw new Error("No access token received from server");
      }

      // Decode JWT token to get user information
      const tokenPayload = decodeJWT(response.accessToken);
      if (!tokenPayload) {
        throw new Error("Invalid access token received");
      }

      // Extract user information from JWT payload
      // Based on the sample JWT: {"role":"USER","sub":"teo@gmail.com","iat":1760878452,"exp":1760964852}
      const userData: User = {
        id: tokenPayload.sub || tokenPayload.userId || "unknown", // Use sub (email) as ID for now
        name:
          tokenPayload.name ||
          tokenPayload.username ||
          tokenPayload.sub?.split("@")[0] ||
          "Unknown User",
        email: tokenPayload.sub || tokenPayload.email || "unknown@example.com",
        role: tokenPayload.role || "USER",
      };

      // Validate role before proceeding
      if (!isValidUserRole(userData.role)) {
        throw new Error("Invalid user role received from server");
      }

      // Store auth data and update state
      storeAuthData(userData, response.accessToken);
      setUser(userData);

      // Refresh articles (side effect)
      mockArticleService.refreshArticles();

      return userData;
    },
    [storeAuthData]
  );

  /**
   * Convert API response to User type and handle authentication success (legacy)
   */
  const handleAuthSuccess = useCallback(
    (response: AuthResponse): User => {
      if (!isValidAuthResponse(response)) {
        throw new Error(response.message || "Authentication failed");
      }

      const userData: User = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role as "USER" | "ADMIN",
      };

      // Validate role before proceeding
      if (!isValidUserRole(userData.role)) {
        throw new Error("Invalid user role received from server");
      }

      // Store auth data and update state
      storeAuthData(userData, response.token);
      setUser(userData);

      // Refresh articles (side effect)
      mockArticleService.refreshArticles();

      return userData;
    },
    [storeAuthData]
  );

  // Load user from storage on mount
  useEffect(() => {
    const storedUser = loadUserFromStorage();
    setUser(storedUser);
    setLoading(false);
  }, [loadUserFromStorage]);

  /**
   * Authenticate user with email and password
   */
  const login = useCallback(
    async (email: string, password: string): Promise<User> => {
      if (!email?.trim() || !password?.trim()) {
        throw new Error("Email and password are required");
      }

      try {
        const response = await loginUser({ email: email.trim(), password });
        return handleLoginSuccess(response);
      } catch (error) {
        throw error instanceof Error ? error : new Error("Login failed");
      }
    },
    [handleLoginSuccess]
  );

  /**
   * Register new user account
   * Note: This function doesn't store the token, just validates the registration
   */
  const register = useCallback(
    async (email: string, password: string, name: string): Promise<boolean> => {
      if (!email?.trim() || !password?.trim() || !name?.trim()) {
        throw new Error("Email, password, and name are required");
      }

      try {
        const response = await registerUser({
          username: name.trim(), // Use username field as per new API
          email: email.trim(),
          password,
        });

        // Check if we got a valid response with access token
        if (response && response.accessToken) {
          return true; // Registration successful, but don't store token
        }

        throw new Error("Invalid response from server");
      } catch (error) {
        throw error instanceof Error ? error : new Error("Registration failed");
      }
    },
    []
  );

  /**
   * Logout current user
   */
  const logout = useCallback((): void => {
    clearStoredAuth();
    setUser(null);
  }, [clearStoredAuth]);

  return {
    user,
    loading,
    isLoggedIn: Boolean(user),
    login,
    register,
    logout,
  };
};
