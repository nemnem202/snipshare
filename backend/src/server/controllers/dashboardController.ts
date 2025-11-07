import { Request, Response } from "express";
import { PrismaClient, Snippet } from "../../generated/prisma";
import { Custom } from "../lib/tools/logger";
import { ServerResponse } from "../types/global/response";
import prisma from "../runtime/prisma";
import languages from "../config/languages";
import { Langage } from "../types/global/language";
import { ExplorerSnippet } from "../types/global/explorerSnippet";

export default class DashboardController {
  static getAPage = async (
    req: Request,
    res: Response<Snippet[] | ServerResponse>
  ): Promise<Response<ExplorerSnippet[] | ServerResponse>> => {
    try {
      const userId = req.userId;
      if (!userId) throw new Error("No user id");

      let index = parseInt(req.params.page_index);
      if (isNaN(index) || index < 0) index = 0;

      const language = req.query.language ? String(req.query.language) : null;
      const tags = Array.isArray(req.query.tags)
        ? req.query.tags.map(String)
        : req.query.tags
        ? [String(req.query.tags)]
        : [];

      const madeByUser = req.query.madeByUser === "true";

      const orderBy = req.query.orderBy;

      Custom.log("Get a page", { index, language, tags, orderBy });

      const snippets = await prisma.snippet.findMany({
        where: {
          ...(madeByUser && { user_id: userId }),
          ...(!madeByUser && { likes: { some: { userId: userId } } }),
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
      const userId = req.userId;
      if (!userId) throw new Error("No user id");

      const language = req.query.language ? String(req.query.language) : null;
      const tags = Array.isArray(req.query.tags)
        ? req.query.tags.map(String)
        : req.query.tags
        ? [String(req.query.tags)]
        : [];

      const madeByUser = req.query.madeByUser === "true";

      const snippetsNumber = await prisma.snippet.count({
        where: {
          ...(madeByUser && { user_id: userId }),
          ...(!madeByUser && { likes: { some: { userId: userId } } }),
          user_id: userId,
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
}
