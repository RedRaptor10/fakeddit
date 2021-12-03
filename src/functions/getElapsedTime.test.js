import getElapsedTime from "./getElapsedTime";

test('Converts seconds to string showing amount of time passed since then.', () => {
    expect(getElapsedTime(1638338400)).toBe('2 days ago'); // Time since 12/1/21
    expect(getElapsedTime(Date.now() / 1000)).toBe('Just now');
});