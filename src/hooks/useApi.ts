import { useState, useCallback } from 'react';
import useAuthorizedApi from './useAuthorizedApi';
import { AxiosRequestConfig } from 'axios';
import { useToast } from './use-toast';

interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

interface UseApiOptions {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export function useApi<T = unknown>(defaultOptions: UseApiOptions = {}) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });
  
  const { toast } = useToast();
  const api = useAuthorizedApi<T>();

  const execute = useCallback(
    async (
      config: AxiosRequestConfig,
      options: UseApiOptions = {}
    ) => {
      const mergedOptions = { ...defaultOptions, ...options };
      const {
        showSuccessToast = false,
        showErrorToast = true,
        successMessage,
        onSuccess,
        onError,
      } = mergedOptions;

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await api.request(config);

        if (response.error) {
          throw response.error;
        }

        setState({ data: response.data || null, isLoading: false, error: null });

        if (showSuccessToast && successMessage) {
          toast({
            title: "Success",
            description: successMessage,
          });
        }

        onSuccess?.(response.data);
        return response.data;
      } catch (error: any) {
        const errorMessage = error?.message || "Something went wrong";
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));

        if (showErrorToast) {
          toast({
            variant: "destructive",
            title: "Error",
            description: errorMessage,
          });
        }

        onError?.(error);
        throw error;
      }
    },
    [api, defaultOptions, toast]
  );

  const get = useCallback(
    (url: string, config: Omit<AxiosRequestConfig, 'method' | 'url'> = {}, options?: UseApiOptions) => {
      return execute({ ...config, method: 'GET', url }, options);
    },
    [execute]
  );

  const post = useCallback(
    (url: string, data?: any, config: Omit<AxiosRequestConfig, 'method' | 'url' | 'data'> = {}, options?: UseApiOptions) => {
      return execute({ ...config, method: 'POST', url, data }, options);
    },
    [execute]
  );

  const put = useCallback(
    (url: string, data?: any, config: Omit<AxiosRequestConfig, 'method' | 'url' | 'data'> = {}, options?: UseApiOptions) => {
      return execute({ ...config, method: 'PUT', url, data }, options);
    },
    [execute]
  );

  const del = useCallback(
    (url: string, config: Omit<AxiosRequestConfig, 'method' | 'url'> = {}, options?: UseApiOptions) => {
      return execute({ ...config, method: 'DELETE', url }, options);
    },
    [execute]
  );

  return {
    ...state,
    execute,
    get,
    post,
    put,
    delete: del,
  };
}