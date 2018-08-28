import React from 'react';
import { DrawerItems, SafeAreaView } from 'react-navigation';
import {ScrollView,View,TouchableOpacity} from 'react-native';
import IconFeather from 'react-native-vector-icons/Feather';
import NavigationService from '../utils/NavigationService';

/**
 * Component which manages Application Main menu
 */
const MainMenu = (props) => {

    return (
        <ScrollView>
            <SafeAreaView style={{flex:1}} forceInset={{ top: 'always', horizontal: 'never' }}>
                <DrawerItems {...props}/>
            </SafeAreaView>
        </ScrollView>
    )
};

export default MainMenu;
