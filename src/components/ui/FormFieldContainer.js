import React from 'react';
import ScreenComponent from './ScreenComponent';
import PropTypes from 'prop-types';
import {View,Text,StyleSheet} from 'react-native';

/**
 * Component defines Field container, which surrounds form field. It also includes label
 * of field
 */
class FormFieldContainer extends ScreenComponent {

    // Component properties definition
    static propTypes = Object.assign({},{
        // Style of field container View
        containerStyle: PropTypes.object,
        // Style of label of field before field container view
        labelStyle: PropTypes.object,
        // Text of label (optional, if no text, no label)
        label: PropTypes.string
    },ScreenComponent.propTypes);

    /**
     * Method used to render item on screen
     */
    render() {
        const containerStyle = this.props.containerStyle ? this.props.containerStyle : Styles.fieldContainer;
        const labelStyle = this.props.labelStyle ? this.props.labelStyle: Styles.label;
        let label = null;
        if (this.props.label) {
            label = <Text style={labelStyle}>{this.props.label}</Text>
        }
        return (
            <View style={containerStyle}>
                {label}
                {this.props.children}
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    fieldContainer: {
        marginLeft:10,
        marginRight:10,
        borderRadius:5,
        borderTopWidth:2,
        borderTopColor:'#efeeed',
        borderBottomWidth:2,
        borderBottomColor:'#efeeed',
        borderLeftWidth:2,
        borderLeftColor:'#efeeed',
        borderRightWidth:2,
        borderRightColor:'#efeeed',
        paddingLeft:20,
        paddingRight:20,
        paddingTop:10,
        paddingBottom:10,
        marginBottom:10
    },
    label:{
        color:'#acacad',
        paddingBottom:10
    }
});

export default FormFieldContainer;