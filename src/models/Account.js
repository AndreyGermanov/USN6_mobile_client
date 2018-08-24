import Entity from './Entity';

/**
 * Database model of Account entity
 */
class Account extends Entity {
    constructor() {
        super();
        this.itemName = "account";
        this.collectionName = "accounts";
    }
}

export default Account;