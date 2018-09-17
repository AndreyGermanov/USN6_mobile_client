import React from 'react';
import t from "../../utils/translate/translate";
import {Form,Input,Button} from '../ui/Form';
import {View,Text,StyleSheet} from 'react-native';
import NavigationService from '../../utils/NavigationService';
import Entity from '../items/Entity';

/**
 * Component used to display user login screen
 */
class Login extends Entity {

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
                        <Text style={Styles.logoTextStyle}>{t("УСН 6%")}</Text>
                    </View>
                    {this.renderStatusMessages()}
                    <Input name="login" value={item["login"]} label={t("Имя")}/>
                    <Input name="password" value={item["password"]} label={t("Пароль")} password={true}/>
                    <Button text={t("Забыл пароль")+" ?"} buttonStyle={Styles.resetPasswordButtonStyle}
                            onPress={() => NavigationService.navigate("RequestResetPassword")}
                            buttonTextStyle={Styles.resetPasswordButtonTextStyle}
                            />
                    <Button text={t("Войти")} onPress={() => this.props.doLogin()}
                            buttonContainerStyle={Styles.loginButtonStyle}/>
                    <Button text={t("Регистрация")} onPress={()=>NavigationService.navigate("Register")}/>
                </Form>
            </View>
        )
    }

    componentDidMount() {}

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
    },
    loginButtonStyle: {
        marginBottom:10
    },
    resetPasswordButtonStyle: {
        backgroundColor: 'white',
        borderWidth:0,
        marginBottom:10
    },
    resetPasswordButtonTextStyle: {
        color: '#ff6600',
        fontSize: 12
    }
});

export default Login;