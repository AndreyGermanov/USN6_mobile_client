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
        var item = this.props.item;
        if (!item.company) item.company = '';
        if (!item.date) item.date = moment().unix();
        if (!item.period) item.period = moment().unix();
        if (!item.type) item.type = 'kudir';
        if (!item.email) item.email = "";
        return item;
    }

    /**
     * Method used to render detail view
     */
    renderItem() {
        if (!this.props.item) return null;
        var item = this.initItem();
        var years = [];
        var startYear = (new Date()).getFullYear()-1;
        for (var i=0;i<11;i++) {
            startYear += 1;
            years.push({value:moment(startYear+"-01-01").unix(),label:startYear+" "+t("г.")})
        }
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
                    <FormLabel>{t("Тип отчета")}</FormLabel>
                    <Picker items={this.props.report_types}
                            onValueChange={(value) => this.props.changeItemField("type",value)}
                            value={item["type"]}
                            style={styles.inputField}
                    />
                    {this.renderFieldErrorMessage("type")}
                    <FormLabel>{t("Дата")}</FormLabel>
                    <View style={[styles.inputField,{marginLeft:10,marginRight:10}]}>
                        <DatePicker
                            date={moment(item["date"]*1000).format('YYYY-MM-DD HH:mm:ss')}
                            mode="datetime"
                            placeholder={t("Дата отчета")}
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
                    <FormLabel>{t("Период отчета")}</FormLabel>
                    <Picker items={years}
                            onValueChange={(value) => this.props.changeItemField("period",value)}
                            value={item["period"]}/>
                    {this.renderFieldErrorMessage("period")}
                    <FormLabel>{t("Email")}</FormLabel>
                    <View style={[styles.inputField,{marginLeft:10,marginRight:10}]}>
                        <FormInput value={item["email"]} autoCapitalize="none" autoCorrect={false}
                                   onChangeText={(value) => this.props.changeItemField("email",value)}
                                   inputStyle={styles.inputField}
                                   keyboardType="email-address"
                        />
                    </View>
                    {this.renderFieldErrorMessage("email")}
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