const getVotes = post => {
    let votes = post.upvotes - post.downvotes;

    if (votes >= 1000) {
        votes = (votes / 1000).toFixed(1) + 'k';
    }

    return votes;
};

export default getVotes;