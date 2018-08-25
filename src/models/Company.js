import Entity from './Entity';
import t from "../utils/translate/translate";
import Store from '../store/Store';

/**
 * Database model of Company entity
 */
class Company extends Entity {
    constructor() {
        super();
        this.itemName = "company";
        this.collectionName = "companies";
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
        const item = Store.getState().item['company'];
        if (this.cleanField_type(item["type"]) !== 2) return "";
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
        const item = Store.getState().item['company'];
        if (this.cleanField_type(item["type"])!==2) return "";
        return this.cleanStringField(value)
    }

    cleanField_address(value) {
        return this.cleanStringField(value);
    }
}

export default Company;