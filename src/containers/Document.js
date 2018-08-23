import EntityContainer from './Entity';
import moment from 'moment-timezone';
import actions from '../actions/Actions';
import Store from '../store/Store';

/**
 * Controller class for Report component. Contains all methods and properties, which used by this module.
 */
class DocumentContainer extends EntityContainer {

    /**
     * Method defines set of properties, which are available inside controlled component inside "this.props"
     * @param state: Link to application state
     * @returns Array of properties
     */
    mapStateToProps(state) {
        const result = super.mapStateToProps(state);
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
    mapDispatchToProps(dispatch) {
        const result = super.mapDispatchToProps(dispatch);
        result["changePeriodField"] = (field_name,date) => this.changePeriodField(field_name,data);
        result["togglePeriodSelectionDialog"] = (mode) => this.togglePeriodSelectionDialog(mode);
        return result;
    }

    /**
     * Method used to refresh list items from backend. It makes request to backend,
     * including search filter, current page and sort order and sets "list" state variable
     * based on returned result
     * @param options: Filter and other options to generate list
     */
    updateList(options={}) {
        const props = this.getProps();
        options["condition"] = "date >= "+props.periodStart+" AND date <= "+props.periodEnd;
        super.updateList(options);
    }

    /**
     * Method used to change periodStart and periodEnd fields
     * @param field_name: Name of field to change (either "periodStart" or "periodEnd"
     * @param date: Value to set to this field
     */
    changePeriodField(field_name,date) {
        const state = this.getState();
        const periodField = state[field_name] ? state[field_name] : {};
        periodField[this.model] = moment(date).unix();
        dispatch(actions.changeProperty(field_name,periodField));
        this.updateList();
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
}

export default DocumentContainer;