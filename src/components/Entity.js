import React,{Component} from "react";
import {ScreenModes,Models} from "../reducers/RootReducer";
import t from '../utils/translate/translate';
import Store from '../store/Store';
import actions from '../actions/Actions';
import Backend from '../backend/Backend';
import {View,ScrollView,Text,FlatList,TouchableOpacity} from 'react-native'
import {Button,FormValidationMessage,SearchBar,FormInput,FormLabel} from 'react-native-elements'
import DatePicker from 'react-native-datepicker';
import NavigationService from '../utils/NavigationService';
import Icon from 'react-native-vector-icons/FontAwesome'
import moment from "moment-timezone";
import styles from "../styles/Styles";
import SelectInput from 'react-native-select-input-ios';

/**
 * Base class used to represent data model either as list view or detail view
 * All concrete views extends from it
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
                Store.store.getState().screen_mode !== ScreenModes.ITEM ?
                    <Button onPress={() => {
                        NavigationService.openDrawer()
                    }} icon={{name: 'bars', type: 'font-awesome', color: 'white'}}
                            backgroundColor="#339CFF"/>
                    : <Button onPress={() => navigation.state.params.obj.goToList()}
                              icon={{name: 'arrow-left', type: 'font-awesome', color: 'white'}}
                              backgroundColor="#339CFF"/>,
            headerRight:
                Store.store.getState().screen_mode === ScreenModes.ITEM ?
                    <Button onPress={() => navigation.state.params.obj.saveToBackend()}
                            icon={{name: 'check', type: 'font-awesome', color: 'white'}}
                            backgroundColor="#339CFF"/> :
                    <Button onPress={() => {
                            Backend.logout(() => {
                                NavigationService.navigate('Login');
                            });
                        }}
                            icon={{name: 'sign-out', type: 'font-awesome', color: 'white'}}
                            backgroundColor="#339CFF"
                    />
        }
    };

    /**
     * Method used to update data of this form from backend (both for list view and for detail view)
     */
    fetchFromBackend() {
        if (this.props.screenMode === ScreenModes.ITEM) {
            this.props.updateItem(this.props.uid);
        } else {
            this.props.updateList();
        }
    }
    /**
     * Method starts after component rendered and displayed on the screen
     */
    componentDidMount() {
        this.fetchFromBackend();
        Store.store.dispatch(actions.changeProperties({
            'screen':Models[this.props.model].screen,
        }));
    }

    /**
     * Method runs each time when component updated after application state update
     * @param prevProps: Previous props of object
     */
    componentDidUpdate(prevProps) {
        if (prevProps.screenMode !== this.props.screenMode) {
            this.fetchFromBackend();
        }
    }

    /**
     * Main method used to render this view
     * @returns Rendered component
     */
    render() {
        var result = null;
        if (this.props.screenMode === ScreenModes.ITEM) {
            result = this.renderItem();
        } else {
            result = this.renderList();
        }
        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                {result}
            </View>
        )
    }


    /**
     * Method used to render header header navigation for List View
     * @returns Rendered columns
     */
    renderHeaderRow() {
        return (
            <View style={{backgroundColor:'#F3E790',height:54,flexDirection:'row',justifyContent:'space-evenly',
            alignItems:'center'}}>
                <TouchableOpacity onPress={() => this.props.selectAllItems()}>
                    <Icon name={this.props.isAllItemsChecked() ? 'check-square' : 'square-o'}
                          color='#339CFF' size={20} style={{paddingRight:5,paddingLeft:3}}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.openItem('new')}>
                    <Icon name='plus' color='#339CFF' size={20}/>
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
     * Method used to render floating view with Sort order settings, when user presses "Sort" button
     * @returns Rendered element
     */
    renderSortOrderDialog() {
        const buttons = [];
        for (var field in this.props.listColumns) {
            var icon = {};
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
     * Method used to render management buttons for list view
     * @returns Rendered components with buttons
     */
    renderListActionButtons() {
        return [
            <TouchableOpacity onPress={() => this.props.toggleSortOrderDialog(!this.props.showSortOrderDialog)}>
                <Icon name='sort' color='#339CFF' size={20} style={{paddingRight: 5}}/>
            </TouchableOpacity>,
            this.props.selectedItems && this.props.selectedItems.length > 0 ?
                <TouchableOpacity onPress={() => {this.props.deleteItems()}}>
                <Icon name='trash' color='#339CFF' size={20} style={{paddingRight: 5, paddingLeft: 5}}/>
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
        var uid = item.uid.replace(/#/g,'').replace(/\:/g,"_");
        var columns = [];
        for (var field in this.props.listColumns) {
            if (typeof(item[field]) !== "undefined") {
                var field_value = this.props.renderListField(field,item[field]);
                if (!field_value) continue;
                columns.push(
                    <View style={{flex:1,flexDirection:'row',flexGrow:1}}
                          key={'list_row_'+uid+"_"+item[field]+"_container"}>
                        <Text key={'list_row_'+uid+"_"+item[field]+"_text_container"}>
                            <Text style={{fontWeight:'bold',paddingRight:3}}
                                  key={'list_row_'+uid+"_"+item[field]+"_title"}>
                                {this.props.listColumns[field].title}:
                            </Text>
                            <Text style={{paddingLeft:3}} key={'list_row_'+uid+"_"+item[field]}>{field_value}</Text>
                        </Text>
                    </View>
                );
            }
        }
        return (
            <View key={'list_row_'+uid} style={{flex:1,flexDirection:'row'}}>
                <TouchableOpacity key={'list_row_'+uid+"_fields_checkbox"}
                                  onPress={() => this.props.selectItem(item.uid)}>
                    <Icon name={this.props.isItemChecked(item.uid) ? 'check-square' : 'square-o'}
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

    /**
     * Method used to render list view
     * @returns Rendered component
     */
    renderList() {
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
     * Method used to render detail view
     * @returns Rendered component
     */
    renderItem() {
        if (!this.props.item) return null;
        var item = this.initItem();
        return (
            <View style={{ flex: 1, flexDirection: 'column',backgroundColor:'white'}}>
                {this.renderStatusMessages()}
                <ScrollView style={{backgroundColor:'white'}}>
                    <View style={{ flex: 1, flexDirection: 'column',backgroundColor:'white'}}>
                        {this.renderForm(item)}
                        <FormLabel>{""}</FormLabel>
                    </View>
                </ScrollView>
            </View>
        )
    }

    /**
     * Method initializes all properties of item
     * @returns Initialized item
     */
    initItem() {
        return this.props.item;
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
     * Method used to render "Success" and "Error" message blocks on top of form of detail view
     */
    renderStatusMessages() {
        const errors = this.props.errors;
        return [
            this.props.itemSaveSuccessText ?
                <View style={{margin:5,backgroundColor:'#33FF64',
                    paddingTop:3,paddingBottom:3,paddingLeft:3,paddingRight:3,
                    height:30}}>
                    <Text style={{color:'black'}}>
                        {this.props.itemSaveSuccessText}
                    </Text>
                </View>
                : null,
            errors["general"] && errors["general"].length ?
                <View style={{margin:5,backgroundColor:'#F39096',
                    paddingTop:3,paddingBottom:3,paddingLeft:3,paddingRight:3,
                    height:40}}>
                    <Text style={{color:'black'}}>
                        {errors["general"]}
                    </Text>
                </View>
                : null
            ]
    }

    /**
     * Method used to render error message for specified field in form of detail view
     */
    renderFieldErrorMessage(field_name) {
        const errors = this.props.errors;
        return errors[field_name] && errors[field_name].length ?
            <FormValidationMessage>{errors[field_name]}</FormValidationMessage> :
            null
    }

    /**
     * Method used to render standard text input field on form
     * @param name - Name of field
     * @param value - Current value of field
     * @param label - Label of field
     * @param keyboardType - Type of keyboard, used on this field
     * @param multiline - Is text field multiline
     * @returns Rendered element
     */
    renderInputField(name,value,label,keyboardType="default",multiline=false) {
        if (!keyboardType) keyboardType="default";
        if (!multiline) multiline = false;
        return [
            <FormLabel>{t(label)}</FormLabel>,
            <View style={[styles.inputField,{marginLeft:10,marginRight:10}]}>
                <FormInput value={value} autoCaptialize="none" autoCorrect={false}
                           onChangeText={(value) => this.props.changeItemField(name,value)}
                           inputStyle={styles.inputField} keyboardType={keyboardType} multilne={multiline}/>
            </View>,
            this.renderFieldErrorMessage(name)
        ]
    }

    /**
     * Method used to render standard picker field on form
     * @param name - Name of field
     * @param value - Current value of field
     * @param label - Label of field
     * @param items - Array of items, which should be passed to list
     * @returns Rendered element
     */
    renderPickerField(name,value,label,items) {
        return [
            <FormLabel>{t(label)}</FormLabel>,
            <View style={[styles.inputField,{marginLeft:10,marginRight:10}]}>
                <SelectInput options={items} onSubmitEditing={(value) => this.props.changeItemField(name,value)}
                        value={value} style={styles.inputField}
                />
            </View>,
            this.renderFieldErrorMessage(name)
        ]
    }

    /**
     * Method used to render standard Date selection input field
     * @param name - Name of field
     * @param value - Current value of field
     * @param label - Label of field
     * @param mode - Mode of work ("date","datetime")
     * @param format - Format of data display in field
     * @param onChange - function, which handles onChange event of field. Takes two arguments:
     * name - name of field, value - current value
     * @returns Rendered element
     */
    renderDateField(name,value,label,mode="datetime",format="YYYY-MM-DD HH:mm:ss",onChange=this.props.changeItemField) {
        if (!mode) mode="datetime";
        if (!format) format = "YYYY-MM-DD HH:mm:ss";
        if (!onChange) onChange = this.props.changeItemField;
        return [
            <FormLabel>{t(label)}</FormLabel>,
            <View style={[styles.inputField,{marginLeft:10,marginRight:10}]}>
                <DatePicker
                    date={moment(value*1000).format(format)}
                    mode={mode}
                    placeholder={t(label)}
                    format={format}
                    confirmBtnText={t("ОК")}
                    cancelBtnText={t("Отмена")}
                    showIcon={false}
                    onDateChange={(date) => onChange(name,date)}
                    customStyles={{
                        dateInput: styles.inputField
                    }}
                />
            </View>,
            this.renderFieldErrorMessage(name)
        ]
    };
}

export default Entity;