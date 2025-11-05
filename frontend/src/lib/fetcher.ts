import type { ServerResponse } from "../types/general/response";
import { Custom } from "./logger";
import Toaster from "./toaster";

export default class Fetcher {
  private static url = import.meta.env.VITE_API_URL;

  private static defaultRes: ServerResponse = {
    message: "Client error",
    success: false,
  };

  private static formatPath(path: string): string {
    if (path.startsWith("/")) return path;
    return "/" + path;
  }

  static post = async <T>(body: object, path: string): Promise<ServerResponse | T> => {
    const fullUrl = this.url + this.formatPath(path);

    try {
      Custom.log("fetcher", "Sending POST request", { url: fullUrl, body });

      const res = await fetch(fullUrl, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const msg = `Fetch failed with status ${res.status} ${res.statusText}`;
        Custom.error("fetcher", msg);
        Toaster.toastServer({ message: msg, success: false });
        return { message: msg, success: false };
      }

      let data: unknown;
      try {
        data = await res.json();
      } catch (jsonErr) {
        Custom.error("fetcher", "Failed to parse JSON response", jsonErr);
        Toaster.toastServer({ message: "Invalid JSON response", success: false });
        return { message: "Invalid JSON response", success: false };
      }

      Custom.log("fetcher", "Received response", data);

      if (data && typeof data === "object" && "message" in data && "success" in data) {
        Toaster.toastServer(data as ServerResponse);
        return data as ServerResponse;
      }

      return data as T;
    } catch (err) {
      Custom.error("fetcher", "Unknown error during POST request", err);
      Toaster.toastServer({ message: "Unknown error", success: false });
      return this.defaultRes;
    }
  };

  static get = async <Success>(
    path: string,
    silent?: boolean
  ): Promise<Success | ServerResponse> => {
    try {
      const res = await fetch(this.url + this.formatPath(path), {
        method: "Get",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const msg = `Fetch failed with status ${res.status} ${res.statusText}`;
        Custom.error("fetcher", msg);
        !silent && Toaster.toastServer({ message: msg, success: false });
        return { message: msg, success: false };
      }

      let data: unknown;
      try {
        data = await res.json();
      } catch (jsonErr) {
        Custom.error("fetcher", "Failed to parse JSON response", jsonErr);
        !silent && Toaster.toastServer({ message: "Invalid JSON response", success: false });
        return { message: "Invalid JSON response", success: false };
      }

      Custom.log("fetcher", "Received response", data);

      if (data && typeof data === "object" && "message" in data && "success" in data) {
        !silent && Toaster.toastServer(data as ServerResponse);
        return data as ServerResponse;
      }

      return data as Success;
    } catch (err) {
      Custom.error("fetcher", "Unknown error during POST request", err);
      !silent && Toaster.toastServer({ message: "Unknown error", success: false });
      return this.defaultRes;
    }
  };
}
