/**
 * Collection of Lists.
 */

import Entity from './Entity';
import Document from './Document';
import AccountItem from "../items/Account";
import CompanyItem from "../items/Company";
import ReportItem from "../items/Report";
import IncomeItem from "../items/Income";
import SpendingItem from "../items/Spending";

class AccountList extends Entity {
    static navigationOptions = () => {
        const result = Entity.navigationOpts();
        result['title'] = AccountItem.listTitle;
        return result;
    };
}

class CompanyList extends Entity {
    static navigationOptions = () => {
        const result = Entity.navigationOpts();
        result['title'] = CompanyItem.listTitle;
        return result;
    };
}

class ReportList extends Document {
    static navigationOptions = () => {
        const result = Entity.navigationOpts();
        result['title'] = ReportItem.listTitle;
        return result;
    };
}

class IncomeList extends Document {
    static navigationOptions = () => {
        const result = Document.navigationOpts();
        result['title'] = IncomeItem.listTitle;
        return result;
    };
}

class SpendingList extends Document {
    static navigationOptions = () => {
        const result = Document.navigationOpts();
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