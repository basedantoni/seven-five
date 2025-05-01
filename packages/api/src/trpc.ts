import { createClient } from '@antho/auth/server';
import db from '@antho/db/client';
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const token = opts.headers.get('Authorization')?.split(' ')[1] ?? null;

  const supabase = await createClient();
  // Expo token is sent via Authorization header
  // Next.js token is from the cookie
  const {
    data: { user },
  } = token
    ? await supabase.auth.getUser(token) // Validates token
    : await supabase.auth.getUser();

  const source = opts.headers.get('x-trpc-source') ?? 'unknown';
  console.log(`>>> tRPC Request from: ${source} by ${user?.email}`);

  return {
    auth: {
      user,
    },
    db,
  };
};

/**
 * Initialize tRPC backend
 * Only needed once per backend
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

/**
 * middleware that enforces user authentication
 */
const enforceUserAuth = t.middleware(async ({ ctx, next }) => {
  const { user } = ctx.auth;

  if (!user) {
    console.log('No user');
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }

  return next({
    ctx: {
      ...ctx,
      db,
    },
  });
});

/**
 * protected procedure for only loggedin users
 */
export const protectedProcedure = t.procedure.use(enforceUserAuth);
