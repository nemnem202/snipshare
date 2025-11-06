import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import CommentCard from "./comment_card";
import SnippetCard from "./snippet_card";
import type { ExplorerSnippet } from "../../types/general/explorersnippet";

const SnippetContext = createContext<{
  snippet: ExplorerSnippet | null;
  setSnippet: Dispatch<SetStateAction<ExplorerSnippet | null>>;
} | null>(null);

interface SnippetProviderProps {
  children: ReactNode;
}

export const SnippetProvider: React.FC<SnippetProviderProps> = ({ children }) => {
  const [snippet, setSnippet] = useState<ExplorerSnippet | null>(null);
  return (
    <SnippetContext.Provider value={{ snippet, setSnippet }}>{children}</SnippetContext.Provider>
  );
};

export const useSnippet = () => {
  const context = useContext(SnippetContext);
  if (!context) throw new Error("useSnippet must be used within a LocalProvider");
  return context;
};

export default function SnippetContainer({
  editables,
  snipp,
}: {
  editables: boolean;
  snipp: ExplorerSnippet;
}) {
  const [closed, setClosed] = useState(true);

  return (
    <SnippetProvider>
      <InnerSnippetContainer
        snipp={snipp}
        editables={editables}
        closed={closed}
        setClosed={setClosed}
      />
    </SnippetProvider>
  );
}

function InnerSnippetContainer({
  editables,
  snipp,
  closed,
  setClosed,
}: {
  editables: boolean;
  snipp: ExplorerSnippet;
  closed: boolean;
  setClosed: Dispatch<SetStateAction<boolean>>;
}) {
  const { snippet, setSnippet } = useSnippet();

  useEffect(() => {
    setSnippet(snipp);
  }, [snipp, setSnippet]);

  return (
    <div className="flex gap-3">
      <SnippetCard setClosed={setClosed} editable={editables} />
      <CommentCard closed={closed} />
    </div>
  );
}
