import {Account as AccountsList,AccountContainer} from './Account';
import {Company as CompaniesList,CompanyContainer} from "./Company";
import {Report as ReportsList,ReportContainer} from "./Report";
import {Income as IncomesList,IncomeContainer} from "./Income";
import {Spending as SpendingsList,SpendingContainer} from "./Spending";

/**
 * Factory to get instances of List containers and connected components
 */
export class Lists {
    static  Account = AccountsList;
    static Company = CompaniesList;
    static Report = ReportsList;
    static Income = IncomesList;
    static Spending = SpendingsList;

    // Cache of created instances
    static instances = {};

    /**
     * Returns instance of List view container for specified database model
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

export const Account = AccountsList;
export const Company = CompaniesList;
export const Report = ReportsList;
export const Income = IncomesList;
export const Spending = SpendingsList;