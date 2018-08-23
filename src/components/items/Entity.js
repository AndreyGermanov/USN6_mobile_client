import React,{Component} from "react";
import {View,ScrollView} from 'react-native'
import {Button,FormLabel} from 'react-native-elements'
import {Form,StatusMessage} from '../ui/Form';

/**
 * Base class used to render item of list
 * All concrete detail views extends from it
 */
class Entity extends Component {

    // Base Navigation bar options. All components uses it as a base
    static navigationOpts = (navigation) => {
        return {
            headerStyle: {
                backgroundColor: '#339CFF'
            },
            headerTitleStyle: {
                color: 'white'
            },
            title: Entity.listTitle,
            headerLeft:
                 <Button onPress={() => navigation.state.params.obj.goToList()}
                              icon={{name: 'arrow-left', type: 'font-awesome', color: 'white'}}
                              backgroundColor="#339CFF"/>,
            headerRight:
                <Button onPress={() => navigation.state.params.obj.saveToBackend()}
                        icon={{name: 'check', type: 'font-awesome', color: 'white'}}
                        backgroundColor="#339CFF"/>
        }
    };

    /**
     * Main method used to render this view
     * @returns Rendered component
     */
    render() {
        if (!this.props.item) return null;
        const item = this.initItem();
        return (
            <View style={{ flex: 1, flexDirection: 'column',backgroundColor:'white'}}>
                {this.renderStatusMessages()}
                <ScrollView>
                    <Form ownerProps={this.props}>
                        {this.renderForm(item)}
                        <FormLabel>{""}</FormLabel>
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
                <StatusMessage type={StatusMessage.types.SUCCESS} message={this.props.itemSaveSuccessText}/> : null,
            errors["general"] && errors["general"].length ?
                <StatusMessage type={StatusMessage.types.ERROR} message={errors["general"]}/> : null
        ]
    }

    /**
     * Method used to render contents of form in detail view
     * @param item: Entity to display in the form
     * @returns array of rendered components
     */
    renderForm(item) {
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

export default Entity;