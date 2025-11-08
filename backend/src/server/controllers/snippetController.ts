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

  static changeSnippet = async (
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

      const snippet_id = parseInt(req.params.snippet_id);

      if (isNaN(snippet_id))
        return res.json({ message: "Le snippet demandé est invalide", success: false });

      try {
        const snippet = await prisma.snippet.update({
          where: {
            code_snippet: snippet_id,
            user_id: req.userId,
          },
          data: {
            code: form.code,
            date: new Date(),
            title: form.title,
            description: form.description,
            filters: {
              deleteMany: {},
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
            private_url: form.private_url ? crypto.randomUUID() : undefined,
            visibility: form.visibility,
          },
        });
      } catch (err) {
        Custom.error("update db", err);
        return res.json({
          message: "An internal error occured, please try again !",
          success: false,
        });
      }

      return res.json({ message: "Snippet modifié !", success: true });
    } catch (err) {
      if (err instanceof ZodError) {
        const firstMessage = err.issues[0].message;
        Custom.error("snippet update", firstMessage);
        return res.json({ success: false, message: firstMessage });
      }
      Custom.error("snippet update", err);
      return res.json({ message: "An internal error occured, please try again !", success: false });
    }
  };
}
