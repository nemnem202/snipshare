import { configDotenv } from "dotenv";
import { DbVariables } from "../types/global/db_variables";
import { Custom } from "../lib/tools/logger";

configDotenv();

const { POSTGRES_DB, POSTGRES_HOST, POSTGRES_PASSWORD, POSTGRES_USER } = process.env;

if (!POSTGRES_DB || !POSTGRES_HOST || !POSTGRES_PASSWORD || !POSTGRES_USER) {
  Custom.error("env", {
    POSTGRES_DB,
    POSTGRES_HOST,
    POSTGRES_PASSWORD,
    POSTGRES_USER,
  });
  throw new Error("environnement variables are not provided");
}

export const db: DbVariables = {
  db: POSTGRES_DB,
  host: POSTGRES_HOST,
  password: POSTGRES_PASSWORD,
  user: POSTGRES_USER,
};
