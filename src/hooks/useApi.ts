import apiClient from "@/lib/apiClient";
import { set } from "date-fns";
import { useState } from "react";

type HttpMethod = "get" | "post" | "put" | "delete";

export function useApi() {
  const [data, setData] = useState(null);
  const [responseCode, setResponseCode] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const request = async (
    method: HttpMethod,
    url: string,
    body?: any
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    setData(null);
    setResponseCode(null);

    try {
      const response = await apiClient.request({
        method,
        url,
        data: body,
      });
      console.log("API response:", response);
      setData(response.data);
      setResponseCode(response.status);
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

  return { data, error, loading, request, responseCode };
}
