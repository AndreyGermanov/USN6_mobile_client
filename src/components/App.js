import React, { Component } from 'react';
import {ScreenModes} from "../reducers/RootReducer";
import {Account} from '../containers/Account';
import {Income} from '../containers/Income';
import {Spending} from '../containers/Spending';
import {Report} from '../containers/Report';
import {Company} from '../containers/Company';
import Store from '../store/Store';
import actions from '../actions/Actions'
import { createSwitchNavigator, createStackNavigator,createDrawerNavigator } from 'react-navigation';
import LoadingScreen from '../components/Loading';
import {Login} from '../containers/Login';
import NavigationService from '../utils/NavigationService';

/**
 * Main application components, used to display navigation and current application screen
 */
const RootNavigator = createSwitchNavigator(
    {
        AuthLoading: LoadingScreen,
        Auth: createStackNavigator({Login: Login}),
        App: createDrawerNavigator({
            "Доходы": createStackNavigator({income: Income}),
            "Расходы": createStackNavigator({spending: Spending}),
            "Отчеты": createStackNavigator({report:Report}),
            "Организации": createStackNavigator({company:Company}),
            "Банковские счета": createStackNavigator({account: Account}),
        })
    },
    {
        initialRouteName: 'AuthLoading',
    }
);

/**
 * Main application component. Runs when application starts. Used to setup Navigation subsystem and display first
 * "Loading" screen, which then manages application flow depending on user status (Authenticated or not authenticated)
 */
const App = class extends Component {
    render() {
        return (
            <RootNavigator ref={navigatorRef => NavigationService.setTopLevelNavigator(navigatorRef)}/>
        )
    }
}

export default App;
