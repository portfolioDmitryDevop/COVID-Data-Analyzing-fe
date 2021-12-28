// Set time to 00:00 on the specified Date
export function removeTime(date) {
    var dateWithoutTime = new Date(date);
    dateWithoutTime.setHours(0, 0, 0, 0);
    return dateWithoutTime;
}

// Convert Date to String with format YYYY-MM-DD
export function convertDate(date) {
    const fixedMonth = date.getMonth() + 1;
    const month = fixedMonth < 10 ? `0${fixedMonth}` : fixedMonth; 
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    return `${date.getFullYear()}-${month}-${day}`;
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
    return removeTime(previous);
}

export function convertToHumanReadbleNumber(obj) { 
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] == 'number'){
            obj[key] = obj[key].toLocaleString("en");
        }
    });
    return obj;
}