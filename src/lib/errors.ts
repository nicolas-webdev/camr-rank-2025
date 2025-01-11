export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: unknown) => {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    return Response.json(
      {
        error: error.message,
        details: error.details,
      },
      { status: error.statusCode }
    );
  }

  return Response.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}; 