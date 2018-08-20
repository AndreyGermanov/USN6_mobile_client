import Entity from './Entity';
import React from "react";
import t from '../utils/translate/translate';
import styles from "../styles/Styles";
import Picker from 'react-native-picker-select';
import {FormLabel,FormInput} from 'react-native-elements';
import {View,ScrollView} from 'react-native';

/**
 * Component used to manage "Accounts" page (both list and item views)
 */
class Account extends Entity {

    static listTitle = t("Банковские счета");
    static itemTitle = t("Банковский счет");

    // Navigation bar specific options
    static navigationOptions = ({navigation}) => {
        var result = Entity.navigationOpts(navigation);
        result['title'] = Account.listTitle;
        return result;
    }

    /**
     * Method initializes all properties of item
     * @returns Initialized item
     */
    initItem() {
        var item = this.props.item;
        if (!item.bank_name) item.bank_name = '';
        if (!item.company) item.company = '';
        if (!item.number) item.number = '';
        if (!item.bik) item.bik = '';
        if (!item.ks) item.ks = '';
        return item;
    }

    /**
     * Method used to render detail view
     */
    renderItem() {
        if (!this.props.item) return null;
        const item = this.initItem();
        return (
            <View style={{ flex: 1, flexDirection: 'column',backgroundColor:'white'}}>
                {this.renderStatusMessages()}
                <ScrollView style={{backgroundColor:'white'}}>
                    <View style={{ flex: 1, flexDirection: 'column',backgroundColor:'white'}}>
                        {this.renderPickerField("company",item["company"],"Организация",self.props.companies_list)}
                        {this.renderInputField("bank_name",item["bank_name"],"Банк")}
                        {this.renderInputField("bik",item["bik"],"БИК","numeric")}
                        {this.renderInputField("number",item["number"],"Номер счета","numeric")}
                        {this.renderInputField("ks",item["ks"],"Корр. счет","numeric")}
                        <FormLabel>{""}</FormLabel>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

export default Account;