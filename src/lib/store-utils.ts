export const createAsyncAction = async <T>(
  action: () => Promise<T>,
  setError: (error: string | null) => void,
  setLoading: (loading: boolean) => void
): Promise<T | undefined> => {
  try {
    setError(null);
    setLoading(true);
    return await action();
  } catch (error) {
    setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    return undefined;
  } finally {
    setLoading(false);
  }
}; 