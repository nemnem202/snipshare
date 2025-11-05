import { useEffect, useState } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/themes/prism-tomorrow.css";
import "../style/components/snippet_code.css";
import { Button } from "../assets/button";
import { Spinner } from "../assets/spinner";
import { useSnippet } from "./snippet_container";

export default function SnippetCode({
  run,
  runLoading,
}: {
  run: (content: string) => any;
  runLoading: boolean;
}) {
  const [code, setCode] = useState("");
  const lines = code.split("\n");

  const { snippet, setSnippet } = useSnippet();

  useEffect(() => {
    if (!snippet) return;
    setCode(snippet.code);
  }, [snippet]);

  return (
    <>
      <div className="border rounded p-3 flex editor-wrapper">
        <div className="pr-2 text-right select-none text-gray-500 " style={{ userSelect: "none" }}>
          {Array.from({ length: lines.length + 1 }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <Editor
          value={code}
          onValueChange={setCode}
          highlight={(code) => Prism.highlight(code, Prism.languages.typescript, "typescript")}
          padding={0}
          className="font-mono "
          style={{
            flex: 1,
            whiteSpace: "break-spaces !important",
            border: "none",
            outline: "none !important",
            outlineColor: "transparent !important",
          }}
        />
      </div>
      <div className="flex justify-end w-full">
        <Button onClick={() => run(code)}>{runLoading ? <Spinner /> : "RUN"}</Button>
      </div>
    </>
  );
}
