import React from 'react';
import Document from './Document';
import moment from "moment-timezone";
import t from "../../utils/translate/translate";
import {Input,Select,DateTime,Button} from '../ui/Form'
import {StyleSheet} from 'react-native';

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
     * @param labels: Object of labels for items
     * @returns array of rendered components
     */
    renderForm(item,labels) {
        return [
            <Select name="company" value={item["company"]} label={labels["company"]} items={this.props.companies_list} key="re1"/>,
            <Select name="type" value={item["type"]} label={labels["type"]} items={this.props.report_types} key="re2"/>,
            <DateTime name="date" value={item["date"]} label={labels["date"]} key="re3"/>,
            <Select name="period" value={item["period"]} label={labels["period"]} items={Report.getReportPeriods()} key="re4"/>,
            <Input name="email" value={item["email"]} label={labels["email"]} keyboard="email-address" key="re5"/>,
            <Button onPress={this.props.sendByEmail} text={t("Отправить по email")} buttonStyle={Styles.emailButton} key="re6"/>
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

const Styles = StyleSheet.create({
    emailButton: {
        marginTop:10,
        backgroundColor: "#bbdf00",
        marginLeft:10,
        marginRight:10,
        borderColor: "#bbdf00"
    }
});

export default Report;