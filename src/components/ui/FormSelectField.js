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
    static propTypes = Object.assign({},{
        // Array of items to choose from. Each item is an object of format {value:"",label:""}
        items: PropTypes.array.isRequired
    },FormField.propTypes);

    /**
     * Method renders component on the screen
     * @returns Rendered component
     */
    render() {
        const props = this.getProps();
        return (
            <Container label={props.label} containerStyle={props.containerStyle}
                       labelStyle={props.labelStyle} ownerProps={props.ownerProps}>
                <SelectInput options={props.items} onSubmitEditing={(value) => props.onChange(props.name,value)}
                             value={props.value} style={props.inputStyle}
                />
                <Error fieldName={props.name} ownerProps={props.ownerProps}/>
            </Container>
        )
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

    /**
     * Utility method which used to return item of list by value
     * @param value: Value to search
     * @param items: Array of dropdown items to search in Each item is {value:'',label:''}
     * @returns {*}
     */
    static getItemByValue(value,items) {
        for (let i in items) {
            if (!items.hasOwnProperty(i))
                continue;
            if (items[i].value === value) {
                return items[i]
            }
        }
        return null;
    }
}

export default FormSelectField;