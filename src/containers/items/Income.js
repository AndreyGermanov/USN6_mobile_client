import {connect} from "react-redux";
import {Item} from '../../components/Components';
import DocumentItemContainer from './Document'
import t from '../../utils/translate/translate'
import actions from "../../actions/Actions";
import Store from "../../store/Store";
import Models from '../../models/Models';

/**
 * Controller class for Income Item component. Contains all methods and properties, which used by this module.
 */
export default class IncomeItemContainer extends DocumentItemContainer {

    /**
     * Class constructor
     */
    constructor() {
        super();
        this.model = Models.getInstanceOf("income");
    }

    /**
     * Method defines set of properties, which are available inside controlled component inside "this.props"
     * @param state: Link to application state
     * @returns Array of properties
     */
    mapStateToProps(state) {
        return Object.assign(super.mapStateToProps(state), {
            "companies_list": state["companies_list"] ? state["companies_list"] : []
        })
    }

    /**
     * Method called after standard "updateItem" action
     */
    updateItem(uid,callback) {
        const self = this;
        super.updateItem(uid, function() {
            self.getCompaniesList((companies_list) => {
                Store.store.dispatch(actions.changeProperty('companies_list', companies_list));
            });
        })
    }

    static getComponent() {
        const income = new IncomeItemContainer();
        return connect(income.mapStateToProps.bind(income),income.mapDispatchToProps.bind(income))(Item.Income);
    }
}


