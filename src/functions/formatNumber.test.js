import formatNumber from "./formatNumber";

test('Convert number to shorter format', () => {
    expect(formatNumber(5)).toBe(5);
    expect(formatNumber(-4)).toBe(-4);
    expect(formatNumber(1000)).toBe('1.0k');
    expect(formatNumber(1500)).toBe('1.5k');
    expect(formatNumber(9499)).toBe('9.5k');
    expect(formatNumber(1000000)).toBe('1.0m');
    expect(formatNumber(7777777777)).toBe('7.8b');
});