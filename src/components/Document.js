import React from 'react';
import Entity from './Entity';
import t from "../utils/translate/translate";
import moment from "moment-timezone";
import {View,ScrollView,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import DatePicker from 'react-native-datepicker';
import styles from "../styles/Styles";
import {FormLabel} from 'react-native-elements'

/**
 * Base component to manage Documents (both list and item views). All documents inherits from it
 */
class Document extends Entity {

    /**
     * Method used to show dialog to set date period, used to display list of documents
     * @returns {null}
     */
    renderPeriodSelectionDialog() {
        return (
            <ScrollView style={{flex:1,flexDirection:'column'}}>
                <View style={
                    {
                        backgroundColor:"#ffffff",borderWidth:1,borderColor:"#000000",flex:1,flexDirection:'column'
                    }
                }>
                    {this.renderDateField("periodStart",this.props.periodStart,"Дата начала",
                        null,null,this.props.changePeriodField)}
                    {this.renderDateField("periodEnd",this.props.periodEnd,"Дата окончания",
                        null,null,this.props.changePeriodField)}
                </View>
            </ScrollView>
        )
    }

    /**
     * Method used to render management buttons for list view
     * @returns Rendered components with buttons
     */
    renderListActionButtons() {
        var buttons = super.renderListActionButtons();
        buttons.unshift(
            <TouchableOpacity
                onPress={() => this.props.togglePeriodSelectionDialog(!this.props.showPeriodSelectionDialog)}>
                <Icon name="calendar-o" color='#339CFF' size={20} style={{paddingRight: 5}}/>
            </TouchableOpacity>);
        return buttons;
    }

}

export default Document;