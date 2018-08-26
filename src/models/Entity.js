import t from "../utils/translate/translate";
import Backend from '../backend/Backend';

/**
 * Base class for database models, used in application
 */
class Entity {

    constructor() {
        this.itemName = "entity";
        this.collectionName = "entities";
    }

    /**
     * Method used to initialize item, by populating all empty or undefined fields with default values
     * @param item: Input item
     * @returns item with populated values
     */
    initItem(item) {
        if (!item || typeof(item)!="object") item = {};
        return item;
    }

    /**
     * Method returns number of items in collection
     * @param options: params to query.
     * @param callback: Method which called after request. Contains "err" and "result" variables. Err can contain
     * error, result contains number of items in collection
     */
    getCount(options,callback) {
        if (typeof(callback)!=='function')
            callback = ()=>null;
        Backend.request('/'+this.itemName+'/count',options,'GET',null,null, function(error,response) {
            if (error) {
                callback(error,0);
                return;
            }
            if (!response || response.status !== 200) {
                callback(null,0);
                return;
            }
            response.text().then(function(text) {
                if (!isNaN(text)) {
                    callback(null,parseInt(text,10));
                } else {
                    callback(null,0);
                }
            }).catch(function() {
                callback(null, 0);
            })
        })
    }

    /**
     * Method used to fetch list of items from models collection
     * @param options: Options to filter, limit, skip and sort order
     * @param callback: Function called after operation finishes
     */
    getList(options,callback) {
        if (typeof(callback)!=='function')
            callback = ()=>null;
        Backend.request('/'+this.itemName,options,'GET',null,null, function(error,response) {
            if (error) {
                callback(error);
                return;
            }
            if (!response || response.status !== 200) {
                callback(null,[]);
                return;
            }
            response.json().then(function (list) {
                callback(null,list);
            }).catch(function(error) {
                callback(error,[]);
            });
        })
    }

    /**
     * Method used to fetch signle item from backend
     * @param itemID: ID of item to fetch
     * @param options: various options which affect result
     * @param callback: Callback function called after execution
     */
    getItem(itemID,options,callback) {
        if (typeof(callback)!=='function')
            callback = ()=>null;
        if (!itemID) {
            callback(null,[]);
            return;
        }
        Backend.request('/'+this.itemName+'/'+itemID,options,'GET',null,null, function(error,response) {
            if (error) {
                callback(error);
                return;
            }
            if (!response || response.status !== 200) {
                callback(null,{});
                return;
            }
            response.json().then(function(jsonObject) {
                callback(null,jsonObject)
            }).catch(function() {
                callback(null,{});
            })
        })
    }

    /**
     * Method used to save item to database. It can either add new item (POST) or update existing (PUT)
     * @param options: Array of field values of item
     * @param callback: Callback function which called after execution completed. It can contain either "errors"
     * object with validation errors for each field, or "result" object with all saved fields (including "uid") of item.
     */
    saveItem(options,callback) {
        if (typeof(callback)!=='function') callback = ()=>null;
        const data = this.cleanDataForBackend(options);
        if (!data) {
            callback(null,{'errors':{'general': t("Системная ошибка")}});
            return;
        }
        let method = 'POST';
        let url = '/'+this.itemName;
        if (data['uid']) {
            method = 'PUT';
            url += "/"+options['uid'].toString().replace(/#/g,"").replace(/:/g,"_");
            delete data['uid'];
        }
        Backend.request(url,data,method,null,null, function(error, response) {
            if (!response || response.status !== 200 || error) {
                callback(null,{'errors':{'general': t("Системная ошибка")}});
                return;
            }
            response.json().then(function(obj) {
                callback(null,obj);
            });
        });
    }

    /**
     * Method used to clean and prepare item data before sending to backend
     * @returns Object(hashmap) with data,ready to send to backend for this model
     */
    cleanDataForBackend(item) {
        const result = {};
        if (item.uid && item.uid !== "new") {
            result["uid"] = item.uid;
        }
        for (let field_name in item) {
            if (!item.hasOwnProperty(field_name) || field_name === "uid")
                continue;
            if (typeof(this["cleanField_"+field_name])==="function") {
                const value = this["cleanField_"+field_name](item[field_name]);
                if (value !== null) result[field_name] = value;
            } else if (typeof(item[field_name]) === 'string') {
                result[field_name] = item[field_name].trim();
            } else {
                result[field_name] = item[field_name];
            }
        }
        return result;
    }

    /**
     * Function used to validate item before save to database
     * @returns Array of found errors or null if nothing found
     */
    validate(item) {
        const errors = {};
        let has_errors = false;
        for (const field_name in item) {
            if (!item.hasOwnProperty(field_name) || field_name === 'uid')
                continue;
            const error = this.validateItemField(field_name,item[field_name]);
            if (error) {
                has_errors = true;
                errors[field_name] = error;
            }
        }
        return has_errors ? errors : null;
    }

    /**
     * Method used to validate specified field
     * @param field_name: Name of field to validate
     * @param field_value: Value to validate
     * @returns {string}: Either string with error message or empty string if no error
     */
    validateItemField(field_name,field_value) {
        if (!field_value || typeof(field_value) === "undefined") {
            field_value = "";
        }
        if (typeof(this["validate_"+field_name])==="function") {
            return this["validate_"+field_name](field_value);
        }
        return "";
    }

    /**
     * Method used to delete items from database.
     * @param idList: Array of item UIDs to delete
     * @param callback: Callback function which called after execution completed
     */
    deleteItems(idList,callback) {
        const itemList = idList.map(function(item) {
            return item.replace(/#/g,'').replace(/:/g,'_');
        });
        if (!itemList || !itemList.length) return;
        Backend.request("/"+this.itemName+"/"+itemList.join(","),{},'DELETE',null,null, function(err,response) {
            if (!response || response.status !== 200) {
                callback(null,{'errors':{'general': t("Системная ошибка")}});
                return;
            }
            response.json().then(function(jsonObject) {
                callback(null,jsonObject);
            })
        });
    }

    /************************************************************
     * Generic functions used to clean values of various types, *
     * before pushing to database                               *
     ************************************************************/

    cleanStringField(value) {
        return value.toString().trim()
    }

    cleanIntField(value) {
        const result = parseInt(value);
        if (!isNaN(result) && value == result) return result;
        return null;
    }

    cleanDecimalField(value) {
        const result = parseFloat(value);
        if (!isNaN(result) && value == result) return result;
        return null;
    }

    cleanEmailField(value) {
        value = value.toString().trim().toLowerCase();
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(value)) return null;
        return value;
    }

    /**
     * Method returns instance of DetailView container for this model based on model name
     */
    getItemView() {
        return require('../containers/Containers').Item.getInstanceOf(this.itemName);
    }

    /**
     * Method returns instance of List View container for this model based on model name
     */
    getListView() {
        return require('../containers/Containers').List.getInstanceOf(this.itemName);
    }
}

export default Entity;