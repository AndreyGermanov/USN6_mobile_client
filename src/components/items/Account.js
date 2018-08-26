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
     * @returns array of rendered components
     */
    renderForm(item) {
        return [
            <Select name="company" value={item["company"]} label="Организация" items={this.props.companies_list}/>,
            <Input name="bank_name" value={item["bank_name"]} label="Банк"/>,
            <Input name="bik" value={item["bik"]} label="БИК" keyboard="numeric"/>,
            <Input name="number" value={item["number"]} label="Номер счета" keyboard="numeric"/>,
            <Input name="ks" value={item["ks"]} label="Корр. счет" keyboard="numeric"/>
        ]
    }
}

export default Account;