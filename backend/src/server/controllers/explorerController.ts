import { Request, Response } from "express";
import { PrismaClient, Snippet } from "../../generated/prisma";
import { Custom } from "../lib/tools/logger";
import { ServerResponse } from "../types/global/response";
import prisma from "../runtime/prisma";
import { number } from "zod";

export default class ExplorerController {
  static getAPage = async (
    req: Request,
    res: Response<Snippet[] | ServerResponse>
  ): Promise<Response<Snippet[] | ServerResponse>> => {
    try {
      let index = parseInt(req.params.page_index);
      if (isNaN(index) || index < 0) index = 0;

      const language = req.query.lang ? String(req.query.lang) : "javascript";
      const tags = Array.isArray(req.query.tags)
        ? req.query.tags.map(String)
        : req.query.tags
        ? [String(req.query.tags)]
        : [];

      const snippets = await prisma.snippet.findMany({
        where: {
          languageName: language,
          ...(tags.length > 0 && {
            filters: {
              some: {
                hashtagName: { in: tags },
              },
            },
          }),
        },
        orderBy: req.query.orderBy === "likes" ? { likes: { _count: "desc" } } : { date: "desc" },
        skip: index * 10,
        take: 10,
        include: {
          _count: { select: { likes: true } },
        },
      });

      return res.status(200).json(snippets);
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
      const language = req.query.lang ? String(req.query.lang) : "javascript";
      const tags = Array.isArray(req.query.tags)
        ? req.query.tags.map(String)
        : req.query.tags
        ? [String(req.query.tags)]
        : [];

      const snippetsNumber = await prisma.snippet.count({
        where: {
          languageName: language,
          ...(tags.length > 0 && {
            filters: {
              some: {
                hashtagName: { in: tags },
              },
            },
          }),
        },
      });

      return res.json({ number: snippetsNumber });
    } catch (err) {
      console.error("Error in getPageNumber:", err);
      return res.status(500).json({
        message: "Internal server error",
        success: false,
      });
    }
  };
}
