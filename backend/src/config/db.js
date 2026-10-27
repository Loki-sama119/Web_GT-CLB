import { PrismaClient } from "@prisma/client";
import { assertTestDatabase } from "../utils/dataPolicy.js";

assertTestDatabase();

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

export default prisma;
