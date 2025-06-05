import pg from 'postgres';

export const isUniqueConstraintError = (error: unknown) => {
  /** https://github.com/porsager/postgres/pull/901 */
  // eslint-disable-next-line import/no-named-as-default-member
  return error instanceof pg.PostgresError && error.code === '23505';
};
