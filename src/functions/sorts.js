/* Sort by hot
Sort by date (desc), split between recent (last 24 hrs) and old,
then sort recent by top (desc) */
const sortByHot = (array) => {
    sortByDateNew(array);

    const date = new Date();
    const array1 = [];
    const array2 = [];
    array.forEach((p) => {
        const deltaSeconds = (date.getTime() / 1000) - p.date.seconds;
        const deltaHours = deltaSeconds / 60 / 60;
        deltaHours <= 24 ? array1.push(p) : array2.push(p);
    });

    sortByTop(array1);
    array = (array1.concat(array2)).slice();
};

// Sort by best (upvotes / downvotes) (desc)
const sortByBest = (array) => {
    array.sort((a, b) => {
        // Check for zero divisor
        let resultA = (a.downvotes === 0) ? a.upvotes : a.upvotes / a.downvotes;
        let resultB = (b.downvotes === 0) ? b.upvotes : b.upvotes / b.downvotes;

        return resultB - resultA;
    });
};

// Sort by top (votes) (desc)
const sortByTop = (array) => {
    array.sort((a, b) => {
        return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
    });
};

// Sort by date (desc)
const sortByDateNew = (array) => {
    array.sort((a, b) => {
        return b.date - a.date;
    });
};

// Sort by date (asc)
const sortByDateOld = (array) => {
    array.sort((a, b) => {
        return a.date - b.date;
    });
};

// Sort by controversial (desc)
const sortByControversial = (array) => {
    array.forEach((comment) => {
        let totalReplies = comment.replies.length;

        if (comment.replies > 0) {
            const loopReplies = (branch) => {
                branch.forEach((reply) => {
                    totalReplies++;

                    // If current comment has replies, recursively loop through each reply
                    if (reply.replies.length > 0) {
                        loopReplies(reply.replies);
                    }
                });
            };

            loopReplies(comment.replies);
        }

        // Temporarily add totalReplies property to comment
        comment.totalReplies = totalReplies;
    });

    // Sort by totalReplies
    array.sort((a, b) => {
        return b.totalReplies - a.totalReplies;
    });

    // Delete totalReplies property from comments
    array.forEach((comment) => {
        delete comment.totalReplies;
    });
};

export {
    sortByHot,
    sortByBest,
    sortByTop,
    sortByDateNew,
    sortByDateOld,
    sortByControversial
};