import React from 'react';
import _ from 'lodash';
import ScreenComponent from './ScreenComponent';
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types'

/**
 * Component which renders button
 */
class Button extends ScreenComponent {

    // types of properties which component can accept
    static propertyTypes = {
        // Text of button
        text: PropTypes.string.isRequired,
        // Style of button view
        buttonStyle: PropTypes.object,
        // Style of button text
        buttonTextStyle: PropTypes.object,
        // Button click handler
        onPress: PropTypes.func
    };

    /**
     * Class constructor
     * @param props: Properties, directly assigned to component
     */
    constructor(props) {
        super(props);
        Object.assign(this.propTypes,Button.propertyTypes);
    }

    /**
     * Method which shows component on the screen
     * @returns Rendered component
     */
    render() {
        const props = this.getProps();
        return (
            <TouchableOpacity onPress={() => props.onPress()}>
                <View style={props.buttonStyle}>
                    <Text style={props.buttonTextStyle}>{props.text}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    /**
     * Method used to fill default values for "props" of component
     * @returns this.props filled with default values
     */
    getProps() {
        const props = super.getProps();
        const result = _.cloneDeep(props);
        result.text = props.text ? props.text : '';
        result.buttonStyle = [Styles.button];
        if (props.buttonStyle)
            result.buttonStyle.push(props.buttonStyle);
        result.buttonTextStyle = Styles.buttonText;
        if (props.buttonTextStyle)
            result.buttonTextStyle.push(props.buttonTextStyle);
        result.onPress = props.onPress ? props.onPress : () => null;
        return result;
    }
}

Button.propTypes = (new Button()).propTypes;

const Styles = StyleSheet.create({
    button: {
        backgroundColor:'#ff6600',
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding:5,
        borderWidth:1,
        elevation:0,
        borderColor:'#ff6600',
        borderRadius:5
    },
    buttonText: {
        color:'white'
    }
});

export default Button;
