import Cookies from "js-cookie";

/**
 * Checks if the user is logged in
 * @return {boolean}
 */
export function isLoggedIn() {
    return (Cookies.get('authToken') !== undefined);
}

/**
 * Checks if the user trying to access the user profile is the user who the profile belongs to
 * @param profileId
 * @return {boolean}, true is it is, else false
 */
export function isUserOfUserProfile(profileId) {
    return (Cookies.get('userId') === profileId);
}