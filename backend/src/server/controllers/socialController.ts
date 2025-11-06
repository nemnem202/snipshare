import { Request, Response } from "express";
import { ServerResponse } from "../types/global/response";
import prisma from "../runtime/prisma";
import { ExplorerComment } from "../types/global/explorerComment";
import { Custom } from "../lib/tools/logger";

export default class SocialController {
  static getCommentsForSnippet = async (
    req: Request,
    res: Response<ServerResponse | ExplorerComment[]>
  ): Promise<Response<ServerResponse | ExplorerComment[]>> => {
    try {
      Custom.log("comment", "requested");
      const snippetId = parseInt(req.params.snippet_id);

      if (isNaN(snippetId) || snippetId < 0) {
        return res.json({ message: "invalid snippet requested", success: false });
      }

      const comments = await prisma.userCommentSnippet.findMany({
        where: { snippetId: snippetId },
        include: { user: { select: { username: true } } },
      });
      Custom.log("comments", comments);
      return res.json(comments);
    } catch (err) {
      return res.json({ message: "Internal server error", success: false });
    }
  };
}
