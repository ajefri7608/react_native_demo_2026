import { useEffect, useState } from 'react';
import { ApiError } from '../../../shared/api/httpError';
import { getBook } from '../../../shared/api/booksApi';
import type { Book } from '../../../shared/api/types';

type LoadStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export function useBook(bookId: number) {
  const [book, setBook] = useState<Book | null>(null);
  const [dataSource, setDataSource] = useState<string | null>(null);
  const [status, setStatus] = useState<LoadStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setStatus('loading');
    setError(null);
    getBook(bookId)
      .then(response => {
        if (!active) {
          return;
        }
        setBook(response.data);
        setDataSource(response.dataSource);
        setStatus('succeeded');
      })
      .catch(caught => {
        if (!active) {
          return;
        }
        setStatus('failed');
        setError(caught instanceof ApiError ? caught.message : '讀取失敗');
      });
    return () => {
      active = false;
    };
  }, [bookId]);

  return { book, dataSource, status, error };
}
