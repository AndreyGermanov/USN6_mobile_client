import React from 'react';
import Document from './Document';
import t from '../../utils/translate/translate';
import moment from 'moment-timezone'
import {Input,Select,DateTime} from '../ui/Form';

/**
 * Component used to manage "Spending" detail view
 */
class Spending extends Document {

    static listTitle = t("Список операций расхода");
    static itemTitle = t("Расход");

    // Navigation bar specific options
    static navigationOptions = ({navigation}) => {
        const result = Document.navigationOpts(navigation);
        result['title'] = Spending.listTitle;
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
            <Select name="company" value={item["company"]} label={labels["company"]} items={this.props.companies_list}/>,
            <Select name="type" value={item["type"]} label={labels["type"]} items={this.props.spending_types}/>,
            <Input name="number" value={item["number"]} label={labels["number"]} keyboard="numeric"/>,
            <DateTime name="date" value={item["date"]} label={labels["date"]}/>,
            <Input name="period" value={item["period"]} label={labels["period"]}/>,
            <Input name="amount" value={item["amount"]} label={labels["amount"]} keyboard="decimal-pad"/>,
            <Input name="description" value={item["description"]} label={labels["description"]} multiline={true}/>
        ]
    }
}

export default Spending;