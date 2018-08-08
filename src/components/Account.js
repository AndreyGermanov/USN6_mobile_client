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
                        <FormLabel>{t("Организация")}</FormLabel>
                        <Picker items={this.props.companies_list}
                                onValueChange={(value) => {this.props.changeItemField("company",value)}}
                                value={item["company"]}
                                style={styles.inputField}
                        />
                        {this.renderFieldErrorMessage("company")}
                        <FormLabel>{t("Банк")}</FormLabel>
                        <View style={[styles.inputField,{marginLeft:10,marginRight:10}]}>
                            <FormInput value={item["bank_name"]} autoCapitalize="none" autoCorrect={false}
                                       onChangeText={(value) => this.props.changeItemField("bank_name",value)}
                                       inputStyle={styles.inputField}
                            />
                        </View>
                        {this.renderFieldErrorMessage("bank_name")}
                        <FormLabel>{t("БИК")}</FormLabel>
                        <View style={[styles.inputField,{marginLeft:10,marginRight:10}]}>
                            <FormInput value={item["bik"]} autoCapitalize="none" autoCorrect={false}
                                       onChangeText={(value) => this.props.changeItemField("bik",value)}
                                       inputStyle={styles.inputField}
                                       keyboardType="numeric"
                            />
                        </View>
                        {this.renderFieldErrorMessage("bik")}
                        <FormLabel>{t("Номер счета")}</FormLabel>
                        <View style={[styles.inputField,{marginLeft:10,marginRight:10}]}>
                            <FormInput value={item["number"]} autoCapitalize="none" autoCorrect={false}
                                       onChangeText={(value) => this.props.changeItemField("number",value)}
                                       inputStyle={styles.inputField}
                                       keyboardType="numeric"
                            />
                        </View>
                        {this.renderFieldErrorMessage("number")}
                        <FormLabel>{t("Корр.счет")}</FormLabel>
                        <View style={[styles.inputField,{marginLeft:10,marginRight:10}]}>
                            <FormInput value={item["ks"]} autoCapitalize="none" autoCorrect={false}
                                       onChangeText={(value) => this.props.changeItemField("ks",value)}
                                       inputStyle={styles.inputField}
                                       keyboardType="numeric"
                            />
                        </View>
                        {this.renderFieldErrorMessage("ks")}
                        <FormLabel>{""}</FormLabel>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

export default Account;