import React,{Component} from 'react';
import {View,StyleSheet} from 'react-native';

/**
 * Divider of buttons on top header bar of List view
 */
export default class HeaderBarDivider extends Component {
    render() {
        return (
            <View style={Styles.headerDivider}/>
        )
    }
}

const Styles = StyleSheet.create({
    headerDivider:{
        height:'100%',
        width:4,
        borderLeftColor:'#3f4653',
        borderLeftWidth:2,
        borderRightColor:'#373e49',
        borderRightWidth:2
    }
});