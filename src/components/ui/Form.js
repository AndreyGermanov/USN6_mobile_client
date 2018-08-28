import ScreenComponent from './ScreenComponent';
import InputField from './FormInputField';
import SelectField from './FormSelectField';
import DateTimeField from './FormDateTimeField';
import StatusMessageView from './StatusMessage';
import React from 'react';
import {View,StyleSheet} from 'react-native';
import PropTypes from 'prop-types';


/**
 * Container component used to render form
 */
export class Form extends ScreenComponent {

    // types of properties which component can accept
    static propertyTypes = {
        // Styles of object
        style: PropTypes.object,
    };

    /**
     * Class constructor
     * @param props
     */
    constructor(props) {
        super(props);
        Object.assign(this.propTypes,Form.propertyTypes);
    }

    /**
     * Method used to render component
     * @returns Rendered component
     */
    render() {
        const self = this;
        let style = [Styles.form];
        if (this.props.style) style.push(this.props.style);
        return (
            <View style={style}>
                {React.Children.map(this.props.children, child => {
                    if (!child || !child.props) {
                        return null;
                    } else if (!child.props["ownerProps"]) {
                        return React.cloneElement(child,{ownerProps:self.props.ownerProps});
                    } else {
                        return child;
                    }
                })}
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    form: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor:'#faf9f8',
        paddingTop:10
    }
});

Form.propTypes = (new Form()).propTypes;
export const Input = InputField;
export const Select = SelectField;
export const DateTime = DateTimeField;
export const StatusMessage = StatusMessageView;