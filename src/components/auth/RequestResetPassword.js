import React from 'react';
import t from "../../utils/translate/translate";
import {Input,Button} from '../ui/Form';
import Entity from '../items/Entity';
import NavigationService from "../../utils/NavigationService";
import {StyleSheet,TouchableOpacity} from "react-native";
import IconFontAwesome from 'react-native-vector-icons/FontAwesome'

class RequestResetPassword extends Entity {

    // Navigation bar specific options
    static navigationOptions = ({navigation}) => {
        const result = Entity.navigationOpts(navigation);
        result['title'] = t("Изменить пароль");
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
            <Input name="email" value={item["email"]} label={labels["email"]}/>,
            <Button onPress={() => this.props.saveToBackend()} text={t("Отправить")}
                    buttonStyle={Styles.sendButtonStyle}/>
        ]
    }
}

const Styles = StyleSheet.create({
    leftButtonStyle: {paddingLeft:10},
    rightButtonStyle: {paddingRight:10},
    sendButtonStyle: {marginLeft:10,marginRight:10}
});
export default RequestResetPassword;