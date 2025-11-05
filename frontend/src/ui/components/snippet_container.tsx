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
import type { Snippet } from "../../types/general/snippet";

const SnippetContext = createContext<{
  snippet: Snippet | null;
  setSnippet: Dispatch<SetStateAction<Snippet | null>>;
} | null>(null);

interface SnippetProviderProps {
  children: ReactNode;
}

export const SnippetProvider: React.FC<SnippetProviderProps> = ({ children }) => {
  const [snippet, setSnippet] = useState<Snippet | null>(null);
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
  snipp: Snippet;
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
  snipp: Snippet;
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
