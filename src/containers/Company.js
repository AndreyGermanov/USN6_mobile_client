import {connect} from "react-redux";
import {List,Item} from '../components/Components';
import EntityContainer from './Entity';
import t from '../utils/translate/translate';

/**
 * Controller class for Company component. Contains all methods and properties, which used by this module.
 */
class CompanyContainer extends EntityContainer {

    /**
     * Class constructor
     */
    constructor() {
        super();
        this.model = "company";
        this.collection = "companies";
    }

    /**
     * Method defines set of properties, which are available inside controlled component inside "this.props"
     * @param state: Link to application state
     * @returns Array of properties
     */
    mapStateToProps(state) {
        const result = super.mapStateToProps(state);
        result["listColumns"] = {
            "inn": {
                title: t("ИНН")
            },
            "kpp": {
                title: t("КПП")
            },
            "name": {
                title: t("Наименование")
            }
        };
        if (!result["sortOrder"] || !result["sortOrder"].field) {
            result["sortOrder"] = {field:'name',direction:'ASC'}
        }
        return result;
    }

    /**********************************
     * Item fields validation methods *
     **********************************/

    validate_name(value) {
        if (!this.cleanStringField(value)) return t("Наименование не указано");
        return "";
    }

    validate_inn(value) {
        if (!this.cleanStringField(value)) return t("ИНН не указан");
        if (this.cleanIntField(value)===null) return t("Указан некорректный ИНН");
        return "";
    }

    validate_kpp(value) {
        const props = this.getProps();
        if (this.cleanField_type(props.item["type"]) !== 2) return "";
        if (!this.cleanStringField(value)) return t("Не указан КПП");
        if (this.cleanIntField(value)===null) return t("Указан некорректный КПП");
        return "";
    }

    validate_type(value) {
        const intValue = this.cleanIntField(value);
        if (intValue !== 1 && intValue !== 2) return t("Указан некорректный тип организации");
        return "";
    }

    validate_address(value) {
        if (!this.cleanStringField(value)) return t("Не указан адрес");
        return "";
    }

    /***************************************************
     * Item field values cleanup and transform methods *
     * used to prepare fields to be pushed to database *
     ***************************************************/

    cleanField_name(value) {
        return this.cleanStringField(value);
    }

    cleanField_inn(value) {
        return this.cleanStringField(value);
    }

    cleanField_type(value) {
        const result = this.cleanIntField(value);
        if (result !==1 && result !==2) return null;
        return result;
    }

    cleanField_kpp(value) {
        const props = this.getProps();
        const item = props.item;
        if (this.cleanField_type(item["type"])!==2) return "";
        return this.cleanStringField(value)
    }

    cleanField_address(value) {
        return this.cleanStringField(value);
    }
}

const company = new CompanyContainer();
export const Company = connect(company.mapStateToProps.bind(company),company.mapDispatchToProps.bind(company))(Item.Company);
export const Companies = connect(company.mapStateToProps.bind(company),company.mapDispatchToProps.bind(company))(List.Company);
