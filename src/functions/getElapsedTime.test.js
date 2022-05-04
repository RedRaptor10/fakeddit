import getElapsedTime from "./getElapsedTime";

test('Convert seconds to string showing amount of time passed since then', () => {
    expect(getElapsedTime(Date.now() / 1000)).toBe('Just now');
    expect(getElapsedTime((Date.now() / 1000) - 60)).toBe('1 minute ago');
    expect(getElapsedTime((Date.now() / 1000) - (60 * 60))).toBe('1 hour ago');
    expect(getElapsedTime((Date.now() / 1000) - (60 * 60 * 24))).toBe('1 day ago');
    expect(getElapsedTime((Date.now() / 1000) - (60 * 60 * 24 * 2))).toBe('2 days ago');
    expect(getElapsedTime((Date.now() / 1000) - (60 * 60 * 24 * 30))).toBe('1 month ago');
    expect(getElapsedTime((Date.now() / 1000) - (60 * 60 * 24 * 31))).toBe('1 month ago');
    expect(getElapsedTime((Date.now() / 1000) - (60 * 60 * 24 * 365))).toBe('1 year ago');
});