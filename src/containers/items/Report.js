import {connect} from "react-redux";
import {Item} from '../../components/Components';
import DocumentItemContainer from './Document'
import t from '../../utils/translate/translate'
import actions from "../../actions/Actions";
import Store from "../../store/Store";
import Models from '../../models/Models';
import {Select} from '../../components/ui/Form';

/**
 * Controller class for Report Item component. Contains all methods and properties, which used by this module.
 */
class ReportItemContainer extends DocumentItemContainer {

    /**
     * Class constructor
     */
    constructor() {
        super();
        this.model = Models.getInstanceOf("report");
    }

    /**
     * Method defines set of properties, which are available inside controlled component inside "this.props"
     * @param state: Link to application state
     * @returns Array of properties
     */
    mapStateToProps(state) {
        return Object.assign(super.mapStateToProps(state), {
            companies_list: state["companies_list"] ? state["companies_list"] : [],
            report_types: state["report_types"] ? state["report_types"] : []
        })
    }

    /**
     * Function defines methods which will be available inside component, which this controller manages
     * @param dispatch - Store dispatch functions, allows to transfer actions to Redux store
     * @returns object of methods, which are available in component
     */
    mapDispatchToProps(dispatch) {
        return Object.assign(super.mapDispatchToProps(dispatch), {
            sendByEmail: () => this.sendByEmail()
        });
    }

    /**
     * Method called after standard "updateItem" action
     */
    updateItem(uid,callback) {
        const self = this;
        if (!callback) callback = () => null;
        super.updateItem(uid,function() {
            self.getCompaniesList((companies_list) => {
                self.model.getTypes(function(error,report_types) {
                    Store.store.dispatch(actions.changeProperties(
                        {
                            'report_types':report_types,
                            'companies_list':companies_list
                        })
                    );
                    callback();
                });
            })
        })
    }

    /**
     * Method used to send report in PDF format to specified email
     * @param callback: Function called after process finished
     */
    sendByEmail(callback) {
        const self = this;
        if (!callback) callback = () => null;
        if (!this.isValidForEmail()) {
            callback();
            return;
        }
        const item = this.getProps().item;
        Store.store.dispatch(actions.changeProperty('isUpdating',true));
        this.model.sendByEmail(item, (err,response) => {
            self.processSendByEmailResponse(err,response,callback)
        })
    }

    /**
     * Utility method used to make form validation when user presses "Send by email" button
     * @returns Boolean - True if form is valid and false otherwise
     */
    isValidForEmail() {
        Store.store.dispatch(actions.changeProperty("errors",{}));
        const errors = this.validate();
        if (errors !== null) {
            Store.store.dispatch(actions.changeProperty("errors",errors));
            return false;
        }
        const email = this.getProps().item["email"];
        if (!email || !email.trim()) {
            Store.store.dispatch(actions.changeProperty("errors",{email:t("Укажите адрес email")}));
            return false
        }
        return true;
    }

    /**
     * Utility method used to handle response from server after user presses "Send by email" button
     * @param err - Error object
     * @param response - Server response object
     * @param callback - Function called after method executed
     */
    processSendByEmailResponse(err,response,callback) {
        if (!callback) callback = () => null;
        Store.store.dispatch(actions.changeProperty('isUpdating',false));
        if (err) {
            Store.store.dispatch(actions.changeProperty('errors',{'general': t("Системная ошибка")}));
            callback();
            return;
        }
        const self = this;
        response.text().then(function(text) {
            if (text && text.length) {
                Store.store.dispatch(actions.changeProperty('errors',{'general':text}));
                callback();
            } else {
                self.displaySuccessText();
                callback();
            }
        }).catch(function() {
            callback();
        })
    }

    /********************************************************
     * Functions used to convert field value from a form    *
     * which it has in input to the form which accepted by  *
     * application state                                    *
     ********************************************************/

    /**********************************
     * Item fields validation methods *
     **********************************/

    validate_company(value) {
        if (!this.cleanStringField(value)) return t("Организация не указана");
        return "";
    }

    validate_date(value) {
        if (!this.cleanStringField(value)) return t("Не указана дата отчета");
        if (this.cleanIntField(value)===null) return t("Указана некорректная дата отчета");
        return "";
    }

    validate_period(value) {
        if (!this.cleanStringField(value)) return t("Не указан период отчета");
        if (this.cleanIntField(value)===null) return t("Указан некорректный период отчета");
        return "";
    }

    validate_type(value) {
        if (!this.cleanStringField(value)) return t("Не указан тип отчета");
        if (!Select.getItemByValue(value,this.getProps().report_types)) return t("Указан некорректный тип отчета");
        return "";
    }

    validate_email(value) {
        value = value.toString().trim();
        if (!value) return "";
        if (this.cleanEmailField(value)===null) return t("Указан некорректный адрес email");
        return "";
    }

    /***************************************************
     * Item field values cleanup and transform methods *
     * used to prepare fields to be pushed to database *
     ***************************************************/

    cleanField_company(value) {
        return this.cleanStringField(value);
    }


    cleanField_date(value) {
        return this.cleanIntField(value);
    }

    cleanField_period(value) {
        return this.cleanIntField(value);
    }

    cleanField_type(value) {
        if (this.validate_type(value)) return null;
        return this.cleanStringField(value);
    }

    cleanField_email(value) {
        if (!value.toString().trim()) return "";
        if (this.validate_email(value)) return null;
        return this.cleanEmailField(value);
    }

}

const report = new ReportItemContainer();
export const Report = connect(report.mapStateToProps.bind(report),report.mapDispatchToProps.bind(report))(Item.Report);
export const ReportContainer = report;