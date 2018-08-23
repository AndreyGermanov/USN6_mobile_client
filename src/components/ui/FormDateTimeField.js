import React from 'react';
import PropTypes from 'prop-types';
import Container from './FormFieldContainer';
import Error from './FieldErrorMessage';
import FormField from './FormField';
import moment from "moment-timezone";
import t from "../../utils/translate/translate";
import DatePicker from 'react-native-datepicker';

/**
 * Component used to display Date and Time select field in the form
 */
class FormDateTimeField extends FormField {

    // types of properties which component can accept
    static propertyTypes = {
        // Mode of date/time selector (datetime,date or time)
        mode: PropTypes.string,
        // Format of date display (as defined in moment.js)
        format: PropTypes.string
    };

    /**
     * Class constructor
     * @param props
     */
    constructor(props) {
        super(props);
        Object.assign(this.propTypes, FormDateTimeField.propertyTypes);
    }

    /**
     * Method renders component on the screen
     * @returns Rendered component
     */
    render() {
        const props = this.getProps();
        return [
            <Container label={props.label} containerStyle={props.containerStyle}
                       labelStyle={props.labelStyle} ownerProps={props.ownerProps}>
                <DatePicker
                    date={moment(props.value*1000).format(props.format)}
                    mode={props.mode}
                    placeholder={t(props.label)}
                    format={props.format}
                    confirmBtnText={t("ОК")}
                    cancelBtnText={t("Отмена")}
                    showIcon={false}
                    onDateChange={(date) => props.onChange(props.name,date)}
                    customStyles={{
                        dateInput: props.inputStyle
                    }}
                />
            </Container>,
            <Error fieldName={props.name} ownerProps={props.ownerProps}/>
        ]
    }

    /**
     * Method used to fill default values for "props" of component
     * @returns this.props filled with default values
     */
    getProps() {
        let result = super.getProps();
        result.mode = result.mode ? result.mode: "datetime";
        result.format = result.format ? result.format : "YYYY-MM-DD HH:mm:ss";
        return result;
    }
}

FormDateTimeField.propTypes = (new FormDateTimeField()).propTypes;

export default FormDateTimeField;