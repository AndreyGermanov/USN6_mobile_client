import actions from '../actions/Actions';
import _ from 'lodash';
import React from 'react';


/**
 * Root reducer. Used to apply actions of all reducers to application state
 */

/**
 * List of possible application screens
 */
export const Screens = {
    INCOMES: "SCREEN_INCOMES",
    SPENDINGS: "SCREEN_SPENDINGS",
    COMPANIES: "SCREEN_COMPANIES",
    BANK_ACCOUNTS: "SCREEN_BANK_ACCOUNTS",
    REPORTS: "SCREEN_REPORTS",
    getModelName: function(screen) {
        for (var model in Models) {
            if (Models[model].screen === screen) {
                return model;
            }
            return null;
        }
    },
    getScreenByModel: function(model) {
        if (Models[model]) {
            return Models[model].screen
        } else {
            return null
        }
    }
}

/**
 * List of possible application models
 */
export const Models = {
    income: {
        collection: "incomes",
        screen: Screens.INCOMES
    },
    spending: {
        collection: "spendings",
        screen: Screens.SPENDINGS
    },
    report: {
        collection: "reports",
        screen: Screens.REPORTS
    },
    company: {
        collection: "companies",
        screen: Screens.COMPANIES
    },
    account: {
        collection: "accounts",
        screen: Screens.BANK_ACCOUNTS
    }
}

/**
 * List of possible modes of each screen
 */
export const ScreenModes = {
    LIST: "SCREEN_MODES_LIST",
    ITEM: "SCREEN_MODES_ITEM"
}

/**
 * Global application state
 */
const initialState = {
    isLogin: false,
    updateCounter: 0,
    list: {},
    item: {},
    errors: {},
    itemSaveSuccessText: "",
    screen: Screens.INCOMES,
    screen_mode: ScreenModes.LIST,
    uid: "",
    isUpdating: false,
    sortOrder: {},
    listFilter: {},
    pageNumber: {"company":1},
    selectedItems: {},
    itemsPerPage: {"company":5},
    numberOfItems: {"company":16},
    companies_list: [],
    showSortOrderDialog: false,
    showPeriodSelectionDialog: false
};

/**
 * Root reducer function
 * @param state: Current state before change
 * @param action: Action, which should be applied to state
 * @returns new state after apply action
 */
export default function rootReducer(state=initialState,action) {
    var newState = _.cloneDeep(state);
    switch (action.type) {
        case actions.types.CHANGE_PROPERTY:
            newState[action.name] = _.cloneDeep(action.value);
            break;
        case actions.types.CHANGE_PROPERTIES:
            for (var name in action.properties) {
                newState[name] = _.cloneDeep(action.properties[name]);
            }
            break;
        default:
            break;
    }
    return newState;
}