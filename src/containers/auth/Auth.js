import LoginContainer from './Login'
import RegisterContainer from './Register';
import RequestResetPasswordContainer from './RequestResetPassword'

/**
 * Factory to get instances of Item containers and connected components
 */
export default class Auth {

    // Cache of created instances
    static instances = {};

    static createInstanceOf(componentName) {
        switch (componentName) {
            case "login": return new LoginContainer();
            case "register": return new RegisterContainer();
            case "request_reset_password": return new RequestResetPasswordContainer();
            default: return null;
        }
    }

    /**
     * Returns instance of Detail view container for specified database model
     * @param componentName: Name of model
     */
    static getInstanceOf(componentName) {
        if (!Auth.instances[componentName])
            Auth.instances[componentName] = Auth.createInstanceOf(componentName);
        return Auth.instances[componentName];
    }

    /**
     * Returns instance of wired Container component
     * @param componentName: Name of model
     */
    static getComponentOf(componentName) {
        switch (componentName) {
            case "login": return LoginContainer.getComponent();
            case "register": return RegisterContainer.getComponent();
            case "request_reset_password": return RequestResetPasswordContainer.getComponent();
            default: return null;
        }
    }
}