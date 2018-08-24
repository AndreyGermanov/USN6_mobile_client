import React from 'react';
import Document from './Document';
import t from '../../utils/translate/translate';
import moment from 'moment-timezone'
import {Input,Select,DateTime} from '../ui/Form';

/**
 * Component used to manage "Income" detail view
 */
class Income extends Document {

    static listTitle = t("Список операций прихода");
    static itemTitle = t("Приход");

    // Navigation bar specific options
    static navigationOptions = ({navigation}) => {
        const result = Document.navigationOpts(navigation);
        result['title'] = Income.listTitle;
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
            <Input name="number" value={item["number"]} label="Номер документа" keyboard="numeric"/>,
            <DateTime name="date" value={item["date"]} label="Дата документа"/>,
            <Input name="amount" value={item["amount"]} label="Сумма дохода" keyboard="decimal-pad"/>,
            <Input name="description" value={item["description"]} label="Описание операции" multiline={true}/>
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
        if (!item.number) item.number = ''; else item.number = item.number.toString();
        if (!item.date) item.date = moment().unix();
        if (!item.amount) item.amount = ''; else item.amount = item.amount.toString();
        return item;
    }
}

export default Income;