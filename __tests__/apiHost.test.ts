import { hostFromScriptUrl } from '../src/shared/api/baseUrl';

describe('api host', () => {
  it('uses the host the device already uses to reach Metro', () => {
    expect(
      hostFromScriptUrl('http://localhost:8081/index.bundle?platform=ios'),
    ).toBe('localhost');
    expect(
      hostFromScriptUrl('http://10.0.2.2:8081/index.bundle?platform=android'),
    ).toBe('10.0.2.2');
    expect(
      hostFromScriptUrl('http://192.168.1.20:8081/index.bundle?platform=android'),
    ).toBe('192.168.1.20');
    expect(hostFromScriptUrl(undefined)).toBeNull();
  });
});
