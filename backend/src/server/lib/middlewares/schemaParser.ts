import z, { ZodError } from "zod";

export default class SchemaParser {
  static UserAccount(data: unknown) {
    const schema = z.object({
      username: z
        .string()
        .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères.")
        .max(30, "Le nom d'utilisateur ne peut pas dépasser 30 caractères."),
      email: z.string().email("L'adresse e-mail n'est pas valide."),
      password: z
        .string()
        .min(6, "Le mot de passe doit contenir au moins 6 caractères.")
        .max(100, "Le mot de passe ne peut pas dépasser 100 caractères."),
    });

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      throw parsed.error;
    }
  }

  static CodeLanguage(data: unknown) {
    const schema = z.object({
      name: z
        .string()
        .min(1, "Le nom du langage ne peut pas être vide.")
        .max(50, "Le nom du langage est trop long (maximum 50 caractères)."),
    });

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      throw parsed.error;
    }
  }

  static Hashtag(data: unknown) {
    const schema = z.object({
      name: z
        .string()
        .min(1, "Le nom du hashtag ne peut pas être vide.")
        .max(50, "Le nom du hashtag est trop long (maximum 50 caractères)."),
    });

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      throw parsed.error;
    }
  }

  static Snippet(data: unknown) {
    const schema = z.object({
      code_snippet: z.number().optional(),
      private_url: z
        .string()
        .max(255, "L'URL privée est trop longue (maximum 255 caractères).")
        .nullable()
        .optional(),
      title: z
        .string()
        .min(3, "Le titre doit contenir au moins 3 caractères.")
        .max(100, "Le titre ne peut pas dépasser 100 caractères."),
      code: z
        .string()
        .min(1, "Le code ne peut pas être vide.")
        .max(10_000, "Le code ne peut pas excéder 10 000 caractères."),
      visibility: z.boolean().nullable().optional(),
      description: z
        .string()
        .max(500, "La description est trop longue (maximum 500 caractères).")
        .nullable()
        .optional(),
      user_id: z.number(),
      languageName: z
        .string()
        .min(1, "Le langage doit être spécifié.")
        .max(50, "Le nom du langage est trop long (maximum 50 caractères)."),
    });

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      throw parsed.error;
    }
  }

  static UserLikesSnippet(data: unknown) {
    const schema = z.object({
      userId: z.number(),
      snippetId: z.number(),
    });

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      parsed.error.message = "Impossible de traiter cette action !";
      throw parsed.error;
    }
    return parsed.data;
  }

  static Filtrer(data: unknown) {
    const schema = z.object({
      snippetId: z.number(),
      hashtagName: z
        .string()
        .min(1, "Le hashtag doit être spécifié.")
        .max(50, "Le nom du hashtag est trop long (maximum 50 caractères)."),
    });

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      throw parsed.error;
    }
  }

  static UserCommentSnippet(data: unknown) {
    const schema = z.object({
      userId: z.number(),
      snippetId: z.number(),
      content: z
        .string()
        .min(1, "Le commentaire ne peut pas être vide.")
        .max(500, "Le commentaire est trop long (maximum 500 caractères)."),
      commentDate: z.string().or(z.date()),
    });

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      throw parsed.error;
    }
  }
}
