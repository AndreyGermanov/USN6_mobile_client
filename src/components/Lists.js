/**
 * Collection of Lists.
 */

import EntityList from './EntityList';
import DocumentList from './DocumentList';
import AccountItem from "./Account";
import CompanyItem from "./Company";
import ReportItem from "./Report";
import IncomeItem from "./Income";
import SpendingItem from "./Spending";

class AccountList extends EntityList {
    static navigationOptions = () => {
        const result = EntityList.navigationOpts();
        result['title'] = AccountItem.listTitle;
        return result;
    };
}

class CompanyList extends EntityList {
    static navigationOptions = () => {
        const result = EntityList.navigationOpts();
        result['title'] = CompanyItem.listTitle;
        return result;
    };
}

class ReportList extends EntityList {
    static navigationOptions = () => {
        const result = EntityList.navigationOpts();
        result['title'] = ReportItem.listTitle;
        return result;
    };
}

class IncomeList extends DocumentList {
    static navigationOptions = () => {
        const result = DocumentList.navigationOpts();
        result['title'] = IncomeItem.listTitle;
        return result;
    };
}

class SpendingList extends DocumentList {
    static navigationOptions = () => {
        const result = DocumentList.navigationOpts();
        result['title'] = SpendingItem.listTitle;
        return result;
    };
}

export class Lists {
    static  Account = AccountList;
    static Company = CompanyList;
    static Report = ReportList;
    static Income = IncomeList;
    static Spending = SpendingList;
}

export const Account = AccountList;
export const Company = CompanyList;
export const Report = ReportList;
export const Income = IncomeList;
export const Spending = SpendingList;