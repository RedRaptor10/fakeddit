import getVotes from "./getVotes";

test('Takes post upvotes & downvotes and returns number of votes.', () => {
    const post1 = {
        upvotes: 10,
        downvotes: 4
    };
    const post2 = {
        upvotes: 1,
        downvotes: 5
    };
    const post3 = {
        upvotes: 1000,
        downvotes: 0
    };
    const post4 = {
        upvotes: 2000,
        downvotes: 500
    };
    const post5 = {
        upvotes: 9999,
        downvotes: 500
    };

    expect(getVotes(post1)).toBe(6);
    expect(getVotes(post2)).toBe(-4);
    expect(getVotes(post3)).toBe('1.0k');
    expect(getVotes(post4)).toBe('1.5k');
    expect(getVotes(post5)).toBe('9.5k');
});