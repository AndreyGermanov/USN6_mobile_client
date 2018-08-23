import Entity from './Entity'
import React from "react";
import t from '../utils/translate/translate';
import {Input,Select} from './ui/Form';

/**
 * Component used to manage "Companies" page (both list and item views)
 */
class Company extends Entity {

    static listTitle = t("Организации");
    static itemTitle = t("Организация");

    // Navigation bar specific options
    static navigationOptions = ({navigation}) => {
        const result = Entity.navigationOpts(navigation);
        result['title'] = Company.listTitle;
        return result;
    };

    /**
     * Method used to render contents of form in detail view
     * @param item: Entity to display in the form
     * @returns array of rendered components
     */
    renderForm(item) {
        return [
            <Input name="name" value={item["name"]} label="Имя"/>,
            <Select name="type" value={item["type"]} label="Тип" items={Company.getTypesList()}/>,
            <Input name="inn" value={item["inn"]} label="ИНН" keyboard="numeric"/>,
            item["type"] === 2 ? <Input name="kpp" value={item["kpp"]} label="КПП" keyboard="numeric"/> : null,
            <Input name="address" value={item["address"]} label="Адрес" multiline={true}/>
        ]
    }

    /**
     * Method returns list of options for "Тип" dropdown
     */
    static getTypesList() {
        return [
            {label:t("Индивидуальный предприниматель"),value:1},
            {label:t("Общество с ограниченной ответственностью"),value:2}
        ]
    }

    /**
     * Method initializes all properties of item
     * @returns Initialized item
     */
    initItem() {
        const item = this.props.item;
        if (!item.name) item.name = '';
        if (!item.inn) item.inn = '';
        if (!item.kpp) item.kpp = '';
        if (!item.address) item.address = '';
        if (!item.type) item.type = 1;
        return item;
    }
}

export default Company;