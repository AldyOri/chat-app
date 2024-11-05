import axios from "axios";
import { Login, Register } from "@/types/auth";
import { deleteCookie, getCookie, setCookie } from "./cookie";

const API_URL = import.meta.env.VITE_API_URL;

export async function login({ email, password }: Login) {
  try {
    const response = await axios.post(
      `${API_URL}/api/auth/login`,
      {
        email: email,
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const token = response.data.token;
    setCookie({ name: "token", value: token, expiredDurationInDay: 7 });
    return response;
  } catch (error) {
    throw new Error(`Err: ${error}`);
  }
}

export async function register({ username, email, password }: Register) {
  try {
    const response = await axios.post(
      `${API_URL}/api/auth/register`,
      {
        username: username,
        email: email,
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response;
  } catch (error) {
    throw new Error(`Err: ${error}`);
  }
}

export function logout() {
  deleteCookie({ name: "token" });
}

export async function me() {
  try {
    const token = getCookie({ name: "token" });
    const response = await axios.get(`${API_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw new Error(`Err: ${error}`);
  }
}
