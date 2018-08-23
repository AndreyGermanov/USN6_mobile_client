import React from 'react';
import PropTypes from 'prop-types';
import ScreenComponent from './ScreenComponent';
import {FormValidationMessage} from 'react-native-elements';


/**
 * Component used to display Error message related to field
 */
class FieldErrorMessage extends ScreenComponent {
    /**
     * Class constructor
     * @param props: Properties, directly assigned to component
     */
    constructor(props) {
        super(props);
        // Name of field, for which error message is intended
        this.propTypes["fieldName"] = PropTypes.string.isRequired
    }

    /**
     * Method to render component body
     */
    render() {
        const errors = this.props.ownerProps.errors;
        return errors[this.props.fieldName] && errors[this.props.fieldName].length ?
            <FormValidationMessage>{errors[this.props.fieldName]}</FormValidationMessage> : null
    }

    /**
     * Method used to fill default values for "props" of component
     * @returns this.props filled with default values
     */
    getProps() {
        let result = super.getProps();
        result.mulitline = result.mulitline ? result.multiline: false;
        result.keyboard = result.keyboard ? result.keyboard : 'default';
        result.password = result.password ? result.password : false;
        return result;
    }
}

FieldErrorMessage.propTypes = (new FieldErrorMessage()).propTypes;

export default FieldErrorMessage;