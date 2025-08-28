import { AxiosRequestConfig, AxiosResponse } from 'axios';

// Define a default type for request data
type RequestData = Record<string, unknown>;

export interface UseAxiosReturn {
  get: <TResponse = unknown>(
    url: string, 
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<TResponse>>;
  
  post: <TResponse = unknown, TData = RequestData>(
    url: string, 
    data?: TData, 
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<TResponse>>;
  
  put: <TResponse = unknown, TData = RequestData>(
    url: string, 
    data?: TData, 
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<TResponse>>;
  
  delete: <TResponse = unknown>(
    url: string, 
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<TResponse>>;
} 