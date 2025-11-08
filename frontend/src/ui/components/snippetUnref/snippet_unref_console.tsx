import type { PistonResponse } from "../../../types/general/piston";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../assets/tabs";

export default function SnippetUnrefConsole({ console }: { console: PistonResponse }) {
  return (
    <Tabs defaultValue="output" className="w-full">
      <TabsList>
        <TabsTrigger value="output">Output</TabsTrigger>
        <TabsTrigger
          value="errors"
          className="[color:var(--error)]"
          activeColor="[color:var(--error)]"
        >
          Errors
        </TabsTrigger>
        <TabsTrigger
          value="warnings"
          className="[color:var(--warning)]"
          activeColor="[color:var(--warning)]"
        >
          Warnings
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value="output"
        className="min-h-30 max-h-60 border w-full p-3 font-mono rounded overflow-y-auto whitespace-pre-wrap"
      >
        {console.run.stderr.length > 0 && console.run.code === 0 && (
          <p className="[color:var(--warning)]">{`[WARNING] : ` + console.run.stderr}</p>
        )}
        <br />
        <br />
        <p>{console.run.stdout}</p>
        <br />
        <br />
        {console.run.stderr.length > 0 && console.run.code === 1 && (
          <p className="[color:var(--error)]">{`[ERROR] : ` + console.run.stderr}</p>
        )}
      </TabsContent>
      <TabsContent
        value="errors"
        className="min-h-30 max-h-60 border w-full p-3 font-mono rounded overflow-y-auto whitespace-pre-wrap "
      >
        <p
          className={
            console.run.stderr.length > 0 && console.run.code === 1
              ? "[color:var(--error)]"
              : "[color:var(--success)]"
          }
        >
          {console.run.stderr.length > 0 && console.run.code === 1
            ? console.run.stderr.length
            : "No error detected"}
        </p>
      </TabsContent>
      <TabsContent
        value="warnings"
        className="min-h-30 max-h-60 border w-full p-3 font-mono rounded overflow-y-auto whitespace-pre-wrap"
      >
        <p
          className={
            console.run.stderr.length > 0 && console.run.code === 0
              ? "[color:var(--warning)]"
              : "[color:var(--success)]"
          }
        >
          {console.run.stderr.length > 0 && console.run.code === 0
            ? console.run.stderr
            : "No warnings detected"}
        </p>
      </TabsContent>
    </Tabs>
  );
}
