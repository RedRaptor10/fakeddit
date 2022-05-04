// Convert seconds to string showing date
const secondsToDate = seconds => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const date = new Date(seconds * 1000);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    return months[month] + ' ' + day + ', ' + year;
};

export default secondsToDate;