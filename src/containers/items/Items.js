import {Account as AccountItem,AccountContainer} from './Account';
import {Company as CompanyItem,CompanyContainer} from "./Company";
import {Report as ReportItem,ReportContainer} from "./Report";
import {Income as IncomeItem,IncomeContainer} from "./Income";
import {Spending as SpendingItem,SpendingContainer} from "./Spending";

/**
 * Factory to get instances of Item containers and connected components
 */
export class Items {
    static  Account = AccountItem;
    static Company = CompanyItem;
    static Report = ReportItem;
    static Income = IncomeItem;
    static Spending = SpendingItem;

    // Cache of created instances
    static instances = {};

    /**
     * Returns instance of Detail view container for specified database model
     * @param modelName: Name of model
     */
    static getInstanceOf(modelName) {
        switch (modelName) {
            case "account": return AccountContainer;
            case "company": return CompanyContainer;
            case "income": return IncomeContainer;
            case "spending": return SpendingContainer;
            case "report": return ReportContainer;
        }
    }
}

export const Account = AccountItem;
export const Company = CompanyItem;
export const Report = ReportItem;
export const Income = IncomeItem;
export const Spending = SpendingItem;