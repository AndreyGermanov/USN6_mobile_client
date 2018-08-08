import Entity from './Entity'
import React from "react";
import t from '../utils/translate/translate';
import {View,ScrollView} from 'react-native';
import {FormInput,FormLabel} from 'react-native-elements';
import Picker from 'react-native-picker-select';
import styles from '../styles/Styles';

/**
 * Component used to manage "Companies" page (both list and item views)
 */
class Company extends Entity {

    static listTitle = t("Организации");
    static itemTitle = t("Организация");

    // Navigation bar specific options
    static navigationOptions = ({navigation}) => {
        var result = Entity.navigationOpts(navigation);
        result['title'] = Company.listTitle;
        return result;
    }

    /**
     * Method initializes all properties of item
     * @returns Initialized item
     */
    initItem() {
        var item = this.props.item;
        if (!item.name) item.name = '';
        if (!item.inn) item.inn = '';
        if (!item.kpp) item.kpp = '';
        if (!item.address) item.address = '';
        if (!item.type) item.type = 1;
        return item;
    }

    /**
     * Method used to render detail view
     */
    renderItem() {
        const item = this.initItem();
        return (
            <View style={{ flex: 1, flexDirection: 'column',backgroundColor:'white'}}>
                {this.renderStatusMessages()}
                <ScrollView style={{backgroundColor:'white'}}>
                    <View style={{ flex: 1, flexDirection: 'column',backgroundColor:'white'}}>
                        <FormLabel>{t("Имя")}</FormLabel>
                        <FormInput value={item["name"]} autoCapitalize="none" autoCorrect={false}
                                   inputStyle={styles.inputField}
                                   onChangeText={(value) => this.props.changeItemField("name",value)}/>
                        {this.renderFieldErrorMessage("name")}
                        <FormLabel>{t("Тип")}</FormLabel>
                        <Picker items={
                            [
                                {label:t("Индивидуальный предприниматель"),value:1},
                                {label:t("Общество с ограниченной ответственностью"),value:2}
                            ]
                        } onValueChange={(value,index) => this.props.changeItemField("type",parseInt(index))}
                                value={parseInt(item["type"])}
                                style={styles.inputField}
                        />
                        {this.renderFieldErrorMessage("type")}
                        <FormLabel>{t("ИНН")}</FormLabel>
                        <FormInput value={item["inn"]} autoCapitalize="none" autoCorrect={false}
                                   onChangeText={(value) => this.props.changeItemField("inn",value)}
                                   inputStyle={styles.inputField}
                                   keyboardType="numeric"
                        />
                        {this.renderFieldErrorMessage("inn")}
                        {item["type"] === 2 ?
                            <View style={{ flex: 1, flexDirection: 'column',backgroundColor:'white'}}>
                                <FormLabel>{t("КПП")}</FormLabel>
                                <FormInput value={item["kpp"]} autoCapitalize="none" autoCorrect={false}
                                    onChangeText={(value) => this.props.changeItemField("kpp",value)}
                                    inputStyle={styles.inputField}
                                    keyboardType="numeric"
                                />
                                {this.renderFieldErrorMessage("kpp")}
                            </View>
                        : null}
                        <FormLabel>{t("Адрес")}</FormLabel>
                        <FormInput value={item["address"]} autoCapitalize="none" autoCorrect={false}
                                   onChangeText={(value) => this.props.changeItemField("address",value)}
                                   inputStyle={styles.inputField}
                                   mulitline={true}
                        />
                        {this.renderFieldErrorMessage("address")}
                    </View>
                </ScrollView>
            </View>
        )
    }
}

export default Company;