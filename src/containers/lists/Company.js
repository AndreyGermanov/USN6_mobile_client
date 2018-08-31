import {connect} from "react-redux";
import {List} from '../../components/Components';
import EntityListContainer from './Entity';
import t from '../../utils/translate/translate';
import Models from '../../models/Models';

/**
 * Controller class for Company List component. Contains all methods and properties, which used by this module.
 */
export default class CompanyListContainer extends EntityListContainer {

    /**
     * Class constructor
     */
    constructor() {
        super();
        this.model = Models.getInstanceOf("company");
    }

    /**
     * Method defines set of properties, which are available inside controlled component inside "this.props"
     * @param state: Link to application state
     * @returns Array of properties
     */
    mapStateToProps(state) {
        const result = super.mapStateToProps(state);
        return Object.assign(result, {
            "listColumns": this.getListColumns(["inn","kpp","name"]),
            "sortOrder": (result["sortOrder"] && result["sortOrder"].field) ?
                result["sortOrder"] : {field:'name',direction:'ASC'}
        })
    }

    static getComponent() {
        const company = new CompanyListContainer();
        return connect(company.mapStateToProps.bind(company),company.mapDispatchToProps.bind(company))(List.Company);
    }
}