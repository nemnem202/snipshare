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

  const { session, setSession } = ctx;

  useEffect(() => {
    if (!session) {
      (async () => {
        const response = await Fetcher.get<{ session: boolean }>("/auth/session", true);
        if ("session" in response) {
          setSession(response.session);
        } else {
          setSession(false);
        }
      })();
    }
  }, [session, setSession]);

  return session;
}
