import apiClient from "@/lib/apiClient";
import { useState } from "react";

type HttpMethod = "get" | "post" | "put" | "delete";

export function useApi<T = any>() {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const request = async (
    method: HttpMethod,
    url: string,
    body?: any
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.request<T>({
        method,
        url,
        data: body,
      });
      setData(response.data);
      return response.data;
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Unauthorized: Invalid or expired token.");
      } else {
        setError(err.response?.data || "Something went wrong");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, request };
}
