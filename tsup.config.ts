import { defineConfig } from "tsup";

export default defineConfig({
    entry: { index: "src/serverless.ts" },
    format: ["cjs"],
    platform: "node",
    target: "node18",
    outDir: "dist",
    clean: false,
    external: [
        "express",
        "mongoose",
        "dotenv",
        "cors",
        "cookie-parser",
        "jsonwebtoken",
        "bcryptjs",
        "http-status-codes",
        "zod",
    ],
});