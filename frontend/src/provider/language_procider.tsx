import { createContext, useEffect, useState } from "react";
import Fetcher from "../lib/fetcher";
import type { Langage } from "../types/general/language";

export const CodeLanguageContext = createContext<Langage[]>([]);
export const CodeLangagesProvider = ({ children }: { children: React.ReactNode }) => {
  const [list, setList] = useState<Langage[]>([]);
  const getList = async () => {
    const list = await Fetcher.get<Langage[]>("/explorer/languages");
    if (!("success" in list)) setList(list);
  };
  useEffect(() => {
    getList();
  }, []);
  return <CodeLanguageContext.Provider value={list}>{children}</CodeLanguageContext.Provider>;
};
