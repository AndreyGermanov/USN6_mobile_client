import Entity from './Entity';
import moment from "moment-timezone";

/**
 * Base database model for documents
 */
class Document extends Entity {
    constructor() {
        super();
        this.itemName = "document";
        this.collectionName = "documents";
    }

    /********************************************************
     * Functions used to convert field value from a form    *
     * which it has in input to the form which accepted by  *
     * application state                                    *
     ********************************************************/
    parseItemField_date(date) {
        if (isNaN(parseFloat(date))) {
            return 0;
        }
        if (typeof(moment(date).unix) === "function") {
            return moment(date).unix()
        }
        return 0;
    }

    /**
     * Methods used to render presentations of field values
     * in list view
     * @param value: Source value
     * @returns formatted value
     */
    getStringOfField_date(value) {
        if (this.cleanIntField(value)) {
            return moment(value*1000).format("DD.MM.YYYY HH:mm:ss");
        } else {
            return 0;
        }
    }

    getStringOfField_amount(value) {
        const result = this.cleanDecimalField(value)
        if (result!==null) {
            return result.toFixed(2);
        }
        return 0;
    }
}

export default Document;