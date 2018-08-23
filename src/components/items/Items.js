/**
 * Collection of Items.
 */

import AccountItem from "./Account";
import CompanyItem from "./Company";
import ReportItem from "./Report";
import IncomeItem from "./Income";
import SpendingItem from "./Spending";

export class Items {
    static  Account = AccountItem;
    static Company = CompanyItem;
    static Report = ReportItem;
    static Income = IncomeItem;
    static Spending = SpendingItem;
}

export const Account = AccountItem;
export const Company = CompanyItem;
export const Report = ReportItem;
export const Income = IncomeItem;
export const Spending = SpendingItem;