export const logger = (...args: unknown[]) => {
  if (process.env.NODE_ENV !== "production") console.warn(...args);
};
