import React from 'react';
import ScreenComponent from './ScreenComponent';
import {View,Text,Modal,Dimensions,StyleSheet,TouchableOpacity} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PropTypes from 'prop-types'
import IconFeather from 'react-native-vector-icons/Feather';

/**
 * Component which renders modal windows
 */
class PopupWindow extends ScreenComponent {

    // types of properties which component can accept
    static propTypes = Object.assign({},{
        // Title of popup window
        title: PropTypes.string.isRequired,
        // Is popup window currently visible
        visible: PropTypes.bool
    },ScreenComponent.propTypes);

    /**
     * Method which shows component on the screen
     * @returns Rendered component
     */
    render() {
        const props = this.getProps();
        const dims = Dimensions.get('window');
        return(
            <Modal
                animationType="slide"
                transparent={true}
                visible={props.visible}
                onRequestClose={() => {
                    props.ownerProps.hidePopupWindow()
                }}>
                <KeyboardAwareScrollView contentContainerStyle={Styles.scrollViewContentStyle}>
                    <View style={Styles.outerContainer}>
                        <View style={[Styles.innerContainer,{width:dims.width-30}]}>
                            <View style={Styles.titleContainer}>
                                <Text style={{color:'white'}}>{props.title}</Text>
                                <TouchableOpacity onPress={
                                    () => props.ownerProps.hidePopupWindow()
                                }>
                                    <IconFeather name="x" color='white' size={15}/>
                                </TouchableOpacity>
                            </View>
                            <View style={Styles.contentContainer}>
                                {this.props.children}
                            </View>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </Modal>
        )
    }

    /**
     * Method used to fill default values for "props" of component
     * @returns this.props filled with default values
     */
    getProps() {
        let result = super.getProps();
        result.title = result.title ? result.title : '';
        result.visible = result.visible ? result.visible: false;
        result.content = result.content ? result.content: null;
        return result;
    }
}

const Styles = StyleSheet.create({
    scrollViewContentStyle: {
        flex:1,
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center'
    },
    outerContainer: {
        flex:1,
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center'
    },
    innerContainer: {
        backgroundColor:'white',
        width:"90%",
        borderRadius:5,
        borderWidth: 2,
        borderColor: '#ff6600',
        justifyContent:'flex-start'
    },
    titleContainer: {
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingTop:4,
        paddingBottom:4,
        borderWidth:2,
        borderColor:'#ff6600',
        backgroundColor:'#ff6600'
    },
    contentContainer: {
        flexDirection:'column',
        paddingTop:5,
        paddingBottom:10,
        paddingLeft:10,
        paddingRight:10
    }
});

export default PopupWindow;
