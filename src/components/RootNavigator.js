import React from "react";
import { createSwitchNavigator, createStackNavigator,createDrawerNavigator } from "react-navigation";
import {Item, List} from "../containers/Containers";
import LoadingScreen from "./Loading";
import {Login} from "../containers/Login";
import NavigationService from '../utils/NavigationService';
import MainMenu from "./MainMenu";
import t from '../utils/translate/translate';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import IconFontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import IconFoundation from 'react-native-vector-icons/Foundation';

/**
 * Component which implements application navigation (from react-navigation package)
 */
const RootNavigator = createSwitchNavigator(
    getNavigationStacks(),
    {
        initialRouteName: 'AuthLoading',
    }
);

/**
 * Returns configuration of navigation subsystems:
 * (Authentication screens, Application main menu, and "Loading ..." screen)
 */
function getNavigationStacks() {
    return {
        AuthLoading: LoadingScreen,
        Auth: createStackNavigator({Login: Login}),
        App: createDrawerNavigator(getMainMenuStack(),{
            initialRouteName: 'Incomes',
            contentOptions: {
                activeTintColor: 'black',
                inactiveTintColor: 'black'
            },
            contentComponent: (props) => <MainMenu {...props} onItemPress={
                ({route}) => {
                    mainMenuClick(route);
                }
            }/>
        })
    }
}

/**
 * Returns configuration of items of Main Menu Drawer
 */
function getMainMenuStack() {
    return {
        Incomes: {
            screen: createStackNavigator({incomes: List.Income,income: Item.Income}),
            navigationOptions: {
                title: t("Доходы"),
                drawerIcon: ({tintColor}) => <IconFontAwesome name="file-text-o" color={tintColor} size={16}/>
            },
        },
        Spendings: {
            screen: createStackNavigator({spendings: List.Spending,spending: Item.Spending}),
            navigationOptions: {
                title: t("Расходы"),
                drawerIcon: ({tintColor}) => <IconFontAwesome name="file-text-o" color={tintColor} size={16}/>
            }
        },
        Reports: {
            screen: createStackNavigator({reports: List.Report,report:Item.Report}),
            navigationOptions: {
                title: t("Отчеты"),
                drawerIcon: ({tintColor}) => <IconFoundation name="book" color={tintColor} size={20}/>
            }
        },
        Companies: {
            screen: createStackNavigator({companies: List.Company,company:Item.Company}),
            navigationOptions: {
                title: t("Организации"),
                drawerIcon: ({tintColor}) => <IconFontAwesome name="building-o" color={tintColor} size={16}/>
            }
        },
        Accounts: {
            screen: createStackNavigator({accounts: List.Account,account: Item.Account}),
            navigationOptions: {
                title: t("Банковские счета"),
                drawerIcon: ({tintColor}) => <IconFontAwesome5 name="coins" color={tintColor} size={16}/>
            }
        }
    }
}

/**
 * Main menu item click handler
 * @param route: Selected item (route)
 */
function mainMenuClick(route) {
    NavigationService.navigate(route.key.toLowerCase());
}

export default RootNavigator;