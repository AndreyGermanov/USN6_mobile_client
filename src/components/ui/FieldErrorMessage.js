import React from 'react';
import PropTypes from 'prop-types';
import ScreenComponent from './ScreenComponent';
import {Text,StyleSheet} from 'react-native';

/**
 * Component used to display Error message related to field
 */
class FieldErrorMessage extends ScreenComponent {

    static propTypes = Object.assign({},{
        fieldName: PropTypes.string.isRequired
    },ScreenComponent.propTypes);

    /**
     * Method to render component body
     */
    render() {
        const errors = this.props.ownerProps.errors;
        return errors[this.props.fieldName] && errors[this.props.fieldName].length ?
            <Text style={Styles.errorFieldText}>{errors[this.props.fieldName]}</Text> : null
    }
}

const Styles = StyleSheet.create({
    errorFieldText: {color:'red'}
});

export default FieldErrorMessage;