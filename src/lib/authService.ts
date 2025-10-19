/**
 * Authentication API service
 * Centralized service for all authentication-related API calls
 */

// API Constants
const API_ENDPOINTS = {
  REGISTER: "/api/auth/register",
  LOGIN: "/api/auth/login",
  LOGOUT: "/api/auth/logout",
  REFRESH: "/api/auth/refresh",
  VERIFY_EMAIL: "/api/auth/verify-email",
  FORGOT_PASSWORD: "/api/auth/forgot-password",
  RESET_PASSWORD: "/api/auth/reset-password",
} as const;

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
} as const;

const STORAGE_KEYS = {
  TOKEN: "auth_token",
} as const;

// JWT token utility functions
export const decodeJWT = (token: string): Record<string, any> | null => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
};

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  token?: string;
}

export interface AuthError extends Error {
  status?: number;
}

export class ApiError extends Error implements AuthError {
  public readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// API Base URL configuration
const getApiBaseUrl = (): string => {
  return (
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV ? "http://localhost:8081" : "https://api.devnotes.com")
  );
};

// Generic API request helper
const apiRequest = async <T = AuthResponse>(
  endpoint: string,
  options: RequestInit = {},
  includeAuth: boolean = true
): Promise<T> => {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;

  const headers: Record<string, string> = {
    ...DEFAULT_HEADERS,
    ...(options.headers as Record<string, string>),
  };

  // Add Authorization header if requested and token is available
  if (includeAuth) {
    const token = sessionStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const defaultOptions: RequestInit = {
    headers,
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If response is not JSON, use default message
      }

      throw new ApiError(errorMessage, response.status);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error) {
      throw new ApiError(error.message, 0);
    }

    throw new ApiError("Network error occurred", 0);
  }
};

/**
 * Register a new user
 */
export const registerUser = async (
  data: RegisterRequest
): Promise<RegisterResponse> => {
  return apiRequest<RegisterResponse>(
    API_ENDPOINTS.REGISTER,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    false // Don't include auth header for registration
  );
};

/**
 * Login user
 */
export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  return apiRequest<LoginResponse>(
    API_ENDPOINTS.LOGIN,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    false // Don't include auth header for login
  );
};

/**
 * Logout user (if the API requires explicit logout)
 */
export const logoutUser = async (): Promise<AuthResponse> => {
  return apiRequest<AuthResponse>(API_ENDPOINTS.LOGOUT, {
    method: "POST",
  });
};

/**
 * Refresh authentication token
 */
export const refreshToken = async (token: string): Promise<AuthResponse> => {
  return apiRequest<AuthResponse>(API_ENDPOINTS.REFRESH, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

/**
 * Verify user email
 */
export const verifyEmail = async (token: string): Promise<AuthResponse> => {
  return apiRequest<AuthResponse>(API_ENDPOINTS.VERIFY_EMAIL, {
    method: "POST",
    body: JSON.stringify({ token }),
  });
};

/**
 * Request password reset
 */
export const requestPasswordReset = async (
  email: string
): Promise<AuthResponse> => {
  return apiRequest<AuthResponse>(API_ENDPOINTS.FORGOT_PASSWORD, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

/**
 * Reset password
 */
export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<AuthResponse> => {
  return apiRequest<AuthResponse>(API_ENDPOINTS.RESET_PASSWORD, {
    method: "POST",
    body: JSON.stringify({ token, newPassword }),
  });
};
