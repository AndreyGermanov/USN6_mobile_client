import {connect} from "react-redux";
import {List} from '../../components/Components'
import DocumentListContainer from './Document'
import t from '../../utils/translate/translate'
import Models from '../../models/Models';

/**
 * Controller class for Spending List component. Contains all methods and properties, which used by this module.
 */
export default class SpendingListContainer extends DocumentListContainer {

    /**
     * Class constructor
     */
    constructor() {
        super();
        this.model = Models.getInstanceOf("spending");
    }

    /**
     * Method defines set of properties, which are available inside controlled component inside "this.props"
     * @param state: Link to application state
     * @returns Array of properties
     */
    mapStateToProps(state) {
        const result = super.mapStateToProps(state);
        return Object.assign(result, {
            "listColumns": this.getListColumns(["number","date","description","period","amount","company"]),
            "sortOrder": (result["sortOrder"] && result["sortOrder"].field) ?
                result["sortOrder"] : {field:'date',direction:'ASC'}
        })
    }

    static getComponent() {
        const spending = new SpendingListContainer();
        return connect(spending.mapStateToProps.bind(spending),spending.mapDispatchToProps.bind(spending))(List.Spending);
    }

}
