import {connect} from "react-redux";
import {Item} from '../../components/Components'
import DocumentItemContainer from './Document'
import t from '../../utils/translate/translate'
import actions from "../../actions/Actions";
import Store from "../../store/Store";
import Models from '../../models/Models';

/**
 * Controller class for Spending Item component. Contains all methods and properties, which used by this module.
 */
class SpendingItemContainer extends DocumentItemContainer {

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
        super.updateItem(uid, function() {
            self.getCompaniesList((companies_list) => {
                self.model.getTypes((error,spending_types_array) => {
                    Store.store.dispatch(actions.changeProperties({
                        'companies_list': companies_list,
                        'spending_types':spending_types_array,
                    }));
                    callback();
                });
            })
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
        if (this.cleanIntField(value)===null) return t("Указан некорректный номер документа");
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

    validate_type(value) {
        if (!this.cleanStringField(value)) return t("Не указан тип расходов");
        const decValue = this.cleanDecimalField(value);
        if (decValue===null || decValue < 1 | decValue > 7 ) return t("Указан некорректный тип расходов");
        return "";
    }

    validate_period(value) {
        if (!this.cleanStringField(value)) return t("Период расходов не указан");
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

    cleanField_type(value) {
        return this.cleanIntField(value);
    }

    cleanField_period(value) {
        return this.cleanStringField(value);
    }
}

const spending = new SpendingItemContainer();
export const Spending = connect(spending.mapStateToProps.bind(spending),spending.mapDispatchToProps.bind(spending))(Item.Spending);
export const SpendingContainer = spending;