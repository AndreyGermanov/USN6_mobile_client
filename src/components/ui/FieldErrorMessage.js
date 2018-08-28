import React from 'react';
import PropTypes from 'prop-types';
import ScreenComponent from './ScreenComponent';
import {Text,StyleSheet} from 'react-native';


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
            <Text style={Styles.errorFieldText}>{errors[this.props.fieldName]}</Text> : null
    }
}

FieldErrorMessage.propTypes = (new FieldErrorMessage()).propTypes;

const Styles = StyleSheet.create({
    errorFieldText: {color:'red'}
});

export default FieldErrorMessage;