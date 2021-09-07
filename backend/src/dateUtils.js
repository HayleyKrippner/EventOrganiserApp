import {format, parseISO} from "date-fns";

/**
 * Converts a string that is a date in the ISO format to a format of e.g. "17th May 2021 8:30 PM".
 * @param dateString
 * @param dateAndTime
 * @return {string|null}
 */
export function formatDate(dateString) {
    console.log(dateString)

    return format(parseISO(dateString), "do MMM yyyy")
}
/**
 * Converts a string that is a date in the ISO format to a format of e.g. "8:30 PM".
 * @param dateString
 * @param dateAndTime
 * @return {string|null}
 */
export function formatTime(dateString) {
    return format(parseISO(dateString), "h:mm aaa")
}