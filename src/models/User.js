import Entity from './Entity';
import t from "../utils/translate/translate";

/**
 * Database model of User
 */
class User extends Entity {

    constructor() {
        super();
        this.itemName = "user";
        this.collectionName = "users";
        this.itemTitle = t("Пользователь");
        this.collectionTitle = t("Пользователи");
    }

    /**
     * Method used to initialize item, by populating all empty or undefined fields with default values
     * @param item: Input item
     * @returns item with populated values
     */
    initItem(item) {
        item = super.initItem(item);
        if (!item.name) item.name = '';
        if (!item.password) item.password = '';
        if (!item.confirm_password) item.confirm_password = '';
        if (!item.email) item.email = "";
        return item;
    }

    /**
     * Method returns field labels for all fields of this model
     * @returns Object
     */
    getFieldLabels() {
        return {
            "name": t("Имя"),
            "password": t("Пароль"),
            "confirm_password": t("Подтверждение пароля"),
            "email": t("Адрес email")
        }
    }

    /**
     * Method returns API call URL for "saveItem" method based on data, which need to save to the server
     * @param data: Item data to send
     * @returns {string} URL for request
     */
    getSaveItemUrl(data) {
        const route = data["route"];
        switch (route) {
            case 'register':
                return "/user/register";
            case 'request_reset_password':
                return "/user/request_reset_password/"+data["email"];
            default:
                return ""
        }
    }

    /**
     * Method returns API call Request method for "saveItem" method based on data, which need to save to the server
     * @param data: Item data to send
     * @returns {string} Request method (GET, PUT, POST etc)
     */
    getSaveItemMethod(data) {
        const route = data["route"];
        if (route === 'request_reset_password')
            return "GET";
        return "POST"
    }

    /**
     * Function used to validate item before save to database
     * @param item: Item data to validate
     * @returns Array of found errors or null if nothing found
     */
    validate(item) {
        const route = item["route"];
        if (route === 'request_reset_password') {
            this.fieldsToValidate = ["email"];
        } else {
            this.fieldsToValidate = [];
        }
        return super.validate(item);
    }
    /**********************************
     * Item fields validation methods *
     **********************************/

    validate_name(value) {
        if (!this.cleanStringField(value)) return t("Имя не указано");
        return "";
    }

    validate_email(value) {
        value = value.toString().trim();
        if (!value) return "";
        if (this.cleanEmailField(value)===null) return t("Указан некорректный адрес email");
        return "";
    }

    validate_password(value) {
        if (!this.cleanStringField(value)) return t("Не указан пароль");
        return ""
    }

    /***************************************************
     * Item field values cleanup and transform methods *
     * used to prepare fields to be pushed to database *
     ***************************************************/

    cleanField_name(value) {
        return this.cleanStringField(value);
    }

    cleanField_password(value) {
        if (this.validate_password(value)) return null;
        return this.cleanStringField(value)
    }

    cleanField_confirm_password(value) {
        return this.cleanField_password(value)
    }

    cleanField_email(value) {
        if (!value.toString().trim()) return "";
        if (this.validate_email(value)) return null;
        return this.cleanEmailField(value);
    }
}

export default User;