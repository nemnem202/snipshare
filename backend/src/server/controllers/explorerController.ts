import { Request, Response } from "express";
import { PrismaClient, Snippet } from "../../generated/prisma";
import { Custom } from "../lib/tools/logger";
import { ServerResponse } from "../types/global/response";
import prisma from "../runtime/prisma";

export default class ExplorerController {
  static getAPage = async (
    req: Request,
    res: Response<Snippet[] | ServerResponse>
  ): Promise<Response<Snippet[] | ServerResponse>> => {
    try {
      let index = parseInt(req.params.page_index);
      if (isNaN(index) || index < 0) index = 0;

      const language = req.query.lang ? String(req.query.lang) : null;
      const tags = Array.isArray(req.query.tags)
        ? req.query.tags.map(String)
        : req.query.tags
        ? [String(req.query.tags)]
        : [];

      const orderBy = req.query.orderBy;

      Custom.log("Get a page", { index, language, tags, orderBy });

      const snippets = await prisma.snippet.findMany({
        where: {
          ...(language && { languageName: language }),
          ...(tags.length > 0 && {
            filters: {
              some: {
                hashtagName: { in: tags },
              },
            },
          }),
        },
        orderBy: orderBy === "popularity" ? { likes: { _count: "desc" } } : { date: "desc" },
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
      const language = req.query.lang ? String(req.query.lang) : null;
      const tags = Array.isArray(req.query.tags)
        ? req.query.tags.map(String)
        : req.query.tags
        ? [String(req.query.tags)]
        : [];

      const snippetsNumber = await prisma.snippet.count({
        where: {
          ...(language && { languageName: language }),
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
