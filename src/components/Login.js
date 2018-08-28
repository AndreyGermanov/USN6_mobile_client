import React, { Component } from 'react';
import t from "../utils/translate/translate";
import { FormValidationMessage,Button,FormLabel } from 'react-native-elements';
import {Form,Input} from './ui/Form';
import {View,Text,StyleSheet} from 'react-native';

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
            <View style={Styles.containerStyle}>
                <Form ownerProps={this.props} style={Styles.formStyle}>
                    <View style={Styles.logoContainerStyle}>
                        <Text style={Styles.logoTextStyle}>УСН 6%</Text>
                    </View>
                    <FormValidationMessage>{this.props.errors["general"]}</FormValidationMessage>
                    <Input name="login" value={item["login"]} label="Имя"/>
                    <Input name="password" value={item["password"]} label="Пароль" password={true}/>
                    <FormLabel>{}</FormLabel>
                    <Button title={t("Войти")} onPress={() => this.props.doLogin()}
                            backgroundColor="#ff6600" color="white"
                            icon={{name: 'sign-in', type:'font-awesome', color:"white"}}
                    />
                </Form>
            </View>
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

const Styles = StyleSheet.create({
    containerStyle: {
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        flex:1,
        width:'100%',
        height:'100%',
        backgroundColor:'white'
    },
    formStyle: {
        width:'100%',
        paddingLeft:30,
        paddingRight:30,
        flexDirection:'column',
        justifyContent:'center'
    },
    logoContainerStyle: {
        width:'100%',
        flexDirection:'row',
        justifyContent:'center'
    },
    logoTextStyle: {
        fontWeight: 'bold',
        fontSize: 64,
        color: '#ff6600'
    }
});

export default Login;