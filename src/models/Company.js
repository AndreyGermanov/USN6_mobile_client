import Entity from './Entity';

/**
 * Database model of Company entity
 */
class Company extends Entity {
    constructor() {
        super();
        this.itemName = "company";
        this.collectionName = "companies";
    }
}

export default Company;