import prisma from "../runtime/prisma";
import { faker } from "@faker-js/faker";

export default async function populateDb() {
  console.log("🌱 Starting database population...");

  try {
    // 1. Créer des langages de programmation
    const languages = [
      "JavaScript",
      "TypeScript",
      "Python",
      "Java",
      "C++",
      "C#",
      "Go",
      "Rust",
      "PHP",
      "Ruby",
      "Swift",
      "Kotlin",
    ];

    console.log("Creating languages...");
    for (const lang of languages) {
      await prisma.codeLanguage.upsert({
        where: { name: lang },
        update: {},
        create: { name: lang },
      });
    }

    // 2. Créer des hashtags
    const hashtags = [
      "tutorial",
      "beginner",
      "advanced",
      "algorithm",
      "data-structures",
      "web-dev",
      "mobile",
      "api",
      "frontend",
      "backend",
      "database",
      "testing",
      "security",
      "performance",
      "best-practices",
    ];

    console.log("Creating hashtags...");
    for (const tag of hashtags) {
      await prisma.hashtag.upsert({
        where: { name: tag },
        update: {},
        create: { name: tag },
      });
    }

    // 3. Créer des utilisateurs
    console.log("Creating users...");
    const userIds: number[] = [];
    for (let i = 0; i < 50; i++) {
      const user = await prisma.userAccount.create({
        data: {
          username: faker.internet.username() + faker.number.int({ min: 1000, max: 9999 }),
          email: faker.internet.email(),
          password: faker.internet.password(),
        },
      });
      userIds.push(user.id);
    }

    // 4. Créer des snippets
    console.log("Creating snippets...");
    const snippetIds: number[] = [];
    const codeExamples = [
      "function hello() {\n  console.log('Hello World');\n}",
      "const sum = (a, b) => a + b;",
      "class Calculator {\n  add(a, b) { return a + b; }\n}",
      "def fibonacci(n):\n    if n <= 1: return n\n    return fibonacci(n-1) + fibonacci(n-2)",
      "async function fetchData() {\n  const res = await fetch('/api');\n  return res.json();\n}",
    ];

    for (let i = 0; i < 300; i++) {
      const snippet = await prisma.snippet.create({
        data: {
          title: faker.lorem.words({ min: 2, max: 6 }),
          code: faker.helpers.arrayElement(codeExamples) + "\n// " + faker.lorem.sentence(),
          visibility: faker.datatype.boolean(),
          description: faker.helpers.maybe(() => faker.lorem.paragraph(), { probability: 0.7 }),
          date: faker.date.past({ years: 2 }),
          private_url: faker.helpers.maybe(() => faker.string.alphanumeric(20), {
            probability: 0.3,
          }),
          user_id: faker.helpers.arrayElement(userIds),
          languageName: faker.helpers.arrayElement(languages),
        },
      });
      snippetIds.push(snippet.code_snippet);
    }

    // 5. Créer des associations hashtag-snippet
    console.log("Creating snippet-hashtag associations...");
    for (let i = 0; i < 500; i++) {
      try {
        await prisma.filtrer.create({
          data: {
            snippetId: faker.helpers.arrayElement(snippetIds),
            hashtagName: faker.helpers.arrayElement(hashtags),
          },
        });
      } catch (error) {
        // Ignorer les doublons (contrainte @@id)
      }
    }

    // 6. Créer des likes
    console.log("Creating likes...");
    for (let i = 0; i < 800; i++) {
      try {
        await prisma.userLikesSnippet.create({
          data: {
            userId: faker.helpers.arrayElement(userIds),
            snippetId: faker.helpers.arrayElement(snippetIds),
          },
        });
      } catch (error) {
        // Ignorer les doublons
      }
    }

    // 7. Créer des commentaires
    console.log("Creating comments...");
    for (let i = 0; i < 400; i++) {
      try {
        await prisma.userCommentSnippet.create({
          data: {
            userId: faker.helpers.arrayElement(userIds),
            snippetId: faker.helpers.arrayElement(snippetIds),
            content: faker.lorem.sentences({ min: 1, max: 3 }),
            commentDate: faker.date.past({ years: 1 }),
          },
        });
      } catch (error) {
        // Ignorer les doublons
      }
    }

    console.log("✅ Database population completed!");
    console.log(`Created: ${userIds.length} users, ${snippetIds.length} snippets`);
  } catch (error) {
    console.error("❌ Error populating database:", error);
    throw error;
  }
}
