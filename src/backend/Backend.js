import async from 'async';
import config from '../config/backend';
import base64 from 'base-64';
import actions from '../actions/Actions';
import Store from '../store/Store';
import Cookie from '../utils/Cookie';
import t from '../utils/translate/translate';

/**
 * Class contains base methods to communicate with Backend database
 */
class Backend {

    /**
     * Method used to generate "Basic" authentication token from login and password,
     * used to pass to the 'Authorization' header in each request to server
     * @param login
     * @param password
     * @param callback Function called after operation finished. Contains token or nothing
     * @returns {*}
     */
    getAuthToken(login,password,callback) {
        if (login && password) {
             callback(base64.encode(login + ":" + password));
        } else {
            Cookie.get("token", function(cookieValue) {
                callback(cookieValue)
            });
        }
    }

    /**
     * Low level method to send HTTP request to backend. All backend methods use it to make requests
     * to server
     * @param url:  Request URL (without "host" and "port", because it defined in /config/backend.js file)
     * @param params: params to query. if Request method is POST, then it post params, if GET then query string params
     * @param method: Request method (GET, POST, PUT, DELETE or others)
     * @param headers: Hahsmap of HTTP headers to send to server
     * @param token: Authentication token, to authenticate request. If user login to server, it automatically passed
     *               from "token" cookie
     * @param callback: Callback method which called after request returns result. Contains "err" and "response"
     *                  parameters. Err if error and response if success, contains response object
     */
    request(url,params={},method="GET",headers={},token=null,callback) {
        const self = this;
        async.series([
            function(callback) {
                if (!token) {
                    self.getAuthToken(null, null, function(value) {
                        token = value;
                        callback();
                    });
                } else {
                    callback();
                }
            }
        ], function() {
            if (!headers) {
                headers = {};
            }
            if (token) {
                headers["Authorization"] = 'Basic '+token;
            }
            const fetchOptions = {
                method: method,
                headers: headers
            };
            if (method === 'POST' || method === 'PUT') {
                fetchOptions['body'] = JSON.stringify(params)
            } else if (method === 'GET') {
                var query_params = [];
                for (const name in params) {
                    if (typeof(params[name])!=="function" && typeof(params[name])!=="object") {
                        query_params.push(name + "=" + params[name])
                    }
                }
                if (query_params.length) url += '/?'+query_params.join('&');
            }
            if (url.search("http://")===-1) {
                url = "http://"+config.host+":"+config.port+"/api"+url;
            }
            fetch(url,fetchOptions).then(function(response) {
                if (!response || response.status === 401) {
                    Store.store.dispatch(actions.changeProperty('isLogin',false));
                    Cookie.delete('token');
                    if (callback) {
                        callback('UNAUTHORIZED', false)
                    }
                } else {
                    if (callback) {
                        callback(null, response);
                    }
                }
            }).catch(function(except) {
                if (callback) {
                    Store.store.dispatch(actions.changeProperty('isLogin',false));
                    Cookie.delete('token');
                    callback(except)
                }
            });
        })
    }

    /**
     * Method used to login to backend server. Sends "Authorization" header to server with provided login and password
     * and in case of successful response (STATUS=200 OK), stores authentication token to "token" cookie, which then
     * used as authentication token in all next requests
     * @param login: User login
     * @param password: User password
     * @param callback: Callback function than called after receive response from server. Contains "err" and "response"
     *                  parameters. Err if error and response if success, contains response object
     */
    login(login,password,callback) {
        Store.store.dispatch(actions.changeProperty('authenticating',true));
        const self = this;
        this.getAuthToken(login,password, function(token) {
            self.request('/',{},'GET',{},token, function(err,response) {
                Store.store.dispatch(actions.changeProperty('authenticating',false));
                if (!err) {
                    Store.store.dispatch(actions.changeProperties({'isLogin':true,item:{}}));
                    Cookie.set('token',token);
                    if (callback) {
                        callback(null, response);
                    }
                } else {
                    if (callback) {
                        callback(err);
                    }
                }
            })
        });
    }

    logout(callback= ()=>null) {
        Cookie.delete('token', () => {
            Store.store.dispatch(actions.changeProperty('isLogin',false));
            if (callback) {
                callback();
            }
        })
    }

    /**
     * Method returns number of items in collection
     * @param modelName: Collection name
     * @param options: params to query. if Request method is POST, then it post params, if GET then query string params
     * @param callback: Method which called after request. Contains "err" and "result" variables. Err can contain
     * error, result contains number of items in collection
     */
    getCount(modelName,options,callback = ()=>null) {
        this.request('/'+modelName+'/count',options,'GET',null,null, function(error,response) {
            if (error) {
                callback(error);
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
     * @param modelName: Name of model
     * @param options: Options to filter, limit, skip and sort order
     * @param callback: Function called after operation finishes
     */
    getList(modelName,options,callback) {
        if (typeof(callback)!=='function') callback = ()=>null;
        this.request('/'+modelName,options,'GET',null,null, function(error,response) {
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
     * @param modelName: Name of model
     * @param itemID: ID of item to fetch
     * @param options: various options which affect result
     * @param callback: Callback function called after execution
     */
    getItem(modelName,itemID,options,callback) {
        if (typeof(callback)!=='function') callback = ()=>null;
        if (!itemID) {
            callback(null,[]);
            return;
        }
        this.request('/'+modelName+'/'+itemID,options,'GET',null,null, function(error,response) {
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
     * @param modelName: Name of model
     * @param options: Array of field values of item
     * @param callback: Callback function which called after execution completed. It can contain either "errors"
     * object with validation errors for each field, or "result" object with all saved fields (including "uid") of item.
     */
    saveItem(modelName,options,callback) {
        if (typeof(callback)!=='function') callback = ()=>null;
        if (!options) {
            callback(null,{'errors':{'general': t("Системная ошибка")}});
            return;
        }
        var method = 'POST';
        var url = '/'+modelName;
        if (options['uid']) {
            method = 'PUT';
            url += "/"+options['uid'].toString().replace(/#/g,"").replace(/:/g,"_");
            delete options['uid'];
        }
        this.request(url,options,method,null,null, function(error, response) {
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
     * @param modelName: Name of model
     * @param idList: Array of item UIDs to delete
     * @param callback: Callback function which called after execution completed
     */
    deleteItems(modelName,idList,callback) {
        const itemList = idList.map(function(item) {
            return item.replace(/#/g,'').replace(/:/g,'_');
        });
        if (!itemList || !itemList.length) return;
        this.request("/"+modelName+"/"+itemList.join(","),{},'DELETE',null,null, function(err,response) {
            if (!response || response.status !== 200) {
                callback(null,{'errors':{'general': t("Системная ошибка")}});
                return;
            }
            response.json().then(function(jsonObject) {
                callback(null,jsonObject);
            })
        });
    }
}

export default new Backend();