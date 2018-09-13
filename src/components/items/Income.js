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
     * @param labels: Object of labels for items
     * @returns array of rendered components
     */
    renderForm(item,labels) {
        return [
            <Select name="company" value={item["company"]} label={labels["company"]} key="i1" items={this.props.companies_list}/>,
            <Input name="number" value={item["number"]} label={labels["number"]} keyboard="numeric" key="i2"/>,
            <DateTime name="date" value={item["date"]} label={labels["date"]} key="i3"/>,
            <Input name="amount" value={item["amount"]} label={labels["amount"]} keyboard="decimal-pad" key="i4"/>,
            <Input name="description" value={item["description"]} label={labels["description"]} multiline={true} key="i5"/>
        ]
    }
}

export default Income;