import async from 'async';
import config from '../config/backend';
import base64 from 'base-64';
import actions from '../actions/Actions';
import Store from '../store/Store';
import Cookie from '../utils/Cookie';

/**
 * Class contains base methods to communicate with Backend database
 */
class Backend {

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
        if (!callback) callback = () => null;
        Store.store.dispatch(actions.changeProperty('authenticating',true));
        const self = this;
        this.getAuthToken(login,password, function(token) {
            self.request('/',{},'GET',{},token, function(err,response) {
                Store.store.dispatch(actions.changeProperty('authenticating',false));
                if (err) {
                    callback(err);
                    return;
                }
                Store.store.dispatch(actions.changeProperties({'isLogin':true,item:{}}));
                Cookie.set('token',token);
                callback(null, response);
            })
        });
    }

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
            return;
        }
        Cookie.get("token", function(cookieValue) {
            callback(cookieValue)
        });
    }

    /**
     * Method used to log out user from the system and clear authentication token
     * @param callback: Method runs when operation finished
     */
    logout(callback= ()=>null) {
        Cookie.delete('token', () => {
            Store.store.dispatch(actions.changeProperty('isLogin',false));
            callback();
        })
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
        if (!callback) callback = () => null;
        async.series([
            function(callback) {
                if (token) {
                    callback();
                    return
                }
                self.getAuthToken(null, null, function(value) {
                    token = value;
                    callback();
                });
            }
        ], function() {
            const request = self.prepareRequest(url,params,method,headers,token);
            fetch(request.url,request.options).then(function(response) {
                if (!response || response.status === 401) {
                    self.processErrorResponse("UNAUTHORIZED",callback);
                    return;
                }
                callback(null, response);
            }).catch(function(except) {
                self.processErrorResponse(except,callback)
            });
        })
    }

    /**
     * Method used to prepare request to backend from input data
     * @param url - Input URL
     * @param params - Input params
     * @param method - request Method
     * @param headers - request headers
     * @param token - Auth token
     * @returns {{url: *, options: {}}} Array with two items: url - request URL, options - request options
     */
    prepareRequest(url,params,method,headers,token) {
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
            let query_params = [];
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
        return {url:url,options:fetchOptions}
    }

    /**
     * Method used to process error response from callback
     * @param error - String with error description
     * @param callback - Callback which called after function returns. Callback will return text of error in first
     * parameter
     */
    processErrorResponse(error,callback) {
        if (!callback) callback = () => null;
        Store.store.dispatch(actions.changeProperty('isLogin',false));
        Cookie.delete('token');
        callback(error,null);
    }

}

export default new Backend();