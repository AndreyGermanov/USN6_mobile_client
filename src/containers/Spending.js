import {connect} from "react-redux";
import {Item,List} from '../components/Components'
import DocumentContainer from './Document'
import t from '../utils/translate/translate'
import actions from "../actions/Actions";
import Backend from "../backend/Backend";
import Store from "../store/Store";

/**
 * Controller class for Spending component. Contains all methods and properties, which used by this module.
 */
class SpendingContainer extends DocumentContainer {

    /**
     * Class constructor
     */
    constructor() {
        super();
        this.model = "spending";
        this.collection = "spendings";
    }

    /**
     * Method defines set of properties, which are available inside controlled component inside "this.props"
     * @param state: Link to application state
     * @returns Array of properties
     */
    mapStateToProps(state) {
        const result = super.mapStateToProps(state);
        result["listColumns"] = {
            "number": {
                title: t("Номер")
            },
            "date": {
                title: t("Дата")
            },
            "description": {
                title: t("Описание")
            },
            "period": {
                title: t("Период расхода")
            },
            "amount": {
                title: t("Сумма")
            },
            "company": {
                title: t("Организация")
            }
        };
        if (!result["sortOrder"] || !result["sortOrder"].field) {
            result["sortOrder"] = {field:'date',direction:'ASC'}
        }
        result["companies_list"] = state["companies_list"] ? state["companies_list"] : [];
        result["spending_types"] = state["spending_types"] ? state["spending_types"] : [];
        return result;
    }

    /**
     * Method called after standard "updateItem" action
     */
    updateItem(uid,callback) {
        const self = this;
        if (!callback) callback=()=>null;
        super.updateItem(uid, function() {
            self.getCompaniesList((companies_list) => {
                Store.store.dispatch(actions.changeProperty('companies_list',companies_list));
                Backend.request("/spending/types",{},"GET",{},null, function(err,response) {
                    if (err || !response) {
                        callback();
                        return;
                    }
                    response.json().then(function(spending_types) {
                        const spending_types_array = [];
                        for (let key in spending_types) {
                            if (!spending_types.hasOwnProperty(key))
                                continue;
                            spending_types_array.push({value:parseInt(key),label:spending_types[key]});
                        }
                        Store.store.dispatch(actions.changeProperty('spending_types',spending_types_array));
                        callback();
                    });
                })
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

const spending = new SpendingContainer();
export const Spending = connect(spending.mapStateToProps.bind(spending),spending.mapDispatchToProps.bind(spending))(Item.Spending);
export const Spendings = connect(spending.mapStateToProps.bind(spending),spending.mapDispatchToProps.bind(spending))(List.Spending);
