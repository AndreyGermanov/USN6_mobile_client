import EntityItemContainer from './Entity';
import moment from 'moment-timezone';

/**
 * Controller class for Document detail view containers. All document detail views extends from this class.
 */
class DocumentItemContainer extends EntityItemContainer {

    /********************************************************
     * Functions used to convert field value from a form    *
     * which it has in input to the form which accepted by  *
     * application state                                    *
     ********************************************************/
    parseItemField_date(e) {
        if (typeof(moment(e).unix) === "function") {
            return moment(e).unix()
        }
        return 0;
    }
}

export default DocumentItemContainer;