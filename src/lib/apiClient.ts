export async function apiFetch<T>(
  path: string,
  options: RequestInit & { getToken?: () => Promise<string | null> } = {}
): Promise<T> {
  const { getToken, ...rest } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(rest.headers as Record<string, string>),
  };

  if (getToken) {
    const token = await getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(path, { ...rest, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const error = new Error(body.error || res.statusText);
    (error as Error & { status: number }).status = res.status;
    throw error;
  }

  return res.json();
}
