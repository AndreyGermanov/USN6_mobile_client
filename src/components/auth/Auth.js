/**
 * Collection of Items.
 */

import LoginItem from "./Login";
import RegisterItem from './Register'
import RequestResetPasswordItem from './RequestResetPassword'

export class Auths {
    static Login = LoginItem;
    static Register = RegisterItem;
    static RequestResetPassword = RequestResetPasswordItem;
}

export const Login = LoginItem;
export const Register = RegisterItem;
export const RequestResetPassword = RequestResetPasswordItem;
