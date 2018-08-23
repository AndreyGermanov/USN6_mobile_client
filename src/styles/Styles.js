/*****************************************************
 * Styles definitions for various parts of interface *
 *****************************************************/
import {StyleSheet} from 'react-native';

const listHeaderContainer = {
    backgroundColor:'#F3E790',
    height:54,
    flexDirection:'row',
    justifyContent:'space-evenly',
    alignItems:'center'
};

const form = {
    flex: 1,
    flexDirection: 'column',
    backgroundColor:'white'
};

const inputField = {
    backgroundColor: "#dddddd",
    color: 'black',
    borderWidth:0
};

const fieldContainer = {
    marginLeft:10,
    marginRight:10
};

Object.assign(fieldContainer,inputField);

const successMessageBackground = {
    margin:5,
    backgroundColor:'#33FF64',
    paddingTop:3,
    paddingBottom:3,
    paddingLeft:3,
    paddingRight:3,
    height:30};

const errorMessageBackground = {
    margin:5,
    backgroundColor:'#F39096',
    paddingTop:3,
    paddingBottom:3,
    paddingLeft:3,
    paddingRight:3,
    height:40
};

const customMessageBackground = {
    margin:5,
    backgroundColor:'#99CCFF',
    paddingTop:3,
    paddingBottom:3,
    paddingLeft:3,
    paddingRight:3,
    height:30,
    borderWidth:1,
    borderColor:'black'
};
const messageText = {
    color:'black'
};

export default StyleSheet.create({
    inputField: inputField,
    inputIOS: {
        backgroundColor: "#dddddd",
        color: 'black'
    },
    inputAndroid: {
        backgroundColor: "#dddddd",
        color: 'black'
    },
    listHeaderContainer: listHeaderContainer,
    form: form,
    fieldContainer: fieldContainer,
    successMessageText: messageText,
    successMessageBackground: successMessageBackground,
    errorMessageText: messageText,
    errorMessageBackground: errorMessageBackground,
    customMessageText: messageText,
    customMessageBackground: customMessageBackground
})