import Document from './Document';
import Backend from '../backend/Backend';
import t from "../utils/translate/translate";

/**
 * Database model of Spending entity
 */
class Spending extends Document {
    constructor() {
        super();
        this.itemName = "spending";
        this.collectionName = "spendings";
    }

    /**
     * Method used to get content for "Spending types" dropdown from database
     * @param callback: This method called when response from server received. Two parameters passed to it:
     * "err" - error string or null, spending_types_array - array of fetched results or empty array or null.
     */
    getTypes(callback) {
        if (!callback)
            callback = () => null;
        Backend.request("/spending/types",{},"GET",{},null, function(err,response) {
            if (err) {
                callback(err, {});
                return;
            }
            if (!response) {
                callback(null,{});
                return;
            }
            response.json().then(function(spending_types) {
                const spending_types_array = [];
                for (let key in spending_types) {
                    if (!spending_types.hasOwnProperty(key))
                        continue;
                    spending_types_array.push({value:parseInt(key),label:spending_types[key]});
                }
                callback(null,spending_types_array);
            });
        })
    }

    /**********************************
     * Item fields validation methods *
     **********************************/

    validate_description(value) {
        if (!this.cleanStringField(value)) return t("Описание операции не указано");
        return "";
    }

    validate_company(value) {
        if (!this.cleanStringField(value)) return t("Организация не указана");
        return "";
    }

    validate_number(value) {
        if (!this.cleanStringField(value)) return t("Номер документа не указан");
        if (this.cleanIntField(value)===null) return t("Указан некорректный номер документа");
        return "";
    }

    validate_amount(value) {
        if (!this.cleanStringField(value)) return t("Сумма не указана");
        if (this.cleanDecimalField(value)===null) return t("Указана некорректная сумма");
        return "";
    }

    validate_date(value) {
        if (!this.cleanStringField(value)) return t("Не указана дата документа");
        if (this.cleanIntField(value)===null) return t("Указана некорректная дата документа");
        return "";
    }

    validate_type(value) {
        if (!this.cleanStringField(value)) return t("Не указан тип расходов");
        const decValue = this.cleanDecimalField(value);
        if (decValue===null || decValue < 1 | decValue > 7 ) return t("Указан некорректный тип расходов");
        return "";
    }

    validate_period(value) {
        if (!this.cleanStringField(value)) return t("Период расходов не указан");
        return "";
    }

    /***************************************************
     * Item field values cleanup and transform methods *
     * used to prepare fields to be pushed to database *
     ***************************************************/

    cleanField_description(value) {
        return this.cleanStringField(value);
    }

    cleanField_company(value) {
        return this.cleanStringField(value);
    }


    cleanField_number(value) {
        return this.cleanDecimalField(value);
    }

    cleanField_amount(value) {
        return this.cleanDecimalField(value);
    }

    cleanField_date(value) {
        return this.cleanIntField(value);
    }

    cleanField_type(value) {
        return this.cleanIntField(value);
    }

    cleanField_period(value) {
        return this.cleanStringField(value);
    }
}

export default Spending;