import React,{Component} from "react";
import {View,ScrollView,TouchableOpacity,Text,StyleSheet} from 'react-native'
import {Form,StatusMessage} from '../ui/Form';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome'

/**
 * Base class used to render item of list
 * All concrete detail views extends from it
 */
class Entity extends Component {

    // Base Navigation bar options. All components uses it as a base
    static navigationOpts = (navigation) => {
        return {
            headerStyle: Styles.headerStyle,
            headerTitleStyle: Styles.headerTitleStyle,
            title: Entity.listTitle,
            headerLeft:
                 <TouchableOpacity onPress={() => navigation.state.params.model.getItemView().goToList()}>
                       <IconFontAwesome style={Styles.leftButtonStyle} name='arrow-left' color='white' size={24}/>
                 </TouchableOpacity>,
            headerRight:
                <TouchableOpacity onPress={() => navigation.state.params.model.getItemView().saveToBackend()}>
                    <IconFontAwesome style={Styles.rightButtonStyle} name='check' color='white' size={24}/>
                </TouchableOpacity>
        }
    };

    /**
     * Main method used to render this view
     * @returns Rendered component
     */
    render() {
        if (!this.props.item) return null;
        const item = this.props.initItem(this.props.item);
        const labels = this.props.getFieldLabels();
        return (
            <View style={Styles.bodyContainer}>
                {this.renderStatusMessages()}
                <ScrollView>
                    <Form ownerProps={this.props}>
                        {this.renderForm(item,labels)}
                        <Text>{""}</Text>
                    </Form>
                </ScrollView>
            </View>
        )
    }

    /**
     * Method used to render "Success" and "Error" message blocks on top of form of detail view
     */
    renderStatusMessages() {
        const errors = this.props.errors;
        return [
            this.props.itemSaveSuccessText ?
                <StatusMessage key="e1" type={StatusMessage.types.SUCCESS} message={this.props.itemSaveSuccessText}/> : null,
            errors["general"] && errors["general"].length ?
                <StatusMessage key="e2" type={StatusMessage.types.ERROR} message={errors["general"]}/> : null
        ]
    }

    /**
     * Method used to render contents of form in detail view
     * @param item: Entity to display in the form
     * @param labels: Object of labels for items
     * @returns array of rendered components
     */
    renderForm(item,labels) {
        return []
    }

    /**
     * Method initializes all properties of item
     * @returns Initialized item
     */
    initItem() {
        return this.props.item;
    }

    /**
     * Method starts after component rendered and displayed on the screen
     */
    componentDidMount() {
        this.props.updateItem(this.props.uid);
    }
}

const Styles = StyleSheet.create({
    headerStyle: {
        backgroundColor: '#ff6600',
        elevation: 0
    },
    headerTitleStyle: {color: 'white'},
    leftButtonStyle: {paddingLeft:10},
    rightButtonStyle: {paddingRight:10},
    bodyContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor:'white'
    }
});

export default Entity;