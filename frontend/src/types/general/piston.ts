export type Console = {
  stdout: string;
  stderr: string;
  code: number;
  signal: string | null;
  output: string;
};

export type PistonResponse = {
  language: string;
  version: string;
  run: Console;
  compile?: Console;
};

export type PistonRequest = {
  langage: string;
  version: string;
  files: [
    {
      name: string;
      content: string;
    }
  ];
};
