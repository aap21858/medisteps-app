import { useCallback, useState } from "react";
import  { AxiosRequestConfig } from "axios";
import apiClient from "@/lib/apiClient";

type UseAuthorizedApiResult<T> = {
  data: T | null;
  error: string | null;
  request: (
    config: AxiosRequestConfig
  ) => Promise<{ data?: T; error?: T; status?: number | null }>;
};

export default function useAuthorizedApi<
  T = unknown
>(): UseAuthorizedApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  // You can set base URL from env: Vite or CRA
  const baseURL = typeof import.meta !== "undefined" && "http://localhost:8081";

  const request = useCallback(
    async (
      config: AxiosRequestConfig
    ): Promise<{ data?: T; error?: T; status?: number | null }> => {
      try {
        // Always read the latest token (in case it changed)
        const token =
          (typeof window !== "undefined" && localStorage.getItem("jwt")) ||
          null;

        const headers = {
          ...(config.headers || {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const finalConfig: AxiosRequestConfig = {
          ...config,
          withCredentials: false, // change to true if you also use cookies
        };

        const response = await apiClient.request({
          method: finalConfig.method,
          url: finalConfig.url,
          data: finalConfig.data,
          params: finalConfig.params,
        });
        console.log("API Response:", response);
        setData(response.data);

        return {
          data: response.status == 200 ? response.data : null,
          status: response.status,
          error: response.status != 200 ? response.data : null,
        };
        // return response.data;
      } catch (err) {
        const axiosErr = err;
        setError(axiosErr);
        // Re-throw so callers can handle errors with try/catch if needed
        return {
          error: axiosErr.response?.data || "Something went wrong",
          status: axiosErr.response?.status || null,
        };
        //throw axiosErr;
      }
    },
    [baseURL]
  );

  return { data, error, request };
}
