import AccountContainer from './Account';
import CompanyContainer from "./Company";
import ReportContainer from "./Report";
import IncomeContainer from "./Income";
import SpendingContainer from "./Spending";

/**
 * Factory to get instances of Item containers and connected components
 */
export class Items {

    // Cache of created instances
    static instances = {};

    static createInstanceOf(modelName) {
        switch (modelName) {
            case "account": return new AccountContainer();
            case "company": return new CompanyContainer();
            case "income": return new IncomeContainer();
            case "spending": return new SpendingContainer();
            case "report": return new ReportContainer();
        }
    }

    /**
     * Returns instance of Detail view container for specified database model
     * @param modelName: Name of model
     */
    static getInstanceOf(modelName) {
        if (!Items.instances[modelName])
            Items.instances[modelName] = Items.createInstanceOf(modelName);
        return Items.instances[modelName];
    }

    /**
     * Returns instance of wired Container component
     * @param modelName: Name of model
     */
    static getComponentOf(modelName) {
        switch (modelName) {
            case "account": return AccountContainer.getComponent();
            case "company": return CompanyContainer.getComponent();
            case "income": return IncomeContainer.getComponent();
            case "spending": return SpendingContainer.getComponent();
            case "report": return ReportContainer.getComponent();
        }
    }
}