import Entity from './Entity';
import t from "../utils/translate/translate";

/**
 * Database model of Account entity
 */
class Account extends Entity {
    constructor() {
        super();
        this.itemName = "account";
        this.collectionName = "accounts";
    }

    /**********************************
     * Item fields validation methods *
     **********************************/

    validate_bank_name(value) {
        if (!this.cleanStringField(value)) return t("Наименование банка не указано");
        return "";
    }

    validate_company(value) {
        if (!this.cleanStringField(value)) return t("Организация не указана");
        return "";
    }

    validate_number(value) {
        if (!this.cleanStringField(value)) return t("Номер счета не указан");
        if (this.cleanIntField(value)===null) return t("Указан некорректный номер счета");
        return "";
    }

    validate_bik(value) {
        if (!this.cleanStringField(value)) return t("БИК не указан");
        if (this.cleanIntField(value)===null) return t("Указан некорректный БИК");
        return "";
    }

    validate_ks(value) {
        if (!this.cleanStringField(value)) return t("Корр. счет не указан");
        if (this.cleanIntField(value)===null) return t("Указан некорректный корр. счет");
        return "";
    }

    /***************************************************
     * Item field values cleanup and transform methods *
     * used to prepare fields to be pushed to database *
     ***************************************************/

    cleanField_bank_name(value) {
        return this.cleanStringField(value);
    }

    cleanField_company(value) {
        return this.cleanStringField(value);
    }


    cleanField_number(value) {
        return this.cleanStringField(value);
    }

    cleanField_bik(value) {
        return this.cleanStringField(value);
    }

    cleanField_ks(value) {
        return this.cleanStringField(value);
    }
}

export default Account;