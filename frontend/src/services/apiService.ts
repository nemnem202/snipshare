import type { Response } from "../types/general/response";

export class ApiService {
  public static readonly api_url = import.meta.env.VITE_API_URL;

  static post = async (body: object, headers: Headers, path: string): Promise<Response> => {
    try {
      const response = await fetch(this.api_url + this.formatPath(path), {
        method: "post",
        headers: headers,
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();

      if ("message" in data && "success" in data) {
        return data as Response;
      }

      return {
        message: "Le contenu de la réponse est incohérent : " + JSON.stringify(data),
        success: false,
      };
    } catch {
      return { message: "Une erreur innatendue est survenue", success: false };
    }
  };

  static get = async <R>(headers: Headers, path: string): Promise<R | Response> => {
    console.log("trying to get ", path);
    try {
      const response = await fetch(this.api_url + this.formatPath(path), {
        method: "get",
        headers: headers,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();

      if ("message" in data && "success" in data) {
        return data as Response;
      } else {
        return data as R;
      }
    } catch (err) {
      return { message: "Une erreur innatendue est survenue" + err, success: false };
    }
  };

  private static formatPath = (path: string): string => {
    if (path.startsWith("/")) return path;
    return "/" + path;
  };

  static create_header = (headers: object): Headers => {
    const headers_class = new Headers();

    for (const [key, value] of Object.entries(headers)) {
      headers_class.append(key, String(value));
    }

    return headers_class;
  };
}
