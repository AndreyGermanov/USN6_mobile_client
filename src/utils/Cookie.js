import { AsyncStorage } from "react-native"

/**
 * Utility class to work with AsyncStorage
 */
class Cookie {
    /**
     * Method returns value of cookie
     * @param name: Name of cookie
     * @param callback: Function called after at the end of execution. Returns either value or error
     */
    get(name,callback) {
        AsyncStorage.getItem(name).then((value) => {
            if (typeof(callback) === "function") callback(value);
        }, (err) => {
            if (typeof(callback) === "function") callback(err);
        });
    }

    /**
     * Method to set cookie
     * @param name: Name of cookie
     * @param value: Value of cookie
     * @param callback: Function called after at the end of execution. Returns either error or nothing
     */
    set(name,value,callback) {
        AsyncStorage.setItem(name,value,(err) => {
            if (typeof(callback) === "function") callback(err);
        });
    }

    /**
     * Method to delete cookie
     * @param name: Name of cookie
     * @param callback: Function called after at the end of execution. Returns either error or nothing
     */
    delete(name,callback) {
        AsyncStorage.removeItem(name,(err) => {
            if (typeof(callback) === "function") callback(err);
        });
    }

}

export default new Cookie();