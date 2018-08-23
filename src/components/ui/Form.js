import ScreenComponent from './ScreenComponent';
import InputField from './FormInputField';
import SelectField from './FormSelectField';
import DateTimeField from './FormDateTimeField';
import StatusMessageView from './StatusMessage';
import React from 'react';
import {View} from 'react-native';
import styles from '../../styles/Styles';

/**
 * Container component used to render form
 */
export class Form extends ScreenComponent {

    /**
     * Method used to render component
     * @returns Rendered component
     */
    render() {
        const self = this;
        let style = this.props.style;
        if (!style) style = styles.form;
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

Form.propTypes = (new Form()).propTypes;
export const Input = InputField;
export const Select = SelectField;
export const DateTime = DateTimeField;
export const StatusMessage = StatusMessageView;