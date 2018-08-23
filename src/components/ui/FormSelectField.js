import React from 'react';
import PropTypes from 'prop-types';
import Container from './FormFieldContainer';
import Error from './FieldErrorMessage';
import FormField from './FormField';
import SelectInput from 'react-native-select-input-ios';

/**
 * Component used to display Dropdown field in the form
 */
class FormSelectField extends FormField {

    // types of properties which component can accept
    static propertyTypes = {
        // Array of items to choose from. Each item is an object of format {value:"",label:""}
        items: PropTypes.array.isRequired
    };

    /**
     * Class constructor
     * @param props
     */
    constructor(props) {
        super(props);
        Object.assign(this.propTypes, FormSelectField.propertyTypes);
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
                <SelectInput options={props.items} onSubmitEditing={(value) => props.onChange(props.name,value)}
                             value={props.value} style={props.inputStyle}
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
        result.items = result.items ? result.items: [];
        return result;
    }
}

FormSelectField.propTypes = (new FormSelectField()).propTypes;

export default FormSelectField;