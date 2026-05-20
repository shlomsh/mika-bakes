import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

type UploadResult = { url: string | null; isUploading: boolean; error: string | null };

export function useImageUpload(initialUrl: string | null = null) {
  const { getToken } = useAuth();
  const [url, setUrl] = useState<string | null>(initialUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error('לא מחובר — יש להתחבר מחדש לפני העלאה');
      const res = await fetch(`/api/recipes/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: file,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `העלאת התמונה נכשלה (${res.status})`);
      }
      const data = await res.json();
      setUrl(data.url);
      return data.url;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const reset = (next: string | null = null) => {
    setUrl(next);
    setError(null);
  };

  return { url, isUploading, error, uploadFile, reset } satisfies UploadResult & {
    uploadFile: (file: File) => Promise<string | null>;
    reset: (next?: string | null) => void;
  };
}
