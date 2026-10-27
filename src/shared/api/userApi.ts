export const QUICK_MS = 700;
export const TIMEOUT_MS = 1200;
export const SLOW_MS = 3200;

export type User = {
  name: string;
};

export function wait(ms: number) {
  return new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });
}

export function getUser(name: string, delayMs = QUICK_MS): Promise<User> {
  return wait(delayMs).then(() => {
    const trimmed = name.trim();
    return { name: trimmed.length > 0 ? trimmed : 'Amy' };
  });
}
