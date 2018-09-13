import Entity from './Entity';
import React from "react";
import t from '../../utils/translate/translate';
import {Input,Select} from '../ui/Form';

/**
 * Component used to manage "Account" detail view
 */
class Account extends Entity {

    static listTitle = t("Банковские счета");
    static itemTitle = t("Банковский счет");

    // Navigation bar specific options
    static navigationOptions = ({navigation}) => {
        const result = Entity.navigationOpts(navigation);
        result['title'] = Account.listTitle;
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
            <Select name="company" value={item["company"]} label={labels["company"]} key="a1" items={this.props.companies_list}/>,
            <Input name="bank_name" value={item["bank_name"]} label={labels["bank_name"]} key="a2"/>,
            <Input name="bik" value={item["bik"]} label={labels["bik"]} keyboard="numeric" key="a3"/>,
            <Input name="number" value={item["number"]} label={labels["number"]} keyboard="numeric" key="a4"/>,
            <Input name="ks" value={item["ks"]} label={labels["ks"]} keyboard="numeric" key="a5"/>
        ]
    }
}

export default Account;