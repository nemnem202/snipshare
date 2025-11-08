import { useNavigate, useParams } from "react-router-dom";
import SnippetCard from "../../ui/components/snippet/snippet_card";
import NotFound from "./not_found";
import { useEffect, useState } from "react";
import { Spinner } from "../../ui/assets/spinner";
import Fetcher from "../../lib/fetcher";
import type { ExplorerSnippet } from "../../types/general/explorersnippet";
import SnippetUnrefCard from "../../ui/components/snippetUnref/snippet_unref_card";
import { Custom } from "../../lib/logger";

export default function SingleSnippetPage() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [snippet, setSnippet] = useState<ExplorerSnippet | undefined>(undefined);
  const [path, setPath] = useState(params.id);

  const getSnippet = async () => {
    setLoading(true);
    if (!path) return;
    const res = await Fetcher.get<ExplorerSnippet>("/snippet/unref/" + path);

    if ("success" in res) return setPath(undefined);

    setSnippet(res);
    setLoading(false);
  };

  useEffect(() => {
    getSnippet();
  }, []);

  useEffect(() => {
    Custom.log("snippet", snippet);
  }, [snippet]);

  if (!path) return <NotFound />;
  return (
    <div className="main-container">
      <div className="h-50"></div>
      {loading ? (
        <>
          <Spinner className="size-24" />{" "}
        </>
      ) : (
        snippet && <SnippetUnrefCard setClosed={() => {}} snippet={snippet} />
      )}
      <div className="h-50"></div>
    </div>
  );
}
