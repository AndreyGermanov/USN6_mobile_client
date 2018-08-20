import React from 'react';
import Document from './Document';
import t from '../utils/translate/translate';
import moment from 'moment-timezone'
import Entity from "./Entity";
import styles from "../styles/Styles";
import {ScrollView,View} from 'react-native';
import {FormLabel,FormInput} from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import Picker from 'react-native-picker-select';

/**
 * Component used to manage "Spendings" page (both list and item views)
 */
class Spending extends Document {

    static listTitle = t("Список операций расхода");
    static itemTitle = t("Расход");

    // Navigation bar specific options
    static navigationOptions = ({navigation}) => {
        var result = Entity.navigationOpts(navigation);
        result['title'] = Spending.listTitle;
        return result;
    }

    /**
     * Method initializes all properties of item
     * @returns Initialized item
     */
    initItem() {
        var item = this.props.item;
        if (!item.description) item.description = '';
        if (!item.company) item.company = '';
        if (!item.number) item.number = '';else item.number = item.number.toString();
        if (!item.date) item.date = moment().unix();
        if (!item.amount) item.amount = '';else item.amount = item.amount.toString();
        if (!item.type) item.type = 1;
        if (!item.period) item.period = '';
        return item;
    }

    /**
     * Method used to render detail view
     */
    renderItem() {
        if (!this.props.item) return null;
        var item = this.initItem();
        console.log(this.props.spending_types);
        console.log(item);
        return (
            <View style={{ flex: 1, flexDirection: 'column',backgroundColor:'white'}}>
                {this.renderStatusMessages()}
                <ScrollView style={{backgroundColor:'white'}}>
                    <View style={{ flex: 1, flexDirection: 'column',backgroundColor:'white'}}>
                        {this.renderInputField("company",item["company"],"Организация",this.props.companies_list)}
                        {this.renderPickerField("type",item["type"],"Тип расхода",this.props.spending_types)}
                        {this.renderInputField("number",item["number"],"Номер документа","numeric")}
                        {this.renderDateField("date",item["date"],"Дата документа")}
                        {this.renderInputField("period",item["period"],"Период расхода")}
                        {this.renderInputField("amount",item["amount"],"Сумма расхода","decimal-pad")}
                        {this.renderInputField("description",item["description"],"Описание операции","default",true)}
                        <FormLabel>{""}</FormLabel>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

export default Spending;