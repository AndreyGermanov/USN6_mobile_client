import Document from './Document';

/**
 * Database model of Income entity
 */
class Income extends Document {
    constructor() {
        super();
        this.itemName = "income";
        this.collectionName = "incomes";
    }
}

export default Income;