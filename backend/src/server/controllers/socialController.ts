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
  static likeSnippet = async (
    req: Request,
    res: Response<ServerResponse>
  ): Promise<Response<ServerResponse>> => {
    try {
      if (!req.userId) {
        return res.json({ message: "Unauthorized", success: false });
      }

      const snippetId = parseInt(req.params.snippet_id);
      if (isNaN(snippetId)) {
        return res.json({ message: "Invalid snippet id", success: false });
      }

      const snippet = await prisma.snippet.findUnique({
        where: { code_snippet: snippetId },
      });
      if (!snippet) {
        return res.json({ message: "Snippet not found", success: false });
      }

      const alreadyLiked = await prisma.userLikesSnippet.findUnique({
        where: {
          userId_snippetId: {
            userId: req.userId,
            snippetId: snippetId,
          },
        },
      });
      if (alreadyLiked) {
        return res.json({ message: "You already liked this snippet!", success: true });
      }

      await prisma.userLikesSnippet.create({
        data: {
          snippetId: snippetId,
          userId: req.userId,
        },
      });

      return res.json({ message: "Snippet added to your likes!", success: true });
    } catch (error) {
      console.error("Error in likeSnippet:", error);
      return res.json({ message: "Internal server error", success: false });
    }
  };

  static unlikeSnippet = async (
    req: Request,
    res: Response<ServerResponse>
  ): Promise<Response<ServerResponse>> => {
    try {
      if (!req.userId) {
        return res.json({ message: "Unauthorized", success: false });
      }

      const snippetId = parseInt(req.params.snippet_id);
      if (isNaN(snippetId)) {
        return res.json({ message: "Invalid snippet id", success: false });
      }

      const snippet = await prisma.snippet.findUnique({
        where: { code_snippet: snippetId },
      });
      if (!snippet) {
        return res.json({ message: "Snippet not found", success: false });
      }

      const alreadyLiked = await prisma.userLikesSnippet.delete({
        where: {
          userId_snippetId: {
            userId: req.userId,
            snippetId: snippetId,
          },
        },
      });

      return res.json({ message: "Snippet removed from your likes!", success: true });
    } catch (error) {
      console.error("Error in likeSnippet:", error);
      return res.json({ message: "Internal server error", success: false });
    }
  };
}
