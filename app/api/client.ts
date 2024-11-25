type ApiResponse<T> = {
  data: T | null;
  error: string | null;
};

type RequestOptions = {
  headers?: Record<string, string>;
};

export async function Get<T>(
  url: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const { headers } = options;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });

    if (!response.ok) {
      // エラーレスポンスを処理
      const errorText = await response.text();
      return { data: null, error: `Error ${response.status}: ${errorText}` };
    }

    const data = await response.json();
    return { data: data.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: (error as Error).message || "Unknown error occurred",
    };
  }
}
