import { Request, Response } from "express";
import { ServerResponse } from "../types/global/response";
import { PistonRequest, PistonResponse } from "../types/global/piston";
import z, { ZodError } from "zod";
import { Custom } from "../lib/tools/logger";

export default class PistonController {
  private static postUrl = "https://emkc.org/api/v2/piston/execute";
  private static codeSchema = z
    .string()
    .min(1, "Le code ne peut pas être vide")
    .max(10_000, "Le code ne peut excéder 10 000 caractères");

  private static codeLanguage = z
    .string()
    .min(1, "Le nom du langage ne peut pas être vide.")
    .max(50, "Le nom du langage est trop long (maximum 50 caractères).");

  private static versionSchema = z
    .string()
    .regex(/^\d+(\.\d+)*$/, "Le format de version est invalide (ex: 5.0.3)");

  static post = async (
    req: Request,
    res: Response<ServerResponse | PistonResponse>
  ): Promise<Response<ServerResponse | PistonResponse>> => {
    const { language, content, version } = req.body;

    Custom.log("piston", "Received request");

    try {
      const parsedContent = this.codeSchema.safeParse(content);
      if (!parsedContent.success) {
        Custom.error("piston", "Content validation failed");
        throw parsedContent.error;
      }

      const parsedLanguage = this.codeLanguage.safeParse(language);
      if (!parsedLanguage.success) {
        Custom.error("piston", "Language validation failed");
        throw parsedLanguage.error;
      }

      const parsedVersion = this.versionSchema.safeParse(version);
      if (!parsedVersion.success) {
        Custom.error("piston", "Version validation failed");
        throw parsedVersion.error;
      }

      const body: PistonRequest = {
        language: language,
        version: version,
        files: [
          {
            name: "main",
            content: content,
          },
        ],
      };

      Custom.log("piston", "Sending request to Piston API");

      const response = await fetch(this.postUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      Custom.log("piston", "Received response from Piston API");

      let data: any;

      try {
        data = await response.json();
        Custom.log("piston", "Response parsed successfully");
      } catch (parseError) {
        Custom.error("piston", "Failed to parse response JSON");
        return res.status(500).json({
          message: "Failed to parse response from code runner API",
          success: false,
        });
      }

      Custom.warn("piston", "response sent");

      if (!response.ok) {
        Custom.error("piston", "Piston API returned an error");
        return res.status(response.status).json({
          message: "An error occured while sending data to the code runner api",
          success: false,
        });
      }

      if (!data.run) {
        Custom.error("piston", "Unexpected response structure from Piston");
        return res.status(500).json({
          message: "Unexpected response structure from code runner API",
          success: false,
        });
      }

      Custom.log("piston", "Request completed successfully");

      return res.json(data as PistonResponse);
    } catch (err) {
      if (err instanceof ZodError) {
        const firstIssue = err.issues[0];
        Custom.warn("piston", "Validation error");
        return res.status(400).json({
          success: false,
          message: firstIssue.message,
        });
      }

      if (err instanceof TypeError && err.message.includes("fetch")) {
        Custom.error("piston", "Network error while contacting Piston API");
        return res.status(503).json({
          message: "Unable to contact code runner API. Please try again later.",
          success: false,
        });
      }

      Custom.error("piston", "Unexpected error");

      return res.status(500).json({
        message: "An internal error occured, please try again!",
        success: false,
      });
    }
  };
}
