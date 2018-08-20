import React, { Component } from 'react';
import t from "../utils/translate/translate";
import { FormLabel, FormInput, FormValidationMessage,Button } from 'react-native-elements';
import {View} from 'react-native';
import Style from '../styles/Styles'

/**
 * Component used to display user login screen
 */
class Login extends Component {

    // Navigation bar specific options
    static navigationOptions = (navigation) => {
        return {
            header: null
        }
    }

    /**
     * Method initializes all properties of item
     * @returns Initialized item
     */
    initItem() {
        var item = this.props.item;
        if (!item.login) item.login = '';
        if (!item.password) item.password = '';
        return item;
    }

    /**
     * Method used to render view
     */
    render() {
        this.initItem();
        return (
            <View style={{ flex: 1, flexDirection: 'column',backgroundColor:'white'}}>
                <FormValidationMessage>{this.props.errors["general"]}</FormValidationMessage>
                <FormLabel>{t("Имя")}</FormLabel>
                <FormInput inputStyle={Style.inputField} value={this.props.item["login"]}
                           autoCapitalize="none" autoCorrect={false}
                           onChangeText={(value) => this.props.changeItemField("login",value)}/>
                <FormValidationMessage>{this.props.errors["login"]}</FormValidationMessage>
                <FormLabel>{t("Пароль")}</FormLabel>
                <FormInput inputStyle={Style.inputField} value={this.props.item["password"]}
                           autoCapitalize="none" autoCorrect={false}
                           onChangeText={(value) => this.props.changeItemField("password",value)}
                           secureTextEntry={true}/>
                <FormValidationMessage>{this.props.errors["password"]}</FormValidationMessage>
                <Button title={t("Войти")} onPress={() => this.props.doLogin()}
                    backgroundColor="#339CFF" color="white"
                    icon={{name: 'sign-in', type:'font-awesome', color:"white"}}
                />
            </View>
        )
    }
}

export default Login;