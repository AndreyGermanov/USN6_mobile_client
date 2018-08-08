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
                        <FormLabel>{t("Организация")}</FormLabel>
                        <Picker items={this.props.companies_list}
                                onValueChange={(value) => {this.props.changeItemField("company",value)}}
                                value={item["company"]}
                                style={styles.inputField}
                        />
                        {this.renderFieldErrorMessage("company")}
                        <FormLabel>{t("Тип расхода")}</FormLabel>
                        <Picker items={this.props.spending_types}
                                onValueChange={(value) => {this.props.changeItemField("type",value)}}
                                value={item["type"]}
                                style={styles.inputField}
                        />
                        {this.renderFieldErrorMessage("type")}
                        <FormLabel>{t("Номер документа")}</FormLabel>
                        <View style={[styles.inputField,{marginLeft:10,marginRight:10}]}>
                            <FormInput value={item["number"]} autoCapitalize="none" autoCorrect={false}
                                       onChangeText={(value) => this.props.changeItemField("number",value)}
                                       inputStyle={styles.inputField}
                                       keyboardType="numeric"
                            />
                        </View>
                        {this.renderFieldErrorMessage("number")}
                        <FormLabel>{t("Дата документа")}</FormLabel>
                        <View style={[styles.inputField,{marginLeft:10,marginRight:10}]}>
                            <DatePicker
                                date={moment(item["date"]*1000).format('YYYY-MM-DD HH:mm:ss')}
                                mode="datetime"
                                placeholder={t("Дата документа")}
                                format="YYYY-MM-DD HH:mm:ss"
                                confirmBtnText={t("ОК")}
                                cancelBtnText={t("Отмена")}
                                showIcon={false}
                                onDateChange={(date) => this.props.changeItemField('date',date)}
                                customStyles={{
                                    dateInput: styles.inputField
                                }}
                            />
                        </View>
                        {this.renderFieldErrorMessage("date")}
                        <FormLabel>{t("Период расхода")}</FormLabel>
                        <View style={[styles.inputField,{marginLeft:10,marginRight:10}]}>
                            <FormInput value={item["period"]} autoCapitalize="none" autoCorrect={false}
                                       onChangeText={(value) => this.props.changeItemField("period",value)}
                                       inputStyle={styles.inputField}
                            />
                        </View>
                        {this.renderFieldErrorMessage("period")}
                        <FormLabel>{t("Сумма расхода")}</FormLabel>
                        <View style={[styles.inputField,{marginLeft:10,marginRight:10}]}>
                            <FormInput value={item["amount"]} autoCapitalize="none" autoCorrect={false}
                                       onChangeText={(value) => this.props.changeItemField("amount",value)}
                                       inputStyle={styles.inputField}
                                       keyboardType="decimal-pad"
                            />
                        </View>
                        {this.renderFieldErrorMessage("amount")}
                        <FormLabel>{t("Описание операции")}</FormLabel>
                        <View style={[styles.inputField,{marginLeft:10,marginRight:10}]}>
                            <FormInput value={item["description"]} autoCapitalize="none" autoCorrect={false}
                                       onChangeText={(value) => this.props.changeItemField("description",value)}
                                       inputStyle={styles.inputField}
                                       mulitline={true}
                            />
                        </View>
                        {this.renderFieldErrorMessage("description")}
                        <FormLabel>{""}</FormLabel>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

export default Spending;