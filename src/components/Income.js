import React from 'react';
import Document from './Document';
import t from '../utils/translate/translate';
import moment from 'moment-timezone'
import Entity from "./Entity";
import styles from "../styles/Styles";
import {View,ScrollView} from 'react-native';
import {FormInput,FormLabel} from 'react-native-elements';
import Picker from 'react-native-picker-select';
import DatePicker from 'react-native-datepicker';


/**
 * Component used to manage "Income" page (both list and item views)
 */
class Income extends Document {

    static listTitle = t("Список операций прихода");
    static itemTitle = t("Приход");

    // Navigation bar specific options
    static navigationOptions = ({navigation}) => {
        var result = Entity.navigationOpts(navigation);
        result['title'] = Income.listTitle;
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
        if (!item.number) item.number = ''; else item.number = item.number.toString();
        if (!item.date) item.date = moment().unix();
        if (!item.amount) item.amount = ''; else item.amount = item.amount.toString();
        return item;
    }

    /**
     * Method used to render detail view
     */
    renderItem() {
        if (!this.props.item) return null;
        var item = this.initItem();
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
                        <FormLabel>{t("Сумма дохода")}</FormLabel>
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

export default Income;