import {connect} from "react-redux";
import {List} from '../../components/Components';
import EntityListContainer from './Entity';
import t from '../../utils/translate/translate';
import Models from "../../models/Models";

/**
 * Controller class for Account List component. Contains all methods and properties, which used by this module.
 */
class AccountListContainer extends EntityListContainer {

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
        const result = super.mapStateToProps(state);
        return Object.assign(result, {
            "listColumns": {
                "number": {
                    title: t("Номер")
                },
                "bik": {
                    title: t("БИК")
                },
                "bank_name": {
                    title: t("Банк")
                },
                "company": {
                    title: t("Организация")
                }
            },
            "sortOrder": (result["sortOrder"] && result["sortOrder"].field) ?
                result["sortOrder"] : {field:'number',direction:'ASC'}
        })
    }
}

const account = new AccountListContainer();
export const Account = connect(account.mapStateToProps.bind(account),account.mapDispatchToProps.bind(account))(List.Account);
export const AccountContainer = account;