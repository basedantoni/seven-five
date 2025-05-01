# Antho Repo Start

This is a starter for Next.js + Expo applications

## Current Tech Stack

- React + Next.js
- React Native + Expo
- Supabase
  - Auth + Postgres DB
- tRPC + Tanstack Query (API + State management)
- Drizzle + Zod (ORM)
- Shadcn (web UI)
- Unistyles (native UI)

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `native`: an [Expo](https://expo.dev/) app
- `@antho/api`: [tRPC](https://trpc.io/) API
- `@antho/auth`: [Supabase](https://supabase.com/docs/guides/auth) Authentication logic
- `@antho/db`: [Drizzle](https://orm.drizzle.team/) database connector
- `@antho/ui`: [Shadcn](https://ui.shadcn.com/) component library shared by both `web` and `docs` applications
- `@antho/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

## Getting Started

### Install Packages

```
pnpm install
```

### Environment

This project requires some environment variables to get up an running and can be found in `.env.example`

```
cp .env.example .env
```

### Build

To build all apps and packages, run the following command:

```
cd antho-repo
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd antho-repo
pnpm dev
```

### Database Migrations

To generate database migrations, run the following command:

```
pnpm db:generate
```

To run database migrations, run the following command:

```
pnpm db:migrate
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd antho-repo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
