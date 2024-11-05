import axios from "axios";
import { getCookie } from "./cookie";

const API_URL = import.meta.env.VITE_API_URL;

export async function createRoom({ name }: { name: string }) {
  try {
    const token = getCookie({ name: "token" });
    const response = await axios.post(
      `${API_URL}/api/rooms`,
      {
        name: name,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(`Err: ${error}`);
  }
}

export async function getRooms() {
  try {
    const token = getCookie({ name: "token" });
    const response = await axios.get(`${API_URL}/api/rooms`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw new Error(`Err: ${error}`);
  }
}

export async function getRoomById({ id }: { id: number }) {
  try {
    const token = getCookie({ name: "token" });
    const response = await axios.get(`${API_URL}/api/rooms/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw new Error(`Err: ${error}`);
  }
}

export async function joinRoom({ id }: { id: number }) {
  try {
    const token = getCookie({ name: "token" });
    const response = await axios.post(
      `${API_URL}/api/rooms/${id}/join`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(`Err: ${error}`);
  }
}

export async function leaveRoom({ id }: { id: number }) {
  try {
    const token = getCookie({ name: "token" });
    const response = await axios.post(
      `${API_URL}/api/rooms/${id}/leave`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(`Err: ${error}`);
  }
}
