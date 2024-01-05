import { createSafeActionClient } from 'next-safe-action';

export const serverAction = createSafeActionClient({
  handleReturnedServerError: (e) => ({ serverError: e.message }),
});
