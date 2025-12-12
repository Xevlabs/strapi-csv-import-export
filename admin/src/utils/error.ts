export const handleRequestErr = (
  err: any,
  handlers: Partial<Record<string | number | 'default', (error: any) => void>>,
) => {
  const defaultHandler = handlers.default || (() => {});
  const { name: errorName, status: errorStatus } = err?.response?.payload?.error || {};
  const handler = (errorName && handlers[errorName]) || (errorStatus && handlers[errorStatus]) || defaultHandler;
  handler(err);
};
