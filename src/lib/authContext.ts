// src/utils/auth.ts
import { Staff } from "@/components/staff/model/Staff";
import { jwtDecode } from "jwt-decode";


export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export const getCurrentUser = (): Staff | null => {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode<Staff>(token);
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};

export const setToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const clearToken = () => {
  localStorage.removeItem("token");
};
