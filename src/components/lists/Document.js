import React from 'react';
import Entity from './Entity';
import {View,TouchableOpacity,Text,StyleSheet} from 'react-native';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome'
import Divider from '../ui/HeaderBarDivider';
import {DateTime} from '../ui/Form'
import {PopupWindow,Button} from '../ui/Form';
import t from "../../utils/translate/translate";

/**
 * Base component to manage lists of documents. All documents inherits from it
 */
class Document extends Entity {

    // Navigation options for all descendants of Document
    static navigationOpts = () => {
        return Entity.navigationOpts();
    };

    /**
     * Method used to render component and display it on screen;
     * @returns Rendered component
     */
    render() {
        const content = super.render();
        if (this.props.periodSelectionDialogVisible) {
            content.push(
                <PopupWindow key="popup_period_selection" title={t("Установка периода")} ownerProps={this.props}
                     visible={this.props.periodSelectionDialogVisible}>
                    {this.renderPeriodSelectionDialog()}
                </PopupWindow>
            );
        }
        return content;
    }

    /**
     * Method used to show dialog to set date period, used to display list of documents
     * @returns {null}
     */
    renderPeriodSelectionDialog() {
        return [
            <DateTime key="periodStart" name="periodStart" value={this.props.periodStart} label={t("Дата начала")}
                      onChange={this.props.changePeriodField} ownerProps={this.props}/>,
            <DateTime key="periodEnd" name="periodEnd" value={this.props.periodEnd} label={t("Дата окончания")}
                      onChange={this.props.changePeriodField} ownerProps={this.props}/>,
            <Button key="periodSubmit" onPress={() => this.props.hidePopupWindow()} text={t("Закрыть")}/>
        ]
    }

    /**
     * Method used to render management buttons for list view
     * @returns Rendered components with buttons
     */
    renderListActionButtons() {
        let buttons = super.renderListActionButtons();
        buttons.unshift([
            <TouchableOpacity key="periodSelectButton"
                onPress={() => this.props.openPeriodSelectionDialog()}>
                <View style={Styles.periodButtonContainer}>
                    <IconFontAwesome name="calendar-o" color='white' size={20} style={Styles.periodButton}/>
                    <Text style={Styles.periodButtonText}>{t("Период")}</Text>
                </View>
            </TouchableOpacity>,
            <Divider key="d5"/>]);
        return buttons;
    }
}

// Styles, used in design of this component
const Styles = StyleSheet.create({
    periodContainer: {
        flex:1,
        flexDirection:'column'
    },
    periodButton: {paddingRight: 5},
    periodButtonContainer: {
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center'},
    periodButtonText: {color:'white'},
    periodCloseButton: {
        backgroundColor:'#ff6600',
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding:5,
        borderWidth:1,
        borderColor:'#ff6600',
        borderRadius:5
    },
    periodCloseButtonText: {color:'white'}
});

export default Document;