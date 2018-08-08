import React, { Component } from 'react';
import t from "../utils/translate/translate";
import {View,Text} from 'react-native';
import Backend from '../backend/Backend';
import NavigationService from '../utils/NavigationService';
import {ScreenModes} from '../reducers/RootReducer';

class Loading extends Component {

    /**
     * Method tries to login to backend using authentication token
     * in browser cookie during initial screen load.
     */
    tryLogin() {
        Backend.login(null,null, function(err) {
            if (!err) {
                NavigationService.navigate('income',{screen_mode: ScreenModes.LIST});
            } else {
                NavigationService.navigate('Login');
            }
        });
    }

    /**
     * Method runs when component first loaded. Used to start login process
     */
    componentDidMount() {
        var self = this;
        setTimeout(() => {
            self.tryLogin();
        },5000);
    }

    /**
     * Method shows component on the screen
     */
    render() {
        return (
            <View><Text>{t("Загрузка ...")}</Text></View>
        )
    }
}

export default Loading
