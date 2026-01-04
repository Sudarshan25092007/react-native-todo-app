import axios from "axios";
import { API_BASE_URL } from "../config/env";
import { firebaseAuth } from "./firebase";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(async (config) => {
  const user = firebaseAuth.currentUser;

  if (user) {
    const token = await user.getIdToken();

    config.headers = {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`,
    } as any;
  }

  return config;
});
