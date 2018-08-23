import React from 'react';
import EntityList from './EntityList';
import {View,ScrollView,TouchableOpacity} from 'react-native';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome'
import {DateTime} from '../ui/Form';

/**
 * Base component to manage lists of documents. All documents inherits from it
 */
class DocumentList extends EntityList {

    // Navigation options for all descendants of DocumentList
    static navigationOpts = () => {
        return EntityList.navigationOpts();
    };

    /**
     * Method used to show dialog to set date period, used to display list of documents
     * @returns {null}
     */
    renderPeriodSelectionDialog() {
        return (
            <ScrollView style={{flex:1,flexDirection:'column'}}>
                <View style={
                    {
                        backgroundColor:"#ffffff",borderWidth:1,borderColor:"#000000",flex:1,flexDirection:'column'
                    }
                }>
                    <DateTime name="periodStart" value={this.props.periodStart} label="Дата начала"
                              onChange={this.props.changePeriodField} ownerProps={this.props}/>
                    <DateTime name="periodEnd" value={this.props.periodEnd} label="Дата окончания"
                              onChange={this.props.changePeriodField} ownerProps={this.props}/>
                </View>
            </ScrollView>
        )
    }

    /**
     * Method used to render management buttons for list view
     * @returns Rendered components with buttons
     */
    renderListActionButtons() {
        let buttons = super.renderListActionButtons();
        buttons.unshift(
            <TouchableOpacity
                onPress={() => this.props.togglePeriodSelectionDialog(!this.props.showPeriodSelectionDialog)}>
                <IconFontAwesome name="calendar-o" color='#339CFF' size={20} style={{paddingRight: 5}}/>
            </TouchableOpacity>);
        return buttons;
    }

}

export default DocumentList;