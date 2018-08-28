import React from 'react';
import Document from './Document';
import moment from "moment-timezone";
import t from "../../utils/translate/translate";
import {FormLabel,Button} from 'react-native-elements';
import {Input,Select,DateTime} from '../ui/Form';

/**
 * Component used to manage "Report" detail view.
 */
class Report extends Document {

    static listTitle = t("Отчеты");
    static itemTitle = t("Отчет");

    // Navigation bar specific options
    static navigationOptions = ({navigation}) => {
        const result = Document.navigationOpts(navigation);
        result['title'] = Report.listTitle;
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
            <Select name="type" value={item["type"]} label="Тип отчета" items={this.props.report_types}/>,
            <DateTime name="date" value={item["date"]} label="Дата"/>,
            <Select name="period" value={item["period"]} label="Период отчета" items={Report.getReportPeriods()}/>,
            <Input name="email" value={item["email"]} label="Email" keyboard="email-address"/>,
            <Button icon={{name: 'envelope', type:'font-awesome', color:"white"}}
                    title={t('Отправить по email')}
                    backgroundColor="#bbdf00" color="white" buttonStyle={{borderRadius:5,elevation:0,marginTop:10}}
                    onPress={()=>this.props.sendByEmail.bind(this)()}
            />
        ]
    }

    /**
     * Method returns list of periods for "Период отчета" dropdown
     * @returns {Array}
     */
    static getReportPeriods() {
        const years = [];
        let startYear = (new Date()).getFullYear()-1;
        for (let i=0;i<11;i++) {
            startYear += 1;
            years.push({value:moment(startYear+"-01-01").unix(),label:startYear+" "+t("г.")})
        }
        return years;
    }
}

export default Report;