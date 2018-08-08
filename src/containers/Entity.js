import Store from '../store/Store';
import _ from 'lodash';
import actions from '../actions/Actions';
import Backend from '../backend/Backend';
import {Screens,ScreenModes} from '../reducers/RootReducer';
import t from '../utils/translate/translate';
import NavigationService from "../utils/NavigationService";
import {Alert} from 'react-native';

/**
 * Controller class for Entity base component. Contains all methods and properties, which used by any model
 * management module
 */
class EntityContainer {

    /**
     * Class constructor
     */
    constructor() {
        this.model = "entity";
    }

    /**
     * Method defines set of properties, which are available inside controlled component inside "this.props"
     * @param state: Link to application state
     * @param ownProps: Link to component properties (defined in component tag attributes)
     * @returns Array of properties
     */
    mapStateToProps(state) {
        return {
            model: this.model,
            uid: state.uid,
            list: state.list[this.model] ? state.list[this.model] : [],
            item: state.item[this.model] ? state.item[this.model] : {},
            itemSaveSuccessText: state.itemSaveSuccessText,
            screen: Screens.getScreenByModel(this.model),
            screenMode: state.screen_mode ? state.screen_mode : ScreenModes.LIST,
            isUpdating: state.isUpdating,
            errors: state.errors,
            listColumns: {},
            selectedItems: state.selectedItems[this.model] ? state.selectedItems[this.model]: [],
            sortOrder: state.sortOrder[this.model] ? state.sortOrder[this.model]: {},
            pageNumber: state.pageNumber[this.model] ? state.pageNumber[this.model]: 1,
            itemsPerPage: state.itemsPerPage[this.model] ? state.itemsPerPage[this.model]: 5,
            numberOfItems: state.numberOfItems[this.model] ? state.numberOfItems[this.model]: 0,
            listFilter: state.listFilter[this.model] ? state.listFilter[this.model]: "",
            showSortOrderDialog: state.showSortOrderDialog
        }
    }

    /**
     * Method returns global application state
     */
    getState() {
        return Store.store.getState();
    }

    /**
     * Method returns array of properties, the same array that available in this component
     * @returns Array of properties
     */
    getProps() {
        const state = Store.store.getState();
        return this.mapStateToProps(state);
    }

    /**
     * Method used to validate specified field in item form
     * @param field_name: Name of field to validate
     * @param field_value: Value to validate
     * @returns {string}: Either string with error message or empty string if no error
     */
    validateItemField(field_name,field_value) {
        const props = this.getProps();
        const item = props.item;
        if (!field_value || typeof(field_value) === "undefined") {
            field_value = "";
        }
        if (typeof(this["validate_"+field_name])==="function") {
            return this["validate_"+field_name](field_value);
        }
        return "";
    }

    /**
     * Function used to validate all fields in the form
     * @returns Array of found errors or null if nothing found
     */
    validate() {
        const props = this.getProps();
        const item = props.item;
        var errors = {},
            has_errors = false;
        for (const field_name in item) {
            if (field_name === 'uid') continue;
            var error = this.validateItemField(field_name,item[field_name]);
            if (error) {
                has_errors = true;
                errors[field_name] = error;
            }
        }
        return has_errors ? errors : null;

    }

    /**
     * Method used to clean and prepare item data before sending to backend
     * @returns Object(hashmap) with data,ready to send to backend for this model
     */
    cleanDataForBackend() {
        const props = this.getProps();
        const item = props.item;
        var result = {};
        if (item.uid && item.uid !== "new") {
            result["uid"] = item.uid;
        }
        for (var field_name in item) {
            if (field_name === "uid") continue;
            if (typeof(this["cleanField_"+field_name])==="function") {
                var value = this["cleanField_"+field_name](item[field_name]);
                if (value !== null) result[field_name] = value;
            } else if (typeof(item[field_name]) === 'string') {
                result[field_name] = item[field_name].trim();
            } else {
                result[field_name] = item[field_name];
            }
        }
        return result;
    }

    /************************************************************
     * Generic functions used to clean values of various types, *
     * before pushing to database                               *
     ************************************************************/

    cleanStringField(value) {
        return value.toString().trim()
    }

    cleanIntField(value) {
        var result = parseInt(value);
        if (!isNaN(result) && value == result) return result;
        return null;
    }

    cleanDecimalField(value) {
        var result = parseFloat(value);
        if (!isNaN(result) && value == result) return result;
        return null;
    }

    cleanEmailField(value) {
        value = value.toString().trim().toLowerCase();
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(value)) return null;
        return value;
    }

    /**
     * Method used to refresh list items from backend. It makes request to backend,
     * including search filter, current page and sort order and sets "list" state variable
     * based on returned result
     * @param options: Filter and other options to generate list
     * @param callback: Callback called after operation finished
     */
    updateList(options={},callback) {
        var self = this;
        const props = self.getProps();
        const state = self.getState();
        var pageNumber = props.pageNumber;
        if (options["append"] !== true) {
            pageNumber = 1;
        }
        if (props.listFilter && props.listFilter.length) {
            options["filter_value"] = props.listFilter;
            options["filter_fields"] = Object.keys(props.listColumns);
        }
        var statePageNumber = _.cloneDeep(state.pageNumber);
        statePageNumber[this.model] = pageNumber;
        Store.store.dispatch(actions.changeProperties({'isUpdating':true,'pageNumber':statePageNumber}));
        Backend.getCount(this.model,options, function(err,result) {
            if (err) {
                result = 0;
            }
            var stateNumberOfiItems = _.cloneDeep(state.numberOfItems);
            stateNumberOfiItems[self.model] = result;
            var skip = (pageNumber-1)*props.itemsPerPage;
            options["skip"] = skip>=0 ? skip : 0;
            options["limit"] = props.itemsPerPage;
            options["order"] = props.sortOrder.field+" "+props.sortOrder.direction;
            if (props.listFilter && props.listFilter.length) {
                options["filter_value"] = props.listFilter;
                options["filter_fields"] = Object.keys(props.listColumns).join(",");
            }
            Backend.getList(self.model,options, function(err,result) {
                if (err) {
                    result = [];
                }
                var state = self.getState();
                var list = _.cloneDeep(state.list);
                if (!_.isEqual(list[self.model],result)) {
                    if (options["append"] === true) {
                        for (var i in result) {
                            list[self.model].push(result[i])
                        }
                    } else {
                        list[self.model] = result;
                    }
                    Store.store.dispatch(actions.changeProperties({
                        'list': list,
                        'numberOfItems': stateNumberOfiItems
                    }));
                }
                Store.store.dispatch(actions.changeProperty('isUpdating', false));
                if (callback) callback();
            });
        });
    }

    /**
     * Method fired when user clicks checkbox near item in the list. Selects row for delete or unselects
     * @param uid: ID of item to check/uncheck
     */
    selectItem(uid) {
        if (!uid) {
            return;
        }
        const state = this.getState();
        var selectedItems = _.cloneDeep(state.selectedItems[this.model] ? state.selectedItems[this.model]: []);
        if (selectedItems.indexOf(uid) === -1) {
            selectedItems.push(uid)
        } else {
            selectedItems.splice(selectedItems.indexOf(uid),1)
        }
        var stateSelectedItems = _.cloneDeep(state.selectedItems);
        stateSelectedItems[this.model] = selectedItems;
        Store.store.dispatch(actions.changeProperty("selectedItems",stateSelectedItems));
    }

    /**
     * Method used to open detail view of entity
     * @param uid: ID of item to open
     */
    openItem(uid) {
        Store.store.dispatch(actions.changeProperties({
            uid: uid,
            screen_mode: ScreenModes.ITEM
        }));
        NavigationService.replace(this.model,{screen_mode: ScreenModes.ITEM,uid:uid,obj:this});
    }

    /**
     * Method used to open list view of Entity
     */
    goToList() {
        Store.store.dispatch(actions.changeProperties({
            screen_mode: ScreenModes.LIST
        }));
        NavigationService.replace(this.model,{screen_mode: ScreenModes.LIST,uid:null,obj:this});
    }

    /**
     * Method returns true if specified list item is selected or false otherwise
     * @param uid: ID of item to check
     * @returns {boolean}: True if item is checked or false otherwise
     */
    isItemChecked(uid) {
        const props = this.getProps();
        if (!props.selectedItems) {
            return false;
        }
        return props.selectedItems.indexOf(uid) !== -1;
    }


    /**
     * Checkbox in table header event handler: selects/deselects all items in list (on current page) depending
     * on currect checkbox state
     * @param elem: Link DOM element of checkbox
     */
    selectAllItems() {
        const state = this.getState();
        var stateSelectedItems = _.cloneDeep(state.selectedItems);
        let list = _.cloneDeep(state.list[this.model] ? state.list[this.model]: []);
        var selectedItems = [];
        if (!this.isAllItemsChecked()) {
            for (var index in list) {
                selectedItems.push(list[index].uid);
            }
        }
        stateSelectedItems[this.model] = selectedItems;
        Store.store.dispatch(actions.changeProperty('selectedItems',stateSelectedItems));
    }

    /**
     * Method returns true if all items in list view selected or false otherwise
     * @returns {boolean}: True if all intes selected and false otherwise
     */
    isAllItemsChecked() {
        const props = this.getProps();
        return props.list.length && props.list.length === props.selectedItems.length;
    }

    /**
     * Method used to convert field value to needed form before display it in list view
     * @param field_name: Name of field
     * @param value: Value of field
     * @returns Converted value
     */
    renderListField(field_name,value) {
        if (typeof(this["renderListField_"+field_name]) === "function") {
            return this["renderListField_"+field_name].bind(this)(value);
        } else {
            return value;
        }
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
        const state = this.getState();
        var item = _.cloneDeep(state.item);
        if (item[this.model][field_name] == value) {
            return;
        }
        var errors = _.cloneDeep(state.errors);
        item[this.model][field_name] = value;
        errors[field_name] = this.validateItemField(field_name,value);
        Store.store.dispatch(actions.changeProperties({"item":item,"errors":errors}));
    }

    /**
     * Method used to move list to new page
     * @param pageNumber
     */
    changeListPage(pageNumber,append=false) {
        const state = this.getState();
        const statePageNumber = _.cloneDeep(state.pageNumber);
        statePageNumber[this.model] = pageNumber;
        Store.store.dispatch(actions.changeProperty('pageNumber',statePageNumber));
        if (append) this.updateList({append:true}); else this.updateList();
    }

    /**
     * Method used to change order of items in list view when user clicks on header of column
     * @param field: Sort order field
     */
    changeListSortOrder(field) {
        const state = this.getState();
        var sortOrder = _.cloneDeep(state.sortOrder);
        var pageNumber = _.cloneDeep(state.pageNumber);
        if (!sortOrder[this.model] || sortOrder[this.model].field !== field) {
            sortOrder[this.model] = {field:field,direction:'ASC'}
        } else {
            if (sortOrder[this.model].direction === 'ASC') {
                sortOrder[this.model].direction = 'DESC'
            } else {
                sortOrder[this.model].direction = 'ASC'
            }
        }
        pageNumber[this.model] = 1;
        Store.store.dispatch(actions.changeProperties({sortOrder:sortOrder,pageNumber:pageNumber}));
        this.updateList();
    }

    /**
     * Method called when user changed value in "Search" field in list view. Used to filter
     * list rows by search phrase
     * @param e: Link to "Search" input filed
     */
    changeListFilter(text) {
        const state = this.getState();
        var listFilter = _.cloneDeep(state.listFilter);
        var pageNumber = _.cloneDeep(state.pageNumber);
        listFilter[this.model] = text.toString().toLowerCase();
        pageNumber[this.model] = 1;
        Store.store.dispatch(actions.changeProperties({listFilter:listFilter,pageNumber:pageNumber}));
        this.updateList();
    }

    /**
     * Shows/closes sort order config dialog
     * @param mode: If true, show dialog, if false - hide
     */
    toggleSortOrderDialog(mode) {
        Store.store.dispatch(actions.changeProperties({
            'showPeriodSelectionDialog':false,
            'showSortOrderDialog':mode
        }));
    }

    /**
     * Method used to refresh item data from backend for detail view. It makes request to backend
     * using specified uid of item and sets item application state variable for this item
     * @param uid: ID of item to search
     * @param callback: Function called after operation finished
     */
    updateItem(uid,callback) {
        const self = this;
        if (!uid) return;
        var state = self.getState();
        var item = _.cloneDeep(state.item);
        if (uid === "new") {
            item[self.model] = {};
            Store.store.dispatch(actions.changeProperty('item',item));
            if (callback) callback();
            return;
        }
        Store.store.dispatch(actions.changeProperties({"isUpdating":true,"errors":{}}));
        Backend.getItem(self.model,uid,{},function(err,result) {
            if (err) {
                result = {};
            }
            item[self.model] = result;
            Store.store.dispatch(actions.changeProperty('item',item));
            Store.store.dispatch(actions.changeProperty('isUpdating',false));
            if (callback) {
                callback()
            }
        });
    }

    /**
     * Method used to save current entity data to backend. Handler of "Save" button
     * @param callback: Function which called after finish
     */
    saveToBackend(callback) {
        const self = this;
        Store.store.dispatch(actions.changeProperty("errors",{}));
        const errors = self.validate();
        if (errors !== null) {
            Store.store.dispatch(actions.changeProperty("errors",errors));
            if (callback) callback();
            return;
        }
        const data = self.cleanDataForBackend();
        const props = this.getProps();
        const state = this.getState();
        const item = props.item;
        const stateItem = state.item;
        Store.store.dispatch(actions.changeProperty('isUpdating',true));
        Backend.saveItem(self.model,data, function(err,result) {
            Store.store.dispatch(actions.changeProperty('isUpdating',false));
            if (err || !result) {
                result = {'errors':{'general':t("Системная ошибка")}};
            }
            if (result['errors']) {
                const errors = result['errors'];
                Store.store.dispatch(actions.changeProperty('errors',errors));
                if (callback) callback();
                return;
            }
            if (!item["uid"]) {
                stateItem[self.model] = result["result"];
                Store.store.dispatch(actions.changeProperties({
                    uid: result["uid"],
                    item: stateItem
                }));
                window.location.href = "#"+self.model+"/"+result["uid"];
            }
            Store.store.dispatch(actions.changeProperty("itemSaveSuccessText",t("Операция успешно завершена")));
            setTimeout(function() {
                Store.store.dispatch(actions.changeProperty("itemSaveSuccessText",""));
            },3000)
            if (callback) callback();
        })
    }

    /**
     * Method used to delete currently checked items in list view
     * @param callback: Function which called after finish
     */
    deleteItems(callback) {
        const self = this;
        const state = self.getState();
        var stateSelectedItems = state.selectedItems;
        const selectedItems = state.selectedItems[self.model] ? state.selectedItems[self.model] : [];
        if (!selectedItems.length) return;
        Alert.alert(t("Вопрос"),t("Вы уверены?"),[
            {text: t("Да"), onPress: () => {
                    Store.store.dispatch(actions.changeProperty('isUpdating',true));
                    Backend.deleteItems(self.model,selectedItems,function(err,result) {
                        Store.store.dispatch(actions.changeProperty('isUpdating',false));
                        if (err || !result) {
                            result = {'errors':{'general':t("Системная ошибка")}};
                        }
                        if (result['errors']) {
                            const errors = result['errors'];
                            Store.store.dispatch(actions.changeProperty('errors',errors));
                            if (callback) callback();
                            return;
                        }
                        stateSelectedItems[self.model] = [];
                        Store.store.dispatch(actions.changeProperty('selectedItems',stateSelectedItems));
                        self.updateList(function() {
                            if (callback) callback();
                        });
                    });
                },
            },
            {text: t("Нет"), onPress: () => {
                    if (callback) callback();
                }
            }
        ])
    }

    /**
     * Function defines methods which of controller methods will be available inside component, that controller manages
     * @param dispatch - Store dispatch functions, allows to transfer actions to Redux store
     * @returns object of methods, which are available in component
     */
    mapDispatchToProps(dispatch,ownProps) {
        var self = this;
        return {
            selectItem: (uid) => self.selectItem(uid),
            isItemChecked: (uid) => self.isItemChecked(uid),
            selectAllItems: (elem) => self.selectAllItems(elem),
            isAllItemsChecked: () => self.isAllItemsChecked(),
            renderListField: (field_name,value) => self.renderListField(field_name,value),
            changeItemField: (field_name,e) => self.changeItemField(field_name,e),
            changeListPage: (pageNumber,append) => self.changeListPage(pageNumber,append),
            changeListSortOrder: (field) => self.changeListSortOrder(field),
            changeListFilter: (text) => self.changeListFilter(text),
            updateList: (options={}) => self.updateList(options),
            updateItem: (uid) => self.updateItem(uid),
            saveToBackend: () => self.saveToBackend(),
            deleteItems: () => self.deleteItems(),
            openItem: (uid) => self.openItem(uid),
            toggleSortOrderDialog: (mode) => self.toggleSortOrderDialog(mode)
        }
    }

}

export default EntityContainer;