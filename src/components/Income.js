import React from 'react';
import Document from './Document';
import t from '../utils/translate/translate';
import moment from 'moment-timezone'
import Entity from "./Entity";

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
     * Method used to render contents of form in detail view
     * @param item: Entity to display in the form
     * @returns array of rendered components
     */
    renderForm(item) {
        return [
            this.renderPickerField("company",item["company"],"Организация",this.props.companies_list),
            this.renderInputField ("number",item["number"],"Номер документа","numeric"),
            this.renderDateField  ("data",item["date"],"Дата документа"),
            this.renderInputField ("amount",item["amount"],"Сумма дохода","decimal-pad"),
            this.renderInputField ("description",item["description"],"Описание операции","default",true)
        ]
    }
}

export default Income;