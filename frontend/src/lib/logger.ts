export class Custom {
  private static styles = {
    reset: "\x1b[0m",
    bold: "\x1b[1m",
    underlined: "\x1b[4m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    white: "\x1b[37m",
    italic: "\x1B[3m",
    faint: "\x1B[2m",
    black: "\x1B[38;2;89;89;89m",
  };

  private static format(...args: any[]): string {
    return args.join("");
  }

  private static formatObject = (obj: any, indent = 2): string => {
    if (typeof obj !== "object" || obj === null) return this.parse(obj);

    const spaces = " ".repeat(indent);
    let result = "{\n";

    for (const [key, value] of Object.entries(obj)) {
      const formattedKey = this.format(this.styles.cyan, key, this.styles.reset);
      const formattedValue =
        typeof value === "object" && value !== null
          ? this.formatObject(value, indent + 2)
          : this.parse(value);
      result += `${spaces}${formattedKey}: ${formattedValue},\n`;
    }

    result += " ".repeat(indent - 2) + "}";
    return result;
  };

  private static parse(content: any): string {
    switch (typeof content) {
      case "number":
        return this.format(this.styles.bold, this.styles.yellow, content, this.styles.reset);
      case "boolean":
        return this.format(this.styles.bold, this.styles.magenta, content, this.styles.reset);
      case "function":
        return this.format(this.styles.green, content.name || "anonymous", this.styles.reset);
      case "string":
        return this.format(this.styles.white, this.styles.italic, content, this.styles.reset);
      case "object":
        if (content === null) return this.format(this.styles.red, "null", this.styles.reset);
        return this.formatObject(content);
      case "undefined":
        return this.format(this.styles.red, "undefined", this.styles.reset);
      default:
        return this.format(this.styles.white, String(content), this.styles.reset);
    }
  }

  private static alignType(type: string): string {
    const upper = type.toUpperCase();
    const padding = Math.max(0, 15 - upper.length);
    return `[${upper}] :` + " ".repeat(padding);
  }

  private static handleLog(
    prefix: string,
    message?: any,
    optionalParams: any[] = [],
    method: "log" | "warn" | "error" = "log"
  ) {
    const parsedMessage = this.parse(message);
    const formattedLine = `${prefix} ${parsedMessage}`;

    if (optionalParams.length > 0) {
      console[method](formattedLine);

      console.table(optionalParams);
      console.log();
    } else {
      console[method](formattedLine);
      const stripAnsi = (str: string) => str.replace(/\x1b\[[0-9;]*m/g, "");
      const lines = formattedLine.split("\n");
      const visibleLengths = lines.map((line) => stripAnsi(line).length);
      const maxLength = Math.max(...visibleLengths);
      console.log(this.format(this.styles.faint, this.styles.black, "━".repeat(maxLength)));
    }
  }

  static warn(type: string, message?: any, ...optionalParams: any[]) {
    const prefix = this.format(
      this.styles.bold,
      this.styles.yellow,
      this.alignType(type),
      this.styles.reset
    );
    this.handleLog(prefix, message, optionalParams, "warn");
  }

  static error(type: string, message?: any, ...optionalParams: any[]) {
    const prefix = this.format(
      this.styles.bold,
      this.styles.red,
      this.alignType(type),
      this.styles.reset
    );
    this.handleLog(prefix, message, optionalParams, "error");
  }

  static log(type: string, message?: any, ...optionalParams: any[]) {
    const prefix = this.format(
      this.styles.bold,
      this.styles.cyan,
      this.alignType(type),
      this.styles.reset
    );
    this.handleLog(prefix, message, optionalParams, "log");
  }
}
