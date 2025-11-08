import { Request, Response } from "express";
import { ServerResponse } from "../types/global/response";
import prisma from "../runtime/prisma";
import { ExplorerComment } from "../types/global/explorerComment";
import { Custom } from "../lib/tools/logger";
import { ZodError } from "zod";
import SchemaParser from "../lib/middlewares/schemaParser";

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

  static postComment = async (
    req: Request,
    res: Response<ServerResponse | ExplorerComment>
  ): Promise<Response<ServerResponse | ExplorerComment>> => {
    try {
      const { comment } = req.body;

      const entity = {
        content: comment,
        userId: req.userId!,
        snippetId: parseInt(req.params.snippet_id),
        commentDate: new Date(),
      };

      SchemaParser.UserCommentSnippet(entity);

      const commentInDb = await prisma.userCommentSnippet.create({
        data: entity,
        include: { user: { select: { username: true } } },
      });

      return res.json(commentInDb);
    } catch (err) {
      if (err instanceof ZodError) {
        const firstMessage = err.issues[0].message;
        return res.json({ success: false, message: firstMessage });
      }
      Custom.error("user create", err);
      return res.json({ message: "An internal error occured, please try again !", success: false });
    }
  };
}
