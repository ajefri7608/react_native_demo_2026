let readAccessToken: () => string | null = () => null;

export function bindAccessToken(read: () => string | null) {
  readAccessToken = read;
}

export function accessToken() {
  return readAccessToken();
}
