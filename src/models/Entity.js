import t from "../utils/translate/translate";
import Backend from '../backend/Backend';
import {Item,List} from '../containers/Containers';

/**
 * Base class for database models, used in application
 */
class Entity {

    constructor() {
        this.itemName = "entity";
        this.collectionName = "entities";
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
        if (!options) {
            callback(null,{'errors':{'general': t("Системная ошибка")}});
            return;
        }
        let method = 'POST';
        let url = '/'+this.itemName;
        if (options['uid']) {
            method = 'PUT';
            url += "/"+options['uid'].toString().replace(/#/g,"").replace(/:/g,"_");
            delete options['uid'];
        }
        Backend.request(url,options,method,null,null, function(error, response) {
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

    /**
     * Method returns instance of DetailView container for this model based on model name
     */
    getItemView() {
        return Item.getInstanceOf(this.itemName);
    }

    /**
     * Method returns instance of List View container for this model based on model name
     */
    getListView() {
        return List.getInstanceOf(this.itemName);
    }
}

export default Entity;