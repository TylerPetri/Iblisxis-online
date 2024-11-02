import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  extensionsFilters: ["postgis"],
  dbCredentials: {
    host: process.env.PGHOST!,
    user: process.env.PGUSER!,
    password: process.env.PASSWORD!,
    database: process.env.PGDATABASE!,
    ssl: 'require' // can be boolean | "require" | "allow" | "prefer" | "verify-full" | options from node:tls
  }
});
