import { sortByBest, sortByTop, sortByDateNew, sortByDateOld } from "./sorts";

test('Sort arrays of posts by best, top and date.', () => {
    const obj1 = { upvotes: 1, downvotes: 0, date: 123 };
    const obj2 = { upvotes: 0, downvotes: 1, date: 321 };
    const obj3 = { upvotes: 20, downvotes: 10, date: 1000 };
    const array = [obj1, obj2, obj3];

    sortByBest(array);
    expect(array).toEqual([obj3, obj1, obj2]);
    sortByTop(array);
    expect(array).toEqual([obj3, obj1, obj2]);
    sortByDateNew(array);
    expect(array).toEqual([obj3, obj2, obj1]);
    sortByDateOld(array);
    expect(array).toEqual([obj1, obj2, obj3]);
});