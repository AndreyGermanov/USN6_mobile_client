import React from 'react';
import PropTypes from 'prop-types';
import ScreenComponent from './ScreenComponent';
import {StyleSheet} from 'react-native';
import _ from 'lodash';

/**
 * Abstract base class for all form components, which accepts input
 */
class FormField extends ScreenComponent {

    // types of properties which component can accept
    static propTypes = Object.assign({},{
        // Name of field
        name: PropTypes.string.isRequired,
        // Current field value
        value: PropTypes.node,
        // Change field value handler function (name,value) => {}
        onChange: PropTypes.func,
        // Style of input part of item
        inputStyle: PropTypes.object
    },ScreenComponent.propTypes);

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
        result.inputStyle = result.inputStyle ? result.inputStyle : Styles.inputField;
        result.onChange = result.onChange ? result.onChange : result.ownerProps.changeItemField;
        return result;
    }
}

const Styles = StyleSheet.create({
    inputField: {
        backgroundColor: "#ffffff",
        borderRadius: 5,
        borderTopWidth: 1,
        borderTopColor: '#e6e6e6',
        borderBottomWidth: 1,
        borderBottomColor: '#e6e6e6',
        borderLeftWidth: 1,
        borderLeftColor: '#e6e6e6',
        borderRightWidth: 1,
        borderRightColor: '#e6e6e6',
        borderWidth: 0,
        width: '100%'
    }
});

export default FormField;