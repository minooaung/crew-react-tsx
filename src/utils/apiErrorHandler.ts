import { AxiosError } from 'axios';

interface ApiErrorResponse {
  error?: string;
  details?: Record<string, string[]>;
}

interface ValidationErrors {
  [key: string]: string[];
}

export function handleApiError(error: AxiosError<ApiErrorResponse>): ValidationErrors {
  if (!error.response) {
    return { general: ["Network error. Please check your connection."] };
  }

  const { status, data } = error.response;

  switch (status) {
    case 401:
      // Distinguish between invalid credentials and session expiry
      if (data?.error?.includes("Session expired")) {
        return { general: ["Session expired. Please log in again."] };
      }
      return { general: [data?.error || "Unauthorized: Invalid credentials."] };

    case 419:
      // Handle CSRF token expiration
      return {
        general: [
          data?.error || "Session timeout. Please refresh and try again.",
        ],
      };

    case 403:
      return {
        general: [
          data?.error?.includes("Unauthorized action")
            ? "Unauthorized Action. You do not have permission to perform this request."
            : data?.error || "Access denied.",
        ],
      };

    case 404:
      return { general: ["Resource not found."] };

    case 422:
      return data?.details ? data.details : { general: ["Invalid input."] }; // Returns full validation errors instead of a single message

    case 500:
      console.error("Server error:", data?.error);
      return { general: ["Something went wrong. Please try again later."] };

    default:
      console.error("Unexpected error:", data);
      return { general: ["Unexpected error occurred."] };
  }
} 