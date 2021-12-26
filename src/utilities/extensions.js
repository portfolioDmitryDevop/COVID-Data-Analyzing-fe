// Set time to 00:00 on the specified Date
export function removeTime(date) {
    var dateWithoutTime = new Date(date);
    dateWithoutTime.setHours(0, 0, 0, 0);
    return dateWithoutTime;
}

// Convert Date-object to String with format YYYY-MM-DD
export function convertDate(dateStr) {
    let date = new Date(dateStr);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

// Getting the previous day from specified Date
export function getPreviousDay(selectedDay) {
    if (selectedDay instanceof Date) {
        return dateMinusOne(selectedDay);
    } else {
        const date = new Date(selectedDay);
        return dateMinusOne(date);
    }
}

function dateMinusOne(date) {
    var previous = new Date();
    previous.setDate(date.getDate() - 1);
    return previous;
}

export function objToExponential(obj) {
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] == 'number'){
            let oldVal = obj[key];
            obj[key] = oldVal.toExponential(2);
        }
    });
    return obj;
}