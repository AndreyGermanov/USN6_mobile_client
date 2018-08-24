import Store from '../../store/Store';
import _ from 'lodash';
import actions from '../../actions/Actions';
import t from '../../utils/translate/translate';
import EntityContainer from '../Entity';
import Models from '../../models/Models';
import NavigationService from '../../utils/NavigationService';

/**
 * Base controller class for all object detail views. Contains all methods and properties, which used by all
 * descendant lists
 */
class EntityItemContainer extends EntityContainer {

    /**
     * Method defines set of properties, which are available inside controlled component inside "this.props"
     * @param state: Link to application state
     * @returns Array of properties
     */
    mapStateToProps(state) {
        return {
            uid: state.uid,
            item: state.item[this.model.itemName] ? state.item[this.model.itemName] : {},
            itemSaveSuccessText: state.itemSaveSuccessText,
            isUpdating: state.isUpdating,
            errors: state.errors,
        }
    }

    /**
     * Function defines methods which of controller methods will be available inside component, that controller manages
     * @param dispatch - Store dispatch functions, allows to transfer actions to Redux store
     * @returns object of methods, which are available in component
     */
    mapDispatchToProps(dispatch) {
        return {
            updateItem: (uid) => this.updateItem(uid),
            changeItemField: (field_name,e) => this.changeItemField(field_name,e),
            saveToBackend: () => this.saveToBackend()
        }
    }

    /**
     * Method used to refresh item data from backend for detail view. It makes request to backend
     * using specified uid of item and sets item application state variable for this item
     * @param uid: ID of item to search
     * @param callback: Function called after operation finished
     */
    updateItem(uid,callback) {
        if (!uid) return;
        const self = this;
        if (!callback) callback = () => null;
        const state = Store.getState();
        const item = _.cloneDeep(state.item);
        if (uid === "new") {
            item[this.model.itemName] = {};
            Store.store.dispatch(actions.changeProperty('item',item));
            callback();
            return;
        }
        Store.store.dispatch(actions.changeProperties({"isUpdating":true,"errors":{}}));
        this.model.getItem(uid,{},function(err,result) {
            if (err)
                result = {};
            item[self.model.itemName] = result;
            Store.store.dispatch(actions.changeProperties({'item':item,'isUpdating':false}));
            callback()
        });
    }

    /**
     * Method used to change field value in "item" property of global application state
     * @param field_name: Name of field to change
     * @param value: Value to set
     */
    changeItemField(field_name,value) {
        if (typeof(this["parseItemField_"+field_name]) === "function") {
            value = this["parseItemField_" + field_name].bind(this)(value);
        }
        const state = Store.getState();
        const item = _.cloneDeep(state.item);
        if (item[this.model.itemName][field_name] == value) {
            return;
        }
        const errors = _.cloneDeep(state.errors);
        item[this.model.itemName][field_name] = value;
        errors[field_name] = this.validateItemField(field_name,value);
        Store.store.dispatch(actions.changeProperties({"item":item,"errors":errors}));
    }

    /**
     * Function used to validate all fields in the form
     * @returns Array of found errors or null if nothing found
     */
    validate() {
        const props = this.getProps();
        const item = props.item;
        const errors = {};
        let has_errors = false;
        for (const field_name in item) {
            if (!item.hasOwnProperty(field_name) || field_name === 'uid')
                continue;
            const error = this.validateItemField(field_name,item[field_name]);
            if (error) {
                has_errors = true;
                errors[field_name] = error;
            }
        }
        return has_errors ? errors : null;
    }

    /**
     * Method used to validate specified field in item form
     * @param field_name: Name of field to validate
     * @param field_value: Value to validate
     * @returns {string}: Either string with error message or empty string if no error
     */
    validateItemField(field_name,field_value) {
        if (!field_value || typeof(field_value) === "undefined") {
            field_value = "";
        }
        if (typeof(this["validate_"+field_name])==="function") {
            return this["validate_"+field_name](field_value);
        }
        return "";
    }

    /**
     * Method used to save current entity data to backend. Handler of "Save" button
     * @param callback: Function which called after finish
     */
    saveToBackend(callback) {
        const self = this;
        if (!callback) callback = () => null;
        Store.store.dispatch(actions.changeProperty("errors",{}));
        const errors = self.validate();
        if (errors !== null) {
            Store.store.dispatch(actions.changeProperty("errors",errors));
            callback();
            return;
        }
        const data = this.cleanDataForBackend();
        const item = this.getProps().item;
        const stateItem = Store.getState().item;
        Store.store.dispatch(actions.changeProperty('isUpdating',true));
        this.model.saveItem(data, function(err,result) {
            Store.store.dispatch(actions.changeProperty('isUpdating',false));
            if (err || !result || result["errors"]) {
                if (!result["errors"])
                    result = {'errors':{'general':t("Системная ошибка")}};
                Store.store.dispatch(actions.changeProperty('errors',result['errors']));
                callback();
                return;
            }
            if (!item["uid"]) {
                stateItem[self.model.itemName] = result["result"];
                Store.store.dispatch(actions.changeProperties({uid: result["uid"], item: stateItem}));
            }
            self.displaySuccessText();
        })
    }

    /**
     * Method used to clean and prepare item data before sending to backend
     * @returns Object(hashmap) with data,ready to send to backend for this model
     */
    cleanDataForBackend() {
        const props = this.getProps();
        const item = props.item;
        const result = {};
        if (item.uid && item.uid !== "new") {
            result["uid"] = item.uid;
        }
        for (let field_name in item) {
            if (!item.hasOwnProperty(field_name) || field_name === "uid")
                continue;
            if (typeof(this["cleanField_"+field_name])==="function") {
                const value = this["cleanField_"+field_name](item[field_name]);
                if (value !== null) result[field_name] = value;
            } else if (typeof(item[field_name]) === 'string') {
                result[field_name] = item[field_name].trim();
            } else {
                result[field_name] = item[field_name];
            }
        }
        return result;
    }

    /**
     * Method displays text about successful save to backend
     */
    displaySuccessText() {
        Store.store.dispatch(actions.changeProperty("itemSaveSuccessText",t("Операция успешно завершена")));
        setTimeout(function() {
            Store.store.dispatch(actions.changeProperty("itemSaveSuccessText",""));
        },3000);
    }

    /**
     * Method used to fetch list of companies from backend and populate appropriate property in state
     * which then used to display list of companies in dropdowns
     * @param callback
     */
    getCompaniesList(callback) {
        if (!callback) callback = () => null;
        const Company = new Models.Company();
        Company.getList({}, function(err, response) {
            let companies_list = [];
            if (err || typeof(response) !== "object") {
                Store.store.dispatch(actions.changeProperty('companies_list', companies_list));
                callback();
                return;
            }
            companies_list = [{value:0,label:""}].concat(
                response.map(function (item) {
                    return {value: item['uid'], label: item["name"]};
                })
            );
            callback(companies_list);
        });
    }

    /**
     * Method used to move back to list of items (Triggered by "Back" button on header bar)
     */
    goToList() {
        NavigationService.navigate(this.model.collectionName);
        this.model.getListView().updateList();
    }
}

export default EntityItemContainer;