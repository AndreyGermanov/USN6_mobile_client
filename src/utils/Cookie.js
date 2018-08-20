import { AsyncStorage } from "react-native"

/**
 * Utility class to work with AsyncStorage
 */
class Cookie {
    /**
     * Method returns value of cookie
     * @param cookieName: Name of cookie
     * @param callback: Function called after at the end of execution. Returns either value or error
     */
    get(cookieName,callback) {
        AsyncStorage.getItem(cookieName).then((cookieValue) => {
            if (typeof(callback) === "function") callback(cookieValue);
        }, (error) => {
            if (typeof(callback) === "function") callback(error);
        });
    }

    /**
     * Method to set cookie
     * @param cookieName: Name of cookie
     * @param cookieValue: Value of cookie
     * @param callback: Function called after at the end of execution. Returns either error or nothing
     */
    set(cookieName,cookieValue,callback) {
        AsyncStorage.setItem(cookieName,cookieValue,(error) => {
            if (typeof(callback) === "function") callback(error);
        });
    }

    /**
     * Method to delete cookie
     * @param cookieName: Name of cookie
     * @param callback: Function called after at the end of execution. Returns either error or nothing
     */
    delete(cookieName,callback) {
        AsyncStorage.removeItem(cookieName,(err) => {
            if (typeof(callback) === "function") callback(err);
        });
    }

}

export default new Cookie();