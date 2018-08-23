import React from 'react';
import Document from './Document';
import t from '../utils/translate/translate';
import moment from 'moment-timezone'
import Entity from "./Entity";
import {Input,Select,DateTime} from './ui/Form';

/**
 * Component used to manage "Spendings" page (both list and item views)
 */
class Spending extends Document {

    static listTitle = t("Список операций расхода");
    static itemTitle = t("Расход");

    // Navigation bar specific options
    static navigationOptions = ({navigation}) => {
        const result = Entity.navigationOpts(navigation);
        result['title'] = Spending.listTitle;
        return result;
    };

    /**
     * Method used to render contents of form in detail view
     * @param item: Entity to display in the form
     * @returns array of rendered components
     */
    renderForm(item) {
        return [
            <Select name="company" value={item["company"]} label="Организация" items={this.props.companies_list}/>,
            <Select name="type" value={item["type"]} label="Тип расхода" items={this.props.spending_types}/>,
            <Input name="number" value={item["number"]} label="Номер документа" keyboard="numeric"/>,
            <DateTime name="date" value={item["date"]} label="Дата документа"/>,
            <Input name="period" value={item["period"]} label="Период расхода"/>,
            <Input type="amount" value={item["amount"]} label="Сумма расхода" keyboard="decimal-pad"/>,
            <Input type="description" value={item["description"]} label="Описание операции" multiline={true}/>
        ]
    }

    /**
     * Method initializes all properties of item
     * @returns Initialized item
     */
    initItem() {
        const item = this.props.item;
        if (!item.description) item.description = '';
        if (!item.company) item.company = '';
        if (!item.number) item.number = '';else item.number = item.number.toString();
        if (!item.date) item.date = moment().unix();
        if (!item.amount) item.amount = '';else item.amount = item.amount.toString();
        if (!item.type) item.type = 1;
        if (!item.period) item.period = '';
        return item;
    }
}

export default Spending;