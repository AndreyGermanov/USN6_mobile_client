import async from 'async';
import {connect} from "react-redux";
import {Item} from '../../components/Components'
import DocumentItemContainer from './Document'
import actions from "../../actions/Actions";
import Store from "../../store/Store";
import Models from '../../models/Models';

/**
 * Controller class for Spending Item component. Contains all methods and properties, which used by this module.
 */
export default class SpendingItemContainer extends DocumentItemContainer {

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
        return Object.assign(super.mapStateToProps(state), {
            "companies_list": state["companies_list"] ? state["companies_list"] : [],
            "spending_types": state["spending_types"] ? state["spending_types"] : []
        })
    }

    /**
     * Method called after standard "updateItem" action
     */
    updateItem(uid,callback) {
        const self = this;
        if (!callback) callback=()=>null;
        async.waterfall([
            (callback) => super.updateItem(uid,callback),
            (callback) => self.getCompaniesList((companies) => callback(null,companies)),
            (companies,callback) => self.model.getTypes((error,types) => callback(null,companies,types)),
            (companies,types,callback) => {
                Store.store.dispatch(actions.changeProperties({
                    'companies_list': companies,
                    'spending_types': types
                }));
            }
        ], () => callback())
    }

    static getComponent() {
        const spending = new SpendingItemContainer();
        return connect(spending.mapStateToProps.bind(spending),spending.mapDispatchToProps.bind(spending))(Item.Spending);
    }
}