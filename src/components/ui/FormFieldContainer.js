import React from 'react';
import ScreenComponent from './ScreenComponent';
import PropTypes from 'prop-types';
import {View} from 'react-native';
import {FormLabel} from 'react-native-elements';
import styles from "../../styles/Styles";

/**
 * Component defines Field container, which surrounds form field. It also includes label
 * of field
 */
class FormFieldContainer extends ScreenComponent {

    // Component properties definition
    static propertyTypes = {
        // Style of field container View
        containerStyle: PropTypes.object,
        // Style of label of field before field container view
        labelStyle: PropTypes.object,
        // Text of label (optional, if no text, no label)
        label: PropTypes.string
    };

    /**
     * Class constructor
     * @param props: Properties, directly assigned to component
     */
    constructor(props) {
        super(props);
        Object.assign(this.propTypes,FormFieldContainer.propertyTypes)
    }

    /**
     * Method used to render item on screen
     */
    render() {
        const containerStyle = this.props.containerStyle ? this.props.containerStyle :
            styles.fieldContainer;
        const labelStyle = this.props.labelStyle ? this.props.labelStyle: {};
        let label = null;
        if (this.props.label) {
            label = <FormLabel labelStyle={labelStyle}>{this.props.label}</FormLabel>
        }
        return [
            label,
            <View style={containerStyle}>
                {this.props.children}
            </View>
        ]
    }
}

FormFieldContainer.propTypes = (new FormFieldContainer()).propTypes;

export default FormFieldContainer;