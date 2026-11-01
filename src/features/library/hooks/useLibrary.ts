import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../../../shared/api/httpError';
import { createBook, getAuthors, getBooks } from '../../../shared/api/booksApi';
import type { Author, Book } from '../../../shared/api/types';

type LoadStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export function useLibrary() {
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [dataSource, setDataSource] = useState<string | null>(null);
  const [status, setStatus] = useState<LoadStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const [bookPage, authorPage] = await Promise.all([getBooks(), getAuthors()]);
      setBooks(bookPage.data);
      setAuthors(authorPage.data);
      setDataSource(bookPage.dataSource);
      setStatus('succeeded');
    } catch (caught) {
      setStatus('failed');
      setError(caught instanceof ApiError ? caught.message : '讀取失敗');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addBook = useCallback(
    async (input: { name: string; authorId: number }) => {
      setCreating(true);
      setCreateError(null);
      try {
        await createBook(input);
        await load();
      } catch (caught) {
        setCreateError(caught instanceof ApiError ? caught.message : '新增失敗');
      } finally {
        setCreating(false);
      }
    },
    [load],
  );

  return {
    books,
    authors,
    dataSource,
    status,
    error,
    creating,
    createError,
    reload: load,
    addBook,
  };
}
