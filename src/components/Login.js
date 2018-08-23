import React, { Component } from 'react';
import t from "../utils/translate/translate";
import { FormValidationMessage,Button,FormLabel } from 'react-native-elements';
import {Form,Input} from './ui/Form';

/**
 * Component used to display user login screen
 */
class Login extends Component {

    // Navigation bar specific options
    static navigationOptions = () => {
        return {
            header: null
        }
    };

    /**
     * Method used to render view
     */
    render() {
        const item = this.initItem();
        return (
            <Form ownerProps={this.props}>
                <FormValidationMessage>{this.props.errors["general"]}</FormValidationMessage>
                <Input name="login" value={item["login"]} label="Имя"/>
                <Input name="password" value={item["password"]} label="Пароль" password={true}/>
                <FormLabel>{}</FormLabel>
                <Button title={t("Войти")} onPress={() => this.props.doLogin()}
                        backgroundColor="#339CFF" color="white"
                        icon={{name: 'sign-in', type:'font-awesome', color:"white"}}
                />
            </Form>
        )
    }

    /**
     * Method initializes all properties of item
     * @returns Initialized item
     */
    initItem() {
        const item = this.props.item;
        if (!item.login) item.login = '';
        if (!item.password) item.password = '';
        return item;
    }
}

export default Login;