import { ShortUrlPipe } from './short-url.pipe';

describe('ShortUrlPipe', () => {
  it('create an instance', () => {
    const pipe = new ShortUrlPipe();
    expect(pipe).toBeTruthy();
  });
});
