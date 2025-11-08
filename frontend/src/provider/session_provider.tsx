import React, { createContext, useEffect, useState } from "react";
import { Custom } from "../lib/logger";

export const SessionContext = createContext<{
  sessionUsername: string | null | undefined;
  setSession: React.Dispatch<React.SetStateAction<string | null | undefined>>;
} | null>(null);

export default function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessionUsername, setSession] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    Custom.log("sessionUsename", sessionUsername);
  }, [sessionUsername]);

  return (
    <SessionContext.Provider value={{ sessionUsername, setSession }}>
      {children}
    </SessionContext.Provider>
  );
}
