import { useState } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/themes/prism-tomorrow.css";
import "../style/components/snippet_code.css";

const TEXTVALUE = `class Person {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  greet(): string {
    return \`Salut, je m'appelle \${this.name} et j'ai \${this.age} ans.\`;
  }
}

const naim = new Person("Naïm", 21);
console.log(naim.greet());`;

export default function SnippetCode() {
  const [code, setCode] = useState(TEXTVALUE);
  const lines = code.split("\n");

  return (
    <div className="border rounded p-3 flex editor-wrapper">
      <div className="pr-2 text-right select-none text-gray-500" style={{ userSelect: "none" }}>
        {Array.from({ length: lines.length + 1 }).map((_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <Editor
        value={code}
        onValueChange={setCode}
        highlight={(code) => Prism.highlight(code, Prism.languages.typescript, "typescript")}
        padding={0}
        className="font-mono"
        style={{
          flex: 1,
          border: "none",
          outline: "none !important",
          outlineColor: "transparent !important",
        }}
      />
    </div>
  );
}
