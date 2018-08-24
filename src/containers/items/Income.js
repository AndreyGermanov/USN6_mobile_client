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
class IncomeItemContainer extends DocumentItemContainer {

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

    /**********************************
     * Item fields validation methods *
     **********************************/

    validate_description(value) {
        if (!this.cleanStringField(value)) return t("Описание операции не указано");
        return "";
    }

    validate_company(value) {
        if (!this.cleanStringField(value)) return t("Организация не указана");
        return "";
    }

    validate_number(value) {
        if (!this.cleanStringField(value)) return t("Номер документа не указан");
        if (this.cleanDecimalField(value)===null) return t("Указан некорректный номер документа");
        return "";
    }

    validate_amount(value) {
        if (!this.cleanStringField(value)) return t("Сумма не указана");
        if (this.cleanDecimalField(value)===null) return t("Указана некорректная сумма");
        return "";
    }

    validate_date(value) {
        if (!this.cleanStringField(value)) return t("Не указана дата документа");
        if (this.cleanIntField(value)===null) return t("Указана некорректная дата документа");
        return "";
    }

    /***************************************************
     * Item field values cleanup and transform methods *
     * used to prepare fields to be pushed to database *
     ***************************************************/

    cleanField_description(value) {
        return this.cleanStringField(value);
    }

    cleanField_company(value) {
        return this.cleanStringField(value);
    }


    cleanField_number(value) {
        return this.cleanDecimalField(value);
    }

    cleanField_amount(value) {
        return this.cleanDecimalField(value);
    }

    cleanField_date(value) {
        return this.cleanIntField(value);
    }
}
const income = new IncomeItemContainer();
export const Income = connect(income.mapStateToProps.bind(income),income.mapDispatchToProps.bind(income))(Item.Income);
export const IncomeContainer = income;


