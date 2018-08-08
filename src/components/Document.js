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
                    <FormLabel>{t("Дата начала")}</FormLabel>
                    <View style={[styles.inputField,{marginLeft:10,marginRight:10}]}>
                        <DatePicker
                            date={moment(this.props.periodStart*1000).format('YYYY-MM-DD')}
                            mode="date"
                            placeholder={t("Дата начала")}
                            format="YYYY-MM-DD HH:mm:ss"
                            confirmBtnText={t("ОК")}
                            cancelBtnText={t("Отмена")}
                            showIcon={false}
                            onDateChange={(date) => this.props.changePeriodField('periodStart',date)}
                            customStyles={{
                                dateInput: styles.inputField
                            }}
                        />
                    </View>
                    <FormLabel>{t("Дата окончания")}</FormLabel>
                    <View style={[styles.inputField,{marginLeft:10,marginRight:10}]}>
                        <DatePicker
                            date={moment(this.props.periodEnd*1000).format('YYYY-MM-DD')}
                            mode="date"
                            placeholder={t("Дата конца")}
                            format="YYYY-MM-DD HH:mm:ss"
                            confirmBtnText={t("ОК")}
                            cancelBtnText={t("Отмена")}
                            showIcon={false}
                            onDateChange={(date) => this.props.changePeriodField('periodEnd',date)}
                            customStyles={{
                                dateInput: styles.inputField
                            }}
                        />
                    </View>
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