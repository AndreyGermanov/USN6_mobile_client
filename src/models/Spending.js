import Document from './Document';
import Backend from '../backend/Backend';

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
}

export default Spending;