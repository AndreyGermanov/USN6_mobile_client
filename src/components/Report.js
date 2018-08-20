import React from 'react';
import Entity from './Entity';
import moment from "moment-timezone";
import t from "../utils/translate/translate";
import styles from "../styles/Styles";
import Picker from 'react-native-picker-select';
import {View,ScrollView,Text} from 'react-native';
import {FormInput,FormLabel,Button} from 'react-native-elements';
import DatePicker from 'react-native-datepicker';

/**
 * Component used to manage "Reports" page (both list and item views)
 */
class Report extends Entity {

    static listTitle = t("Отчеты");
    static itemTitle = t("Отчет");

    // Navigation bar specific options
    static navigationOptions = ({navigation}) => {
        var result = Entity.navigationOpts(navigation);
        result['title'] = Report.listTitle;
        return result;
    }

    /**
     * Method initializes all properties of item
     * @returns Initialized item
     */
    initItem() {
        const item = this.props.item;
        if (!item.company) item.company = '';
        if (!item.date) item.date = moment().unix();
        if (!item.period) item.period = moment().unix();
        if (!item.type) item.type = 'kudir';
        if (!item.email) item.email = "";
        return item;
    }

    /**
     * Method returns list of periods for "Период отчета" dropdown
     * @returns {Array}
     */
    getReportPeriods() {
        var years = [];
        var startYear = (new Date()).getFullYear()-1;
        for (var i=0;i<11;i++) {
            startYear += 1;
            years.push({value:moment(startYear+"-01-01").unix(),label:startYear+" "+t("г.")})
        }
        return years;
    }

    /**
     * Method used to render detail view
     */
    renderItem() {
        if (!this.props.item) return null;
        const item = this.initItem();
        const years = this.getReportPeriods();
        return (
        <View style={{ flex: 1, flexDirection: 'column',backgroundColor:'white'}}>
            {this.renderStatusMessages()}
            <ScrollView style={{backgroundColor:'white'}}>
                <View style={{ flex: 1, flexDirection: 'column',backgroundColor:'white'}}>
                    {this.renderPickerField("company",item["company"],"Организация",this.props.companies_list)}
                    {this.renderPickerField("type",item["type"],"Тип отчета",this.props.report_types)}
                    {this.renderDateField("date",item["date"],"Дата")}
                    {this.renderPickerField("period",item["period"],"Период отчета",years)}
                    {this.renderInputField("email",item["email"],"Email","email-address")}
                    <FormLabel>{""}</FormLabel>
                    <Button
                        raised
                        icon={{name: 'envelope', type:'font-awesome', color:"white"}}
                        title={t('Отправить по email')}
                        backgroundColor="#339CFF" color="white"
                        onPress={()=>this.props.sendByEmail.bind(this)()}
                    />
                    <FormLabel>{""}</FormLabel>
                </View>
            </ScrollView>
        </View>
        )
    }
}

export default Report;