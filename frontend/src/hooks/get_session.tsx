import { useContext, useEffect } from "react";
import { SessionContext } from "../provider/session_provider";
import { Custom } from "../lib/logger";
import Fetcher from "../lib/fetcher";

export default function useGetSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    Custom.error("SessionProvider error");
    return null;
  }

  const { sessionUsername, setSession } = ctx;

  useEffect(() => {
    if (!sessionUsername) {
      (async () => {
        const response = await Fetcher.get<{ sessionUsername: string | null }>(
          "/auth/session",
          true
        );
        Custom.warn("session", response);
        if ("sessionUsername" in response) {
          setSession(response.sessionUsername);
        } else {
          setSession(null);
        }
      })();
    }
  }, [sessionUsername, setSession]);

  return sessionUsername;
}
