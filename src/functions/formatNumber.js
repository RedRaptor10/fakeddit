const formatNumber = num => {
    if (Math.abs(num) >= 1000 && Math.abs(num) < 1000000) {
        num = (num / 1000).toFixed(1) + 'k';
    }
    if (Math.abs(num) >= 1000000 && Math.abs(num) < 1000000000) {
        num = (num / 1000000).toFixed(1) + 'm';
    }
    if (Math.abs(num) >= 1000000000) {
        num = (num / 1000000000).toFixed(1) + 'b';
    }

    return num;
};

export default formatNumber;