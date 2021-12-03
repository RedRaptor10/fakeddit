const formatNumber = num => {
    if (num >= 1000 && num < 1000000) {
        num = (num / 1000).toFixed(1) + 'k';
    }
    if (num >= 1000000 && num < 1000000000) {
        num = (num / 1000000).toFixed(1) + 'm';
    }
    if (num >= 1000000000) {
        num = (num / 1000000000).toFixed(1) + 'b';
    }

    return num;
};

export default formatNumber;