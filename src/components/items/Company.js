import Entity from './Entity'
import React from "react";
import t from '../../utils/translate/translate';
import {Input,Select} from '../ui/Form';

/**
 * Component used to manage "Company" detail view
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
     * @param labels: Object of labels for items
     * @returns array of rendered components
     */
    renderForm(item,labels) {
        return [
            <Input name="name" value={item["name"]} label={labels["name"]}/>,
            <Select name="type" value={item["type"]} label={labels["type"]} items={Company.getTypesList()}/>,
            <Input name="inn" value={item["inn"]} label={labels["inn"]} keyboard="numeric"/>,
            item["type"] === 2 ? <Input name="kpp" value={labels["kpp"]} label={t("КПП")} keyboard="numeric"/> : null,
            <Input name="address" value={item["address"]} label={labels["address"]} multiline={true}/>
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
}

export default Company;