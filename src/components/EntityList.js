import React,{Component} from 'react';
import t from "../utils/translate/translate";
import NavigationService from "../utils/NavigationService";
import Entity from "./Entity";
import Backend from "../backend/Backend";
import {Text,View,TouchableOpacity,FlatList,ScrollView} from 'react-native';
import {Button,SearchBar} from 'react-native-elements';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome'
import Styles from '../styles/Styles';

/**
 * Base class which renders list of items
 * All concrete list views extends from it
 */
class EntityList extends Component {

    // Base Navigation bar options. All components uses it as a base
    static navigationOpts = () => {
        return {
            headerStyle: {
                backgroundColor: '#339CFF'
            },
            headerTitleStyle: {
                color: 'white'
            },
            title: Entity.listTitle,
            headerLeft:
                <Button onPress={() => {
                    NavigationService.openDrawer()
                }} icon={{name: 'bars', type: 'font-awesome', color: 'white'}}
                        backgroundColor="#339CFF"/>,
            headerRight:
                <Button onPress={() => {
                    Backend.logout(() => {
                        NavigationService.navigate('Login');
                    })
                }}
                        icon={{name: 'sign-out', type: 'font-awesome', color: 'white'}}
                        backgroundColor="#339CFF"
                />
        }
    };

    /**
     * Main method used to render this view
     * @returns Rendered component
     */
    render() {
        const self = this;
        return (
            <View style={{flex:1,flexDirection:'column'}}>
                {this.renderHeaderRow()}
                {this.props.showSortOrderDialog ? this.renderSortOrderDialog() : null}
                {this.props.showPeriodSelectionDialog ? this.renderPeriodSelectionDialog() : null}
                {!this.props.showSortOrderDialog && !this.props.showPeriodSelectionDialog ?
                    <FlatList data={this.props.list} style={{paddingRight:5}}
                              renderItem={({item}) => this.renderListRow.bind(self)(item)}
                              onEndReached={() => {
                                  if (this.props.list.length < this.props.numberOfItems) {
                                      this.props.changeListPage(this.props.pageNumber + 1, true);
                                  }
                              }}
                    /> : null }
            </View>
        )
    }

    /**
     * Method used to render header header navigation for List View
     * @returns Rendered columns
     */
    renderHeaderRow() {
        return (
            <View style={Styles.listHeaderContainer}>
                <TouchableOpacity onPress={() => this.props.selectAllItems()}>
                    <IconFontAwesome name={this.props.isAllItemsChecked() ? 'check-square' : 'square-o'}
                          color='#339CFF' size={20} style={{paddingRight:5,paddingLeft:3}}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.openItem('new')}>
                    <IconFontAwesome name='plus' color='#339CFF' size={20}/>
                </TouchableOpacity>
                <SearchBar
                    containerStyle={{backgroundColor:'#F3E790',borderTopWidth:0,borderBottomWidth:0,flex:1}}
                    inputStyle={{backgroundColor:'white',justifyContent:'center'}}
                    icon={{ type: 'font-awesome', name: 'search' }}
                    clearIcon={{type: 'font-awesome', name: 'times'}}
                    onChangeText={(text) => this.props.changeListFilter(text)}
                    placeholder={t("Поиск")}/>
                {this.renderListActionButtons()}
            </View>
        )
    }

    /**
     * Method used to render management buttons for list view
     * @returns Rendered components with buttons
     */
    renderListActionButtons() {
        return [
            <TouchableOpacity onPress={() => this.props.toggleSortOrderDialog(!this.props.showSortOrderDialog)}>
                <IconFontAwesome name='sort' color='#339CFF' size={20} style={{paddingRight: 5}}/>
            </TouchableOpacity>,
            this.props.selectedItems && this.props.selectedItems.length > 0 ?
                <TouchableOpacity onPress={() => {this.props.deleteItems()}}>
                    <IconFontAwesome name='trash' color='#339CFF' size={20} style={{paddingRight: 5, paddingLeft: 5}}/>
                </TouchableOpacity>
                : null
        ];
    }

    /**
     * Method used to render individual row in table of List view
     * @param item: Data item for which need to render row
     * @returns Rendered row
     */
    renderListRow(item) {
        const uid = item.uid.replace(/#/g,'').replace(/:/g,"_");
        const columns = this.renderListRowColumns(uid,item);
        return (
            <View key={'list_row_'+uid} style={{flex:1,flexDirection:'row'}}>
                <TouchableOpacity key={'list_row_'+uid+"_fields_checkbox"}
                                  onPress={() => this.props.selectItem(item.uid)}>
                    <IconFontAwesome name={this.props.isItemChecked(item.uid) ? 'check-square' : 'square-o'}
                          color='#339CFF' size={20} style={{paddingTop:5,paddingLeft:5}}/>
                </TouchableOpacity>
                <TouchableOpacity key={'list_row_'+uid+"_fields_list"} onPress={() => this.props.openItem(uid)}>
                    <View key={'list_row_'+uid+"_fields"} style={{flex:1,flexDirection:'column',
                        marginTop:5,marginBottom:5,marginLeft:5,marginRight:5,
                        paddingTop:3,paddingBottom:3,paddingLeft:3,paddingRight:3,
                        backgroundColor:'white'}}>
                        {columns}
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    renderListRowColumns(uid,item) {
        const columns = [];
        for (let field in this.props.listColumns) {
            if (!this.props.listColumns.hasOwnProperty(field)) continue;
            if (typeof(item[field]) === "undefined")
                continue;
            const field_value = this.props.renderListField(field,item[field]);
            if (!field_value) continue;
            columns.push(
                <View style={{flex:1,flexDirection:'row',flexGrow:1}} key={'list_row_'+uid+"_"+item[field]}>
                    <Text style={{fontWeight:'bold',paddingRight:3}}
                          key={'list_row_'+uid+"_"+item[field]+"_title"}>
                        {this.props.listColumns[field].title}:
                    </Text>
                    <Text style={{paddingLeft:3}} key={'list_row_'+uid+"_"+item[field]}>
                        {field_value}
                    </Text>
                </View>
            );
        }
        return columns
    }

    /**
     * Method used to render floating view with Sort order settings, when user presses "Sort" button
     * @returns Rendered element
     */
    renderSortOrderDialog() {
        const buttons = [];
        for (let field in this.props.listColumns) {
            if (!this.props.listColumns.hasOwnProperty(field)) continue;
            let icon = {};
            if (this.props.sortOrder.field === field) {
                if (this.props.sortOrder.direction === "ASC")
                    icon = {name: "sort-down", type: 'font-awesome',color:"#000000"};
                if (this.props.sortOrder.direction === "DESC")
                    icon = {name: "sort-up", type: 'font-awesome',color:"#000000"};
            }
            buttons.push(<Button backgroundColor="#ffffff" leftIcon={icon} color="#000000"
                                 title={this.props.listColumns[field].title}
                                 onPress={this.props.changeListSortOrder.bind(this,field)}/>)
        }
        return (
            <ScrollView style={{flex:1,flexDirection:'column'}}>
                <View style={
                    {   backgroundColor:"#ffffff",borderWidth:1,borderColor:"#000000",flex:1,flexDirection:'column',
                        alignItems:'center'
                    }
                }>
                    <Text style={{fontWeight:"bold"}}>Сортировать по:</Text>
                    {buttons}
                </View>
            </ScrollView>
        )
    }

    /**
     * Method starts after component rendered and displayed on the screen
     */
    componentDidMount() {
        this.props.updateList();
    }
}

export default EntityList;