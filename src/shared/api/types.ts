export type Author = {
  id: number;
  name: string;
  country: string;
};

export type Book = {
  id: number;
  name: string;
  author: Author;
};

export type PageInfo = {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

export type PageResponse<T> = {
  dataSource: string;
  data: T[];
  pagination: PageInfo;
};

export type ReadResponse<T> = {
  dataSource: string;
  data: T;
};

export type LoginResult = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
};
