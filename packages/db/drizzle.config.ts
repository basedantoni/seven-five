import { defineConfig, type Config } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/schema',
  schemaFilter: ['public'],
  out: './src/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
} satisfies Config);
