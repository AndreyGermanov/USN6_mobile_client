/**
 * Set of methods used to work with React Navigation
 */

import { NavigationActions,DrawerActions,StackActions } from 'react-navigation';

let _navigator;

/**
 * Main basic function which sets navigator
 * @param navigatorRef
 */
function setTopLevelNavigator(navigatorRef) {
    if (navigatorRef && typeof(navigatorRef)!=="undefined") {
        _navigator = navigatorRef;
    }
}

/**
 * Moves to specified screen
 * @param routeName: Name of screen to move to
 * @param params: Custom navigation params
 */
function navigate(routeName, params) {
    if (!_navigator || typeof(_navigator)==="undefined") return;
    _navigator.dispatch(
        NavigationActions.navigate({
            routeName,
            params,
        })
    );
}

/**
 * Pushes new screen to navigation stack, even if it the same screen
 * @param routeName: Name of screen to push
 * @param params: Additional navigation params
 */
function push(routeName, params) {
    if (!_navigator || typeof(_navigator)==="undefined") return;
    _navigator.dispatch(
        StackActions.push({
            routeName,
            params,
        })
    );
}

/**
 * Replaces current navigation stack with specified screen
 * @param routeName: Screen to display
 * @param params: Additional navigation params
 */
function replace(routeName, params) {
    if (!_navigator || typeof(_navigator)==="undefined") return;
    _navigator.dispatch(
        StackActions.replace({
            routeName,
            params,
        })
    );
}

/**
 * Method used to open left side navigation menu (Navigation drawer)
 */
function openDrawer() {
    if (!_navigator || typeof(_navigator)==="undefined") return;
    _navigator.dispatch(
        DrawerActions.openDrawer()
    );
}

/**
 * Method used to send additional params to navigator
 * @param params: Params to send
 */
function setParams(params) {
    if (!_navigator || typeof(_navigator)==="undefined") return;
    _navigator.dispatch(
        NavigationActions.setParams(params)
    )
}

export default {
    navigate,
    setTopLevelNavigator,
    openDrawer,
    setParams,
    push,
    replace
};