import { Request, Response } from "express";
import { PrismaClient, Snippet } from "../../generated/prisma";
import { Custom } from "../lib/tools/logger";
import { ServerResponse } from "../types/global/response";
import prisma from "../runtime/prisma";
import languages from "../config/languages";
import { Langage } from "../types/global/language";
import { ExplorerSnippet } from "../types/global/explorerSnippet";

export default class ExplorerController {
  static getAPage = async (
    req: Request,
    res: Response<Snippet[] | ServerResponse>
  ): Promise<Response<ExplorerSnippet[] | ServerResponse>> => {
    try {
      let index = parseInt(req.params.page_index);
      if (isNaN(index) || index < 0) index = 0;

      const language = req.query.language ? String(req.query.language) : null;
      const tags = Array.isArray(req.query.tags)
        ? req.query.tags.map(String)
        : req.query.tags
        ? [String(req.query.tags)]
        : [];

      const orderBy = req.query.orderBy;

      Custom.log("Get a page", { index, language, tags, orderBy });

      const snippets = await prisma.snippet.findMany({
        where: {
          visibility: true,
          ...(language && {
            language: {
              language: language,
            },
          }),
          ...(tags.length > 0 && {
            filters: {
              some: {
                hashtagName: { in: tags.map((t) => t.toLowerCase()) },
              },
            },
          }),
        },
        orderBy: orderBy === "popularity" ? { likes: { _count: "desc" } } : { date: "desc" },
        skip: index * 10,
        take: 10,
        include: {
          likes: { select: { userId: true } },
          filters: true,
          user: {
            select: {
              username: true,
            },
          },
          language: true,
          _count: { select: { likes: true } },
        },
      });

      const snippetsWithLikeFlag = snippets.map((snippet) => ({
        ...snippet,
        likes: snippet.likes.some((like) => like.userId === req.userId),
      }));

      // Custom.log(
      //   "nombre de snippets likés par l'utilisateur",
      //   snippetsWithLikeFlag.filter((s) => s.likes).length
      // );

      return res.status(200).json(snippetsWithLikeFlag);
    } catch (err) {
      console.error("Error in getAPage:", err);
      return res.status(500).json({
        message: "Internal server error",
        success: false,
      });
    }
  };

  static getPageNumber = async (
    req: Request,
    res: Response
  ): Promise<Response<ServerResponse | { number: number }>> => {
    try {
      const language = req.query.language ? String(req.query.language) : null;
      const tags = Array.isArray(req.query.tags)
        ? req.query.tags.map(String)
        : req.query.tags
        ? [String(req.query.tags)]
        : [];

      const snippetsNumber = await prisma.snippet.count({
        where: {
          visibility: true,
          ...(language && {
            language: {
              language: language,
            },
          }),
          ...(tags.length > 0 && {
            filters: {
              some: {
                hashtagName: { in: tags },
              },
            },
          }),
        },
      });

      Custom.log("Number of snippets found", snippetsNumber);

      return res.json({ number: Math.ceil(snippetsNumber / 10) });
    } catch (err) {
      Custom.log("Error in getPageNumber", err);
      return res.status(500).json({
        message: "Internal server error",
        success: false,
      });
    }
  };

  static getAvailablesLanguages = async (
    req: Request,
    res: Response
  ): Promise<Response<string[] | Langage[]>> => {
    try {
      const onlyNames = req.query.onlyNames;
      return onlyNames === "true"
        ? res.json(languages.map((l) => l.language))
        : res.json(languages);
    } catch (err) {
      console.error("Error in getAvailablesLanguages:", err);
      return res.status(500).json({
        message: "Internal server error",
        success: false,
      });
    }
  };
}
