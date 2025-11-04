import { Request, Response } from "express";
import { ServerResponse } from "../types/global/response";
import { PistonRequest, PistonResponse } from "../types/global/piston";
import z, { ZodError } from "zod";
import { Custom } from "../lib/tools/logger";

export default class PistonController {
  private static postUrl = "https://emkc.org/api/v2/piston/execute";
  private static codeSchema = z
    .string()
    .min(1, "Le code ne peut as être vide")
    .max(10_000, "Le code ne peut excéder 10 000 caractères");
  private static codeLanguage = z
    .string()
    .min(1, "Le nom du langage ne peut pas être vide.")
    .max(50, "Le nom du langage est trop long (maximum 50 caractères).");
  private static versionRegex = /^\d+(\.\d+)*$/;

  static post = async (
    req: Request,
    res: Response<ServerResponse | PistonResponse>
  ): Promise<Response<ServerResponse | PistonResponse>> => {
    const { language, content, version } = req.body;
    try {
      // if (!language || !content || !version) {
      //   Custom.error("code", "body not valid", { language, content, version });
      //   throw new Error();
      // }

      const parsedContent = this.codeSchema.safeParse(content);

      if (!parsedContent.success) {
        throw parsedContent.error;
      }

      const parsedLanguage = this.codeLanguage.safeParse(language);

      if (!parsedLanguage.success) {
        throw parsedLanguage.error;
      }

      const validVersion = this.versionRegex.exec(version);

      if (!validVersion) {
        Custom.error("code", "version format is not valid", version);
        throw new Error();
      }

      const body: PistonRequest = {
        langage: language,
        version: version,
        files: [
          {
            name: "user",
            content: content,
          },
        ],
      };

      const response = await fetch(this.postUrl, {
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      const status = response.status;

      if (status !== 200) {
        return res.json({
          message: "An error occured while sending data to the code runner api",
          success: false,
        });
      }

      return res.json(data as PistonResponse);
    } catch (err) {
      if (err instanceof ZodError) {
        const firstMessage = err.issues[0].message;
        return res.json({ success: false, message: firstMessage });
      }
      Custom.error("code", err);
      return res.json({ message: "An internal error occured, please try again !", success: false });
    }
  };
}
