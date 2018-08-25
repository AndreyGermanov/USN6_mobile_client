import {connect} from "react-redux";
import {Item} from '../../components/Components';
import EntityItemContainer from './Entity';
import t from '../../utils/translate/translate';
import Store from '../../store/Store';
import actions from '../../actions/Actions';
import Models from '../../models/Models';

/**
 * Controller class for Account Item component. Contains all methods and properties, which used by this module.
 */
export default class AccountItemContainer extends EntityItemContainer {

    /**
     * Class constructor
     */

    constructor() {
        super();
        this.model = Models.getInstanceOf("account");
    }

    /**
     * Method defines set of properties, which are available inside controlled component inside "this.props"
     * @param state: Link to application state
     * @returns Array of properties
     */
    mapStateToProps(state) {
        return Object.assign(super.mapStateToProps(state),{
            "companies_list": state.companies_list ? state.companies_list : []
        })
    }

    /**
     * Method called after standard "updateItem" action
     */
    updateItem(uid) {
        const self = this;
        super.updateItem(uid, function() {
            self.getCompaniesList((companies_list) => {
                Store.store.dispatch(actions.changeProperty('companies_list', companies_list));
            });
        })
    }

    static getComponent() {
       const account = new AccountItemContainer();
       return connect(account.mapStateToProps.bind(account),account.mapDispatchToProps.bind(account))(Item.Account);
    }
}