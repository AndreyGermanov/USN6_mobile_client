import Document from './Document';
import Backend from "../backend/Backend";
import backendConfig from "../config/backend";

/**
 * Database model of Report entity
 */
class Report extends Document {
    constructor() {
        super();
        this.itemName = "report";
        this.collectionName = "reports";
    }

    /**
     * Method used to get list of report types for "Report type" dropdown of Report detail view
     * @param callback: This method called when response from server received. Two parameters passed to it:
     * "err" - error string or null, report_types_array - array of fetched results or empty array or null.
     */
    getTypes(callback) {
        if (!callback)
            callback = () => null;
        Backend.request("/report/types",{},"GET",{},null, function(err,response) {
            if (err) {
                callback(err, {});
                return;
            }
            if (!response) {
                callback(null,{});
                return;
            }
            response.json().then(function(report_types) {
                const report_types_array = [];
                for (let key in report_types) {
                    if (!report_types.hasOwnProperty(key))
                        continue;
                    report_types_array.push({value:key,label:report_types[key]});
                }
                callback(null,report_types_array);
            });
        })
    }

    /**
     * Method used to send provided report by email
     * @param item: Report item with data. Required fields: company,type,period,email
     * @param callback: Function called after operation finished with "err" and "response" parameters
     */
    sendByEmail(item,callback) {
        if (!callback)
            callback = () => null;
        let url = "http://"+backendConfig.host+":"+backendConfig.port+
            "/report/generate/"+item["company"].replace(/#/,"").replace(/:/g,"_")+"/"+
            item["type"]+"/"+item["period"]+"/email";
        Backend.getAuthToken(null,null, function(token) {
            if (token) url += '?token='+token;
            url += "&email="+item["email"].trim();
            Backend.request(url,{},'GET',{},null, function(err,response) {
                callback(err,response);
            })
        });
    }
}

export default Report;