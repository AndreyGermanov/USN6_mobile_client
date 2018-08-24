import Entity from './Entity';

/**
 * Base database model for documents
 */
class Document extends Entity {
    constructor() {
        super();
        this.itemName = "document";
        this.collectionName = "documents";
    }
}

export default Document;