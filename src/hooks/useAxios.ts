import { AxiosError, AxiosRequestConfig } from 'axios';
import axiosClient from "../axios-client";
import { handleApiError } from "../utils/apiErrorHandler";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth";
import { UseAxiosReturn } from './types';

interface ApiErrorResponse {
  error?: string;
  details?: Record<string, string[]>;
}

// Define a default type for request data
type RequestData = Record<string, unknown>;

export const useAxios = (): UseAxiosReturn => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleError = (error: AxiosError<ApiErrorResponse>) => {
    const formattedError = handleApiError(error);
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Don't logout on login page
      if (window.location.pathname !== "/login") {
        dispatch(authActions.logout());
        navigate("/login");
      }
    }
    
    return Promise.reject(formattedError);
  };

  return {
    get: <TResponse = unknown>(url: string, config?: AxiosRequestConfig) => 
      axiosClient.get<TResponse>(url, config).catch(handleError as (error: AxiosError<unknown>) => never),
    
    post: <TResponse = unknown, TData = RequestData>(url: string, data?: TData, config?: AxiosRequestConfig) => 
      axiosClient.post<TResponse>(url, data, config).catch(handleError as (error: AxiosError<unknown>) => never),
    
    put: <TResponse = unknown, TData = RequestData>(url: string, data?: TData, config?: AxiosRequestConfig) => 
      axiosClient.put<TResponse>(url, data, config).catch(handleError as (error: AxiosError<unknown>) => never),
    
    delete: <TResponse = unknown>(url: string, config?: AxiosRequestConfig) => 
      axiosClient.delete<TResponse>(url, config).catch(handleError as (error: AxiosError<unknown>) => never),
  };
}; 