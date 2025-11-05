import React, { createContext, useState } from "react";

export const SessionContext = createContext<{
  session: boolean | undefined;
  setSession: React.Dispatch<React.SetStateAction<boolean | undefined>>;
} | null>(null);

export default function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<boolean | undefined>(undefined);

  return (
    <SessionContext.Provider value={{ session, setSession }}>{children}</SessionContext.Provider>
  );
}
