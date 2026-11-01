import { request } from './client';
import type { Author, Book, PageResponse, ReadResponse } from './types';

const listParams = { page: 0, size: 20, sort: 'id,asc' };

export function getBooks(): Promise<PageResponse<Book>> {
  return request<PageResponse<Book>>({
    method: 'GET',
    url: '/api/v1/books',
    params: listParams,
  });
}

export function getBook(id: number): Promise<ReadResponse<Book>> {
  return request<ReadResponse<Book>>({
    method: 'GET',
    url: `/api/v1/books/${id}`,
  });
}

export function getAuthors(): Promise<PageResponse<Author>> {
  return request<PageResponse<Author>>({
    method: 'GET',
    url: '/api/v1/authors',
    params: listParams,
  });
}

export function createBook(body: {
  name: string;
  authorId: number;
}): Promise<ReadResponse<Book>> {
  return request<ReadResponse<Book>>(
    {
      method: 'POST',
      url: '/api/v1/books',
      data: body,
    },
    { auth: true },
  );
}
