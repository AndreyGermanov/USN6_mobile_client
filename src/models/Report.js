import Document from './Document';
import Backend from "../backend/Backend";
import backendConfig from "../config/backend";
import {Select} from "../components/ui/Form";
import t from "../utils/translate/translate";
import moment from "moment-timezone";
import Store from '../store/Store';

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
     * Method used to initialize item, by populating all empty or undefined fields with default values
     * @param item: Input item
     * @returns item with populated values
     */
    initItem(item) {
        item = super.initItem(item);
        if (!item.company) item.company = '';
        if (!item.date) item.date = moment().unix();
        if (!item.period) item.period = moment().unix();
        if (!item.type) item.type = 'kudir';
        if (!item.email) item.email = "";
        return item;
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

    /**********************************
     * Item fields validation methods *
     **********************************/

    validate_company(value) {
        if (!this.cleanStringField(value)) return t("Организация не указана");
        return "";
    }

    validate_date(value) {
        if (!this.cleanStringField(value)) return t("Не указана дата отчета");
        if (this.cleanIntField(value)===null) return t("Указана некорректная дата отчета");
        return "";
    }

    validate_period(value) {
        if (!this.cleanStringField(value)) return t("Не указан период отчета");
        if (this.cleanIntField(value)===null) return t("Указан некорректный период отчета");
        return "";
    }

    validate_type(value) {
        if (!this.cleanStringField(value)) return t("Не указан тип отчета");
        if (!Select.getItemByValue(value,Store.getState().report_types)) return t("Указан некорректный тип отчета");
        return "";
    }

    validate_email(value) {
        value = value.toString().trim();
        if (!value) return "";
        if (this.cleanEmailField(value)===null) return t("Указан некорректный адрес email");
        return "";
    }

    /***************************************************
     * Item field values cleanup and transform methods *
     * used to prepare fields to be pushed to database *
     ***************************************************/

    cleanField_company(value) {
        return this.cleanStringField(value);
    }


    cleanField_date(value) {
        return this.cleanIntField(value);
    }

    cleanField_period(value) {
        return this.cleanIntField(value);
    }

    cleanField_type(value) {
        if (this.validate_type(value)) return null;
        return this.cleanStringField(value);
    }

    cleanField_email(value) {
        if (!value.toString().trim()) return "";
        if (this.validate_email(value)) return null;
        return this.cleanEmailField(value);
    }

    /**
     * Methods used to render presentations of field values
     * in list view
     * @param value: Source value
     * @returns formatted value
     */
    getStringOfField_period(value) {
        if (this.cleanIntField(value)) {
            return moment(value*1000).format("YYYY "+t("г."));
        } else {
            return 0;
        }
    }

    getStringOfField_type(value) {
        const report_type = Select.getItemByValue(value,Store.getState().report_types);
        if (report_type) return report_type.label;
        return "";
    }
}

export default Report;