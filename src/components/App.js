import React, { Component } from 'react';
import NavigationService from '../utils/NavigationService';
import RootNavigator from './RootNavigator';

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
};

export default App;
