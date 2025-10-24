import type { PistonResponse } from "../../types/general/piston";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../assets/tabs";

export default function SnippetConsole() {
  const console: PistonResponse = {
    language: "typescript",
    version: "5.0.3",
    run: {
      stdout:
        "Ceci est un message de log\nVoici une autre ligne de log\nLe processus est en cours...\nExécution en cours...\nLes données ont été récupérées avec succès\nDémarrage du processus de nettoyage\nLe programme se termine maintenant\nFin du script d'exemple\n",
      stderr:
        "Avertissement : Vérifiez vos paramètres\nErreur : Quelque chose s'est mal passé\nAttention ! Cela peut causer des problèmes\nErreur fatale : Impossible de continuer\nIl semble que nous avons atteint la limite de la mémoire\nÉchec de la connexion au serveur\nCet API est obsolète\nErreur inconnue pendant le processus\nAttention : Vous avez un conflit de versions\nCe processus prend plus de temps que prévu\nImpossible de trouver le fichier requis\nErreur : L'opération n'a pas pu être complétée\n",
      code: 0,
      signal: null,
      output:
        "Ceci est un message de log\nAvertissement : Vérifiez vos paramètres\nErreur : Quelque chose s'est mal passé\nVoici une autre ligne de log\nAttention ! Cela peut causer des problèmes\nErreur fatale : Impossible de continuer\nLe processus est en cours...\nIl semble que nous avons atteint la limite de la mémoire\nExécution en cours...\nÉchec de la connexion au serveur\nCet API est obsolète\nLes données ont été récupérées avec succès\nErreur inconnue pendant le processus\nAttention : Vous avez un conflit de versions\nDémarrage du processus de nettoyage\nCe processus prend plus de temps que prévu\nImpossible de trouver le fichier requis\nLe programme se termine maintenant\nErreur : L'opération n'a pas pu être complétée\nFin du script d'exemple\n",
    },
    compile: {
      stdout: "",
      stderr: "",
      code: 0,
      signal: null,
      output: "",
    },
  };
  return (
    <Tabs defaultValue="output" className="w-full">
      <TabsList>
        <TabsTrigger value="output">Output</TabsTrigger>
        <TabsTrigger value="errors">Errors</TabsTrigger>
        <TabsTrigger value="warnings">Warnings</TabsTrigger>
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
