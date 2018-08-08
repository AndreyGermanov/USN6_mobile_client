import EntityContainer from './Entity';
import moment from 'moment-timezone';
import actions from '../actions/Actions';
import Store from '../store/Store';

/**
 * Controller class for Report component. Contains all methods and properties, which used by this module.
 */
class DocumentContainer extends EntityContainer {

    /**
     * Methods used to render presentations of field values
     * in list view
     * @param value: Source value
     * @returns formatted value
     */
    renderListField_date(value) {
        if (!this.validate_date(value)) {
            return moment(value*1000).format("DD.MM.YYYY HH:mm:ss");
        } else {
            return 0;
        }
    }

    renderListField_amount(value) {
        if (this.cleanField_amount(value)!==null) {
            return value.toFixed(2);
        }
    }

    /********************************************************
     * Functions used to convert field value from a form    *
     * which it has in input to the form which accepted by  *
     * application state                                    *
     ********************************************************/

    parseItemField_date(e) {
        console.log(e);
        console.log(moment(e));
        if (typeof(moment(e).unix) === "function") {
            console.log(moment(e).unix());
            return moment(e).unix()
        }
        return 0;
    }

    /**
     * Method used to refresh list items from backend. It makes request to backend,
     * including search filter, current page and sort order and sets "list" state variable
     * based on returned result
     * @param options: Filter and other options to generate list
     * @param callback: Callback called after operation finished
     */
    updateList(options={}) {
        const props = this.getProps();
        options["condition"] = "date >= "+props.periodStart+" AND date <= "+props.periodEnd;
        super.updateList(options);
    }

    /**
     * Method used to show/hide "Period select" dialog, when user presses appropriate button in list view
     * @param mode - If true - show dialog, if false - hide.
     */
    togglePeriodSelectionDialog(mode) {
        console.log(mode);
        Store.store.dispatch(actions.changeProperties({
            'showPeriodSelectionDialog':mode,
            'showSortOrderDialog':false
        }));
    }

    /**
     * Method defines set of properties, which are available inside controlled component inside "this.props"
     * @param state: Link to application state
     * @param ownProps: Link to component properties (defined in component tag attributes)
     * @returns Array of properties
     */
    mapStateToProps(state,ownProps) {

        var result = super.mapStateToProps(state,ownProps);

        result["periodStart"] = state["periodStart"] && state["periodStart"][this.model] ?
            state["periodStart"][this.model] : moment().startOf('year').unix();

        result["periodEnd"] = state["periodEnd"] &&  state["periodEnd"][this.model] ?
            state["periodEnd"][this.model] : moment().endOf('year').unix();

        result["showPeriodSelectionDialog"] = state.showPeriodSelectionDialog;

        return result;
    }

    /**
     * Function defines methods which will be available inside component, which this controller manages
     * @param dispatch - Store dispatch functions, allows to transfer actions to Redux store
     * @returns object of methods, which are available in component
     */
    mapDispatchToProps(dispatch,ownProps) {
        var self = this;
        var result = super.mapDispatchToProps(dispatch,ownProps);

        /**
         * Method used to change periodStart and periodEnd fields
         * @param field_name: Name of field to change (either "periodStart" or "periodEnd"
         * @param e: Link to "moment" object which contains actual date
         */
        result["changePeriodField"] = (field_name,date) => {
            var state = this.getState();
            var periodField = state[field_name] ? state[field_name] : {};
            periodField[this.model] = moment(date).unix();
            dispatch(actions.changeProperty(field_name,periodField));
            self.updateList();
        };
        result["togglePeriodSelectionDialog"] = (mode) => this.togglePeriodSelectionDialog(mode);

        return result;
    }
}

export default DocumentContainer;