/*****************************************************
 * Styles definitions for various parts of interface *
 *****************************************************/
import {StyleSheet} from 'react-native';

const listHeaderContainer = {
    backgroundColor:'#ff6600',
    height:54,
    flexDirection:'row',
    justifyContent:'space-evenly',
    alignItems:'center'
};

const form = {
    flex: 1,
    flexDirection: 'column',
    backgroundColor:'#faf9f8',
    paddingTop:10
};

const inputField = {
    backgroundColor: "#ffffff",
    borderRadius:5,
    borderTopWidth:1,
    borderTopColor:'#e6e6e6',
    borderBottomWidth:1,
    borderBottomColor:'#e6e6e6',
    borderLeftWidth:1,
    borderLeftColor:'#e6e6e6',
    borderRightWidth:1,
    borderRightColor:'#e6e6e6',
    color: 'black',
    borderWidth:0,
    width:'100%'
};

const fieldContainer = {
    marginLeft:10,
    marginRight:10,
    borderTopWidth:1,
    borderRadius:5,
    borderTopColor:'black',
    paddingTop:15,
    paddingBottom:15,
    paddingLeft:15,
    paddingRight:15
};

Object.assign(fieldContainer,inputField);

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
})