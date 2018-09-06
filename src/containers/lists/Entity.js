import Store from '../../store/Store';
import _ from 'lodash';
import actions from '../../actions/Actions';
import t from '../../utils/translate/translate';
import NavigationService from "../../utils/NavigationService";
import {Alert} from 'react-native'
import EntityContainer from '../Entity';

/**
 * Base controller class for all object lists. Contains all methods and properties, which used by all
 * descendant lists
 */
export default class EntityListContainer extends EntityContainer {

    /**
     * Method defines set of properties, which are available inside controlled component inside "this.props"
     * @param state: Link to application state
     * @returns Array of properties
     */
    mapStateToProps(state) {
        return Object.assign(super.mapStateToProps(state),{
            list: state.list[this.model.itemName] ? state.list[this.model.itemName] : [],
            listColumns: {},
            selectedItems: state.selectedItems[this.model.itemName] ? state.selectedItems[this.model.itemName]: [],
            sortOrder: state.sortOrder[this.model.itemName] ? state.sortOrder[this.model.itemName]: {},
            pageNumber: state.pageNumber[this.model.itemName] ? state.pageNumber[this.model.itemName]: 1,
            itemsPerPage: state.itemsPerPage[this.model.itemName] ? state.itemsPerPage[this.model.itemName]: 5,
            numberOfItems: state.numberOfItems[this.model.itemName] ? state.numberOfItems[this.model.itemName]: 0,
            listFilter: state.listFilter[this.model.itemName] ? state.listFilter[this.model.itemName]: "",
            sortOrderDialogVisible: state.sortOrderDialogVisible
        })
    }

    /**
     * Function defines methods which of controller methods will be available inside component, that controller manages
     * @param dispatch - Store dispatch functions, allows to transfer actions to Redux store
     * @returns object of methods, which are available in component
     */
    mapDispatchToProps(dispatch) {
        return Object.assign(super.mapDispatchToProps(dispatch), {
            updateList: (options={},callback=()=>null) => this.updateList(options,callback),
            selectItem: (uid) => this.selectItem(uid),
            openItem: (uid) => this.openItem(uid),
            isItemChecked: (uid) => this.isItemChecked(uid),
            selectAllItems: (elem) => this.selectAllItems(elem),
            isAllItemsChecked: () => this.isAllItemsChecked(),
            renderListField: (field_name,value) => this.renderListField(field_name,value),
            changeListPage: (pageNumber,append) => this.changeListPage(pageNumber,append),
            changeListSortOrder: (field) => this.changeListSortOrder(field),
            changeListFilter: (text) => this.changeListFilter(text),
            deleteItems: () => this.deleteItems(),
            openSortOrderDialog: () => this.openSortOrderDialog(),
            hidePopupWindow: () => this.hidePopupWindow()
        })
    }

    /**
     * Method used to refresh list items from backend. It makes request to backend,
     * including search filter, current page and sort order and sets "list" state variable
     * based on returned result
     * @param options: Filter and other options to generate list
     * @param callback: Callback called after operation finished
     */
    updateList(options={},callback) {
        if (!callback) callback = () => null;
        const self = this;
        this.prepareListRequest(options, function(stateNumberOfItems,options) {
            self.model.getList(options, function(err,result) {
                Store.store.dispatch(actions.changeProperty('isUpdating', false));
                if (err) {
                    result = [];
                }
                const state = Store.getState();
                const list = _.cloneDeep(state.list);
                if (_.isEqual(list[self.model.itemName],result)) {
                    callback();
                    return;
                }
                if (options["append"] == true) {
                    for (let i in result) {
                        list[self.model.itemName].push(result[i])
                    }
                } else {
                    list[self.model.itemName] = result;
                }
                Store.store.dispatch(actions.changeProperties({
                    'list': list,
                    'numberOfItems': stateNumberOfItems
                }));
                callback();
            });
        });
    }

    /**
     * Method used to prepare data for "updateList" method request. It gets input request options
     * retrieves number of list items in database, populates input options with data, based on received
     * number of items and returns populated parameters in backend
     * @param options - Input request options
     * @param callback - Function called in return with params: stateNumberOfItems - copy of "numberOfItems" array
     * of application state in which numberOfItems of current entity populated by newest value from DB, options -
     * changed input options array
     */
    prepareListRequest(options,callback) {
        if (!callback) callback = () => null;
        const props = this.getProps();
        const state = Store.getState();
        let pageNumber = props.pageNumber;
        if (options["append"] !== true) pageNumber = 1;
        if (props.listFilter && props.listFilter.length) {
            options["filter_value"] = props.listFilter;
            options["filter_fields"] = Object.keys(props.listColumns);
        }
        const statePageNumber = _.cloneDeep(state.pageNumber);
        statePageNumber[this.model.itemName] = pageNumber;
        Store.store.dispatch(actions.changeProperties({'isUpdating':true,'pageNumber':statePageNumber}));
        const self = this;
        this.model.getCount(options, function(err,result) {
            if (err) {
                result = 0;
            }
            const stateNumberOfItems = _.cloneDeep(state.numberOfItems);
            stateNumberOfItems[self.model.itemName] = result;
            const skip = (pageNumber - 1) * props.itemsPerPage;
            options["skip"] = skip >= 0 ? skip : 0;
            options["limit"] = props.itemsPerPage;
            options["order"] = props.sortOrder.field + " " + props.sortOrder.direction;
            if (props.listFilter && props.listFilter.length) {
                options["filter_value"] = props.listFilter;
                options["filter_fields"] = Object.keys(props.listColumns).join(",");
            }
            callback(stateNumberOfItems,options);
        });
    }

    /**
     * Method used to generate typical configuration object for list view columns
     * @param item_fields: Array of field names for which need to create columns in the list
     * @returns Columns list configuration object
     */
    getListColumns(item_fields) {
        const result = {};
        if (!item_fields || !item_fields.length) return {};
        const labels = this.getFieldLabels();
        item_fields.forEach((field) => {
            result[field] = {title:labels[field]};
        });
        return result;
    }

    /**
     * Method fired when user clicks checkbox near item in the list. Selects row for delete or unselects
     * @param uid: ID of item to check/uncheck
     */
    selectItem(uid) {
        if (!uid) return;
        const state = Store.getState();
        const modelName = this.model.itemName;
        const selectedItems = _.cloneDeep(state.selectedItems[modelName] ? state.selectedItems[modelName]: []);
        if (selectedItems.indexOf(uid) === -1) {
            selectedItems.push(uid)
        } else {
            selectedItems.splice(selectedItems.indexOf(uid),1)
        }
        const stateSelectedItems = _.cloneDeep(state.selectedItems);
        stateSelectedItems[modelName] = selectedItems;
        Store.store.dispatch(actions.changeProperty("selectedItems",stateSelectedItems));
    }

    /**
     * Method used to open detail view of entity
     * @param uid: ID of item to open
     */
    openItem(uid) {
        Store.store.dispatch(actions.changeProperties({
            uid: uid
        }));
        NavigationService.navigate(this.model.itemName,{uid:uid,model:this.model});
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
     * on current checkbox state
     */
    selectAllItems() {
        const state = Store.getState();
        const stateSelectedItems = _.cloneDeep(state.selectedItems);
        let list = _.cloneDeep(state.list[this.model.itemName] ? state.list[this.model.itemName]: []);
        const selectedItems = [];
        if (!this.isAllItemsChecked()) {
            for (let index in list) {
                selectedItems.push(list[index].uid);
            }
        }
        stateSelectedItems[this.model.itemName] = selectedItems;
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
        if (typeof(this.model["getStringOfField_"+field_name]) === "function") {
            return this.model["getStringOfField_"+field_name].bind(this.model)(value);
        } else {
            return value;
        }
    }

    /**
     * Method used to move list to new page
     * @param pageNumber: Number of page to
     * @param append: should new page elements be appended to current page or replace whole list
     */
    changeListPage(pageNumber,append=false) {
        const state = Store.getState();
        const statePageNumber = _.cloneDeep(state.pageNumber);
        statePageNumber[this.model.itemName] = pageNumber;
        Store.store.dispatch(actions.changeProperty('pageNumber',statePageNumber));
        if (append)
            this.updateList({append:true});
        else
            this.updateList();
    }

    /**
     * Method used to change order of items in list view when user clicks on header of column
     * @param field: Sort order field
     */
    changeListSortOrder(field) {
        const state = Store.getState();
        const modelName = this.model.itemName;
        const sortOrder = _.cloneDeep(state.sortOrder);
        const pageNumber = _.cloneDeep(state.pageNumber);
        if (!sortOrder[modelName] || sortOrder[modelName].field !== field) {
            sortOrder[modelName] = {field:field,direction:'ASC'}
        } else {
            if (sortOrder[modelName].direction === 'ASC') {
                sortOrder[modelName].direction = 'DESC'
            } else {
                sortOrder[modelName].direction = 'ASC'
            }
        }
        pageNumber[modelName] = 1;
        Store.store.dispatch(actions.changeProperties({sortOrder:sortOrder,pageNumber:pageNumber}));
        this.updateList();
    }

    /**
     * Method called when user changed value in "Search" field in list view. Used to filter
     * list rows by search phrase
     * @param text: Text in search field
     */
    changeListFilter(text) {
        const state = Store.getState();
        const listFilter = _.cloneDeep(state.listFilter);
        const pageNumber = _.cloneDeep(state.pageNumber);
        listFilter[this.model.itemName] = text.toString().toLowerCase();
        pageNumber[this.model.itemName] = 1;
        Store.store.dispatch(actions.changeProperties({listFilter:listFilter,pageNumber:pageNumber}));
        this.updateList();
    }

    /**
     * Method used to delete currently checked items in list view
     * @param callback: Function which called after finish
     */
    deleteItems(callback) {
        const self = this;
        const modelName = this.model.itemName;
        if (!callback) callback = () => null;
        const stateSelectedItems = Store.getState().selectedItems;
        if (!stateSelectedItems[modelName] || !stateSelectedItems[modelName].length) {
            callback();
            return
        }
        Alert.alert(t("Вопрос"),t("Вы уверены?"),[
            {text: t("Да"), onPress: () => {
                    Store.store.dispatch(actions.changeProperty('isUpdating',true));
                    self.model.deleteItems(stateSelectedItems[modelName],function(err,result) {
                        Store.store.dispatch(actions.changeProperty('isUpdating',false));
                        if (err || !result || result['errors']) {
                            if (!result['errors']) result = {'errors':{'general':t("Системная ошибка")}};
                            Store.store.dispatch(actions.changeProperty('errors',result['errors']));
                            callback();
                            return;
                        }
                        stateSelectedItems[modelName] = [];
                        Store.store.dispatch(actions.changeProperty('selectedItems',stateSelectedItems));
                        self.updateList({},callback)
                    });
                },
            },
            {text: t("Нет"), onPress: callback}
        ])
    }

    /**
     * Shows/closes sort order config dialog
     */
    openSortOrderDialog() {
        Store.store.dispatch(actions.changeProperty('sortOrderDialogVisible',true));
    }

    /**
     * Method used to hide currently opened popup window
     */
    hidePopupWindow() {
        Store.store.dispatch(actions.changeProperty('sortOrderDialogVisible',false));
    }
}