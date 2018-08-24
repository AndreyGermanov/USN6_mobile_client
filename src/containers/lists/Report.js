import {connect} from "react-redux";
import {List} from '../../components/Components';
import DocumentListContainer from './Document'
import t from '../../utils/translate/translate'
import actions from "../../actions/Actions";
import Store from "../../store/Store";
import moment from "moment-timezone";
import Models from '../../models/Models';
import {Select} from '../../components/ui/Form';

/**
 * Controller class for Report component. Contains all methods and properties, which used by this module.
 */
class ReportListContainer extends DocumentListContainer {

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
        const result = super.mapStateToProps(state);
        return Object.assign(result, {
            "listColumns": {
                "date": {
                    title: t("Дата создания")
                },
                "period": {
                    title: t("Период отчета")
                },
                "type": {
                    title: t("Тип отчета")
                },
                "company": {
                    title: t("Организация")
                }
            },
            "sortOrder": (result["sortOrder"] && result["sortOrder"].field) ?
                result["sortOrder"] : {field:'date',direction:'ASC'},
            "report_types": state["report_types"] ? state["report_types"] : []
        })
    }

    /**
     * Method used to refresh list items from backend. It makes request to backend,
     * including search filter, current page and sort order and sets "list" state variable
     * based on returned result
     * @param options: Filter and other options to generate list
     * @param callback: Callback called after operation finished
     */
    updateList(options={}) {
        super.updateList(options);
        this.model.getTypes((error,report_types) => {
            Store.store.dispatch(actions.changeProperty('report_types',report_types));
        });
    }

    /**
     * Methods used to render presentations of field values
     * in list view
     * @param value: Source value
     * @returns formatted value
     */
    renderListField_period(value) {
        if (this.cleanIntField(value)) {
            return moment(value*1000).format("YYYY "+t("г."));
        } else {
            return 0;
        }
    }

    renderListField_type(value) {
        const report_type = Select.getItemByValue(value,this.getProps().report_types);
        if (report_type) return report_type.label;
        return "";
    }
}

const report = new ReportListContainer();
export const Report = connect(report.mapStateToProps.bind(report),report.mapDispatchToProps.bind(report))(List.Report);
export const ReportContainer = report;