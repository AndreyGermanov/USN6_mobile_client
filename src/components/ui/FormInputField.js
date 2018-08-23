import React from 'react';
import PropTypes from 'prop-types';
import {FormInput} from 'react-native-elements';
import FormField from './FormField';
import Container from './FormFieldContainer';
import Error from './FieldErrorMessage';

/**
 * Component used to display Input field in the form
 */
class FormInputField extends FormField {

    // types of properties which component can accept
    static propertyTypes = {
        // Type of keyboard of this input item (React Native keyboardType property)
        keyboard: PropTypes.string,
        // Is input field multiline (true or false)
        multiline: PropTypes.bool,
        // Should input field work in password enter mode
        password: PropTypes.bool
    };

    /**
     * Class constructor
     * @param props
     */
    constructor(props) {
        super(props);
        Object.assign(this.propTypes,FormInputField.propertyTypes);
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
                <FormInput value={props.value} autoCaptialize="none" autoCorrect={false}
                           onChangeText={(value) => props.onChange(props.name,value)}
                           inputStyle={props.inputStyle} keyboardType={props.keyboard}
                           secureTextEntry={props.password} multilne={props.multiline}/>
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
        result.mulitline = result.mulitline ? result.multiline: false;
        result.keyboard = result.keyboard ? result.keyboard : 'default';
        result.password = result.password ? result.password : false;
        return result;
    }
}

FormInputField.propTypes = (new FormInputField()).propTypes;

export default FormInputField;