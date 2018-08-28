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
            initialRouteName: 'Companies',
            contentOptions: {
                activeTintColor: 'white',
                inactiveTintColor: 'white',
                itemStyle: {borderBottomWidth:1,borderBottomColor:'#3f4654',borderTopColor:'#3a414d',borderTopWidth:2}
            },
            drawerBackgroundColor: '#3e4552',
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
            screen: createStackNavigator({incomes: List.getComponentOf("income"),income: Item.getComponentOf("income")}),
            navigationOptions: {
                title: t("Доходы"),
                drawerIcon: ({tintColor}) => <IconFontAwesome name="file-text-o" color={tintColor} size={16}/>
            },
        },
        Spendings: {
            screen: createStackNavigator({spendings: List.getComponentOf("spending"),spending: Item.getComponentOf("spending")}),
            navigationOptions: {
                title: t("Расходы"),
                drawerIcon: ({tintColor}) => <IconFontAwesome name="file-text-o" color={tintColor} size={16}/>
            }
        },
        Reports: {
            screen: createStackNavigator({reports: List.getComponentOf("report"),report:Item.getComponentOf("report")}),
            navigationOptions: {
                title: t("Отчеты"),
                drawerIcon: ({tintColor}) => <IconFoundation name="book" color={tintColor} size={20}/>
            }
        },
        Companies: {
            screen: createStackNavigator({companies: List.getComponentOf("company"),company:Item.getComponentOf("company")}),
            navigationOptions: {
                title: t("Организации"),
                drawerIcon: ({tintColor}) => <IconFontAwesome name="building-o" color={tintColor} size={16}/>
            }
        },
        Accounts: {
            screen: createStackNavigator({accounts: List.getComponentOf("account"),account: Item.getComponentOf("account")}),
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