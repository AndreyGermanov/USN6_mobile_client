import EntityModel from './Entity';
import DocumentModel from './Document';
import AccountModel from './Account';
import CompanyModel from './Company';
import IncomeModel from './Income';
import ReportModel from './Report';
import SpendingModel from './Spending';
import UserModel from './User';

export default class Models {
    static Account = AccountModel;
    static Company = CompanyModel;
    static Income = IncomeModel;
    static Report = ReportModel;
    static Spending = SpendingModel;
    static Entity = EntityModel;
    static Document = DocumentModel;
    static User = UserModel;

    // Initialized instances pool
    static instances = {};

    /**
     * Method returns model class based on model name
     * @param modelName: Name of model
     * @returns {Entity}
     */
    static getModelClass(modelName) {
        switch (modelName) {
            case "account": return AccountModel;
            case "company": return CompanyModel;
            case "income": return IncomeModel;
            case "spending": return SpendingModel;
            case "report": return ReportModel;
            case "document" : return DocumentModel;
            case "user": return UserModel;
            default: return EntityModel;
        }
    }

    /**
     * Method returns instance of model based on model name
     * @param modelName: Name of model
     * @returns {Entity}
     */
    static getInstanceOf(modelName) {
        if (!Models.instances[modelName])
            Models.instances[modelName] = new (Models.getModelClass(modelName))();
        return Models.instances[modelName];
    }
}