import { Request, Response } from "express";
import { ServerResponse } from "../types/global/response";
import { Custom } from "../lib/tools/logger";
import { ZodError } from "zod";
import SchemaParser from "../lib/middlewares/schemaParser";
import prisma from "../runtime/prisma";
import { SnippetForm } from "../types/global/snippetForm";

export default class SnippetController {
  static addNewSnippet = async (
    req: Request,
    res: Response<ServerResponse>
  ): Promise<Response<ServerResponse>> => {
    try {
      const form = req.body as SnippetForm;

      SchemaParser.SnippetForm(form);

      const lang = await prisma.codeLanguage.findFirst({
        select: { id: true },
        where: { language: form.language.language, version: form.language.version },
      });

      if (!lang) return res.json({ message: "Language invalide !", success: false });

      if (!req.userId) throw new Error();

      const snippet = await prisma.snippet.create({
        data: {
          code: form.code,
          date: new Date(),
          title: form.title,
          description: form.description,
          filters: {
            create: form.filters.map((f) => ({
              hashtag: {
                connectOrCreate: {
                  where: { name: f },
                  create: { name: f },
                },
              },
            })),
          },
          langageId: lang.id,
          user_id: req.userId,
          private_url: form.private_url ? crypto.randomUUID() : undefined,
          visibility: form.visibility,
        },
      });

      return res.json({ message: "Snippet ajouté !", success: true });
    } catch (err) {
      if (err instanceof ZodError) {
        const firstMessage = err.issues[0].message;
        return res.json({ success: false, message: firstMessage });
      }
      Custom.error("snippet create", err);
      return res.json({ message: "An internal error occured, please try again !", success: false });
    }
  };
}
