/**
 * useAsyncAction - Async Action Hook với Loading State
 *
 * Quản lý loading/error state cho async operations.
 * Giảm boilerplate trong form submissions, API calls.
 *
 * @example
 * ```tsx
 * const { execute, isLoading, error } = useAsyncAction(async (data) => {
 *   await submitForm(data);
 * });
 *
 * <form onSubmit={(e) => { e.preventDefault(); execute(formData); }}>
 *   <button disabled={isLoading}>
 *     {isLoading ? "Submitting..." : "Submit"}
 *   </button>
 * </form>
 * ```
 */

import { useState, useCallback } from "react";

interface UseAsyncActionOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface UseAsyncActionReturn<TArgs extends unknown[]> {
  execute: (...args: TArgs) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  reset: () => void;
}

export function useAsyncAction<TArgs extends unknown[]>(
  action: (...args: TArgs) => Promise<void>,
  options?: UseAsyncActionOptions
): UseAsyncActionReturn<TArgs> {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (...args: TArgs) => {
      setIsLoading(true);
      setError(null);

      try {
        await action(...args);
        options?.onSuccess?.();
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        options?.onError?.(error);
      } finally {
        setIsLoading(false);
      }
    },
    [action, options]
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  return { execute, isLoading, error, reset };
}
