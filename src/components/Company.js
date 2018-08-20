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
     * Method returns list of options for "Тип" dropdown
     */
    getTypesList() {
        return [
            {label:t("Индивидуальный предприниматель"),value:1},
            {label:t("Общество с ограниченной ответственностью"),value:2}
        ]
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
                        {this.renderInputField("name",item["name"],"Имя")}
                        {this.renderPickerField("type",item["type"],"Тип",this.getTypesList())}
                        {this.renderInputField("inn",item["inn"],"ИНН","numeric")}
                        {item["type"] === 2 ?
                            <View style={{ flex: 1, flexDirection: 'column',backgroundColor:'white'}}>
                                {this.renderInputField("kpp",item["kpp"],"КПП","numeric")}
                            </View>
                        : null}
                        {this.renderInputField("address",item["address"],"Адрес","default",true)}
                    </View>
                </ScrollView>
            </View>
        )
    }
}

export default Company;