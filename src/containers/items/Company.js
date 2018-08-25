import {connect} from "react-redux";
import {Item} from '../../components/Components';
import EntityItemContainer from './Entity';
import t from '../../utils/translate/translate';
import Models from '../../models/Models';

/**
 * Controller class for Company Item component. Contains all methods and properties, which used by this module.
 */
export default class CompanyItemContainer extends EntityItemContainer {

    /**
     * Class constructor
     */
    constructor() {
        super();
        this.model = Models.getInstanceOf("company");
    }

    static getComponent() {
        const company = new CompanyItemContainer();
        return connect(company.mapStateToProps.bind(company),company.mapDispatchToProps.bind(company))(Item.Company);
    }
}