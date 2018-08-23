import React from 'react';
import PropTypes from 'prop-types';
import ScreenComponent from './ScreenComponent';
import Styles from '../../styles/Styles';
import {View,Text} from 'react-native';

/**
 * Component used to display message about status of operation. For example it can
 * display success message after save data to backend or error message after communicate
 * with backend
 */
class StatusMessage extends ScreenComponent {

    // Types of static message
    static types = {
        ERROR: "ERROR",
        SUCCESS: "SUCCESS",
        CUSTOM: "CUSTOM"
    };

    /**
     * Class constructor
     * @param props: Properties, directly assigned to component
     */
    constructor(props) {
        super(props);
        // Message to display
        this.propTypes["message"] = PropTypes.string.isRequired;
        // String name or hex code of background color
        this.propTypes["backgroundStyle"] = PropTypes.object;
        // String name or hex code of background color
        this.propTypes["textStyle"] = PropTypes.object;
        // Type of message (from "types" static variable)
        this.propTypes["type"] = PropTypes.string;
    }

    /**
     * Method used to render component
     * @returns Rendered component
     */
    render() {
        const props = this.getProps();
        if (!props.message) return null;

        return (
            <View style={props.backgroundStyle}>
                <Text style={props.textStyle}>
                    {props.message}
                </Text>
            </View>
        )
    }

    /**
     * Method used to fill default values for "props" of component
     * @returns this.props filled with default values
     */
    getProps() {
        let result = super.getProps();
        result.type = result.type ? result.type : StatusMessage.types.CUSTOM;
        const defStyles = this.getStyles(result.type);
        result.backgroundStyle = result.backgroundStyle ? result.backgroundStyle : defStyles.backgroundStyle;
        result.textStyle = result.textStyle ? result.textStyle : defStyles.textStyle;
        return result;
    }


    /**
     * Get default styles for component depending on type
     * @param type: Type of status message (item of StatusMessage.types enumeration)
     */
    getStyles(type) {
        const result = {
            backgroundStyle: {},
            textStyle: {}
        };
        if (Styles[type.toString().toLowerCase()+"MessageBackground"]) {
            result.backgroundStyle = Styles[type.toString().toLowerCase()+"MessageBackground"]
        }
        if (Styles[type.toString().toLowerCase()+"MessageText"]) {
            result.textStyle = Styles[type.toString().toLowerCase()+"MessageText"]
        }
        return result;
    }
}

StatusMessage.propTypes = (new StatusMessage()).propTypes;

export default StatusMessage;