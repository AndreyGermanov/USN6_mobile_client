import React from 'react';
import PropTypes from 'prop-types';
import styles from "../../styles/Styles";
import ScreenComponent from './ScreenComponent';
import FormFieldContainer from './FormFieldContainer';
import _ from 'lodash';

/**
 * Abstract base class for all form components, which accepts input
 */
class FormField extends ScreenComponent {

    // types of properties which component can accept
    static propertyTypes = {
        // Name of field
        name: PropTypes.string.isRequired,
        // Current field value
        value: PropTypes.node,
        // Change field value handler function (name,value) => {}
        onChange: PropTypes.func,
        // Style of input part of item
        inputStyle: PropTypes.object
    };

    /**
     * Class constructor
     * @param props
     */
    constructor(props) {
        super(props);
        Object.assign(this.propTypes,FormFieldContainer.propertyTypes,FormField.propertyTypes);
    }

    /**
     * Method renders component on the screen
     * @returns Rendered component
     */
    render() {
        return null;
    }

    /**
     * Method used to fill default values for "props" of component
     * @returns this.props filled with default values
     */
    getProps() {
        let result = _.cloneDeep(this.props);
        result.inputStyle = result.inputStyle ? result.inputStyle : styles.inputField;
        result.onChange = result.onChange ? result.onChange : result.ownerProps.changeItemField;
        return result;
    }
}

FormField.propTypes = (new FormField()).propTypes;

export default FormField;