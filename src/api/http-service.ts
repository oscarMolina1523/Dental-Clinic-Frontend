export default class HTTPService {
  baseUrl = "";

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || "";
  }

  async getToken(): Promise<string> {
    const storedToken = localStorage.getItem("authToken");
    return storedToken || import.meta.env.VITE_TOKEN;
  }

  async get<T = unknown>(path: string): Promise<T> {
    try {
      const token = await this.getToken();
      const url = `${this.baseUrl}/${path}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return (await response.json()) as T;
    } catch (error: unknown) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  async post<T = unknown, B = unknown>(path: string, body: B): Promise<T> {
    try {
      const token = await this.getToken();
      const url = `${this.baseUrl}/${path}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const json = await response.json();

      if (!response.ok) {
        const message =
          typeof json === "object" && json !== null && "message" in json
            ? String((json as { message: unknown }).message)
            : "Error en la solicitud";
        throw new Error(message);
      }
      return json as T;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error desconocido";
      throw new Error(message, { cause: error });
    }
  }

  async put<T = unknown, B = unknown>(path: string, body: B): Promise<T> {
    try {
      const token = await this.getToken();
      const url = `${this.baseUrl}/${path}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return (await response.json()) as T;
    } catch (error: unknown) {
      console.error("Error putting data:", error);
      throw error;
    }
  }

  async delete<T = unknown>(path: string): Promise<T> {
    try {
      const token = await this.getToken();
      const url = `${this.baseUrl}/${path}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return (await response.json()) as T;
    } catch (error: unknown) {
      console.error("Error deleting data:", error);
      throw error;
    }
  }
}