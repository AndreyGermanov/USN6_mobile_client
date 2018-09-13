import React from 'react';
import t from "../../utils/translate/translate";
import {Input,Button} from '../ui/Form';
import Entity from '../items/Entity';
import NavigationService from '../../utils/NavigationService';
import {StyleSheet, TouchableOpacity} from 'react-native';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome'

class Register extends Entity {

    // Navigation bar specific options
    static navigationOptions = ({navigation}) => {
        const result = Entity.navigationOpts(navigation);
        result['title'] = t("Регистрация");
        result["headerLeft"] =
            <TouchableOpacity onPress={() => NavigationService.navigate("Login")}>
                <IconFontAwesome style={Styles.leftButtonStyle} name='arrow-left' color='white' size={24}/>
            </TouchableOpacity>;
        result["headerRight"] = null;
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
            <Input name="name" value={item["name"]} label={labels["name"]} key="f1"/>,
            <Input name="password" value={item["password"]} label={labels["password"]} password={true}  key="f2"/>,
            <Input name="confirm_password" value={item["confirm_password"]}
                   label={labels["confirm_password"]} password={true} key="f3"/>,
            <Input name="email" value={item["email"]} label={labels["email"]}  key="f4"/>,
            <Button onPress={() => this.props.saveToBackend()} text={t("Отправить")}
                    buttonContainerStyle={Styles.sendButtonStyle} key="f5"/>
        ]
    }
}

const Styles = StyleSheet.create({
    leftButtonStyle: {paddingLeft:10},
    rightButtonStyle: {paddingRight:10},
    sendButtonStyle: {marginLeft:10,marginRight:10}
});

export default Register;