import React,{Component} from 'react';
import t from "../../utils/translate/translate";
import NavigationService from "../../utils/NavigationService";
import Backend from "../../backend/Backend";
import {Text,View,TouchableOpacity,FlatList,StyleSheet} from 'react-native';
import {SearchBar} from 'react-native-elements';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import IconMaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import Divider from '../ui/HeaderBarDivider';
import {Button,PopupWindow} from '../ui/Form';

/**
 * Base class which renders list of items
 * All concrete list views extends from it
 */
class Entity extends Component {

    // Base Navigation bar options. All components uses it as a base
    static navigationOpts = () => {
        return {
            headerStyle: Styles.headerStyle,
            headerTitleStyle: Styles.headerTitleStyle,
            title: Entity.listTitle,
            headerLeft:
                <TouchableOpacity onPress={() => NavigationService.openDrawer()} key="t1">
                    <IconFontAwesome style={Styles.headerLeftButton} name="bars" color="white" size={24}/>
                </TouchableOpacity>,
            headerRight:
                <TouchableOpacity onPress={() => Backend.logout()} key="t2">
                    <IconFontAwesome style={Styles.headerRightButton} name="sign-out" color="white" size={24}/>
                </TouchableOpacity>
        }
    };

    /**
     * Main method used to render this view
     * @returns Rendered component
     */
    render() {
        const self = this;
        return [
            <View style={Styles.rootContainer} key="r1">
                {this.renderHeaderRow()}
                <FlatList data={this.props.list} style={Styles.flatList}
                          renderItem={({item}) => this.renderListRow.bind(self)(item)}
                          keyExtractor={(item, index) => index.toString()}
                          onEndReached={() => {
                              if (this.props.list.length < this.props.numberOfItems) {
                                  this.props.changeListPage(this.props.pageNumber + 1, true);
                              }
                          }}
                />
            </View>,
            <PopupWindow title={t("Сортировка")} ownerProps={this.props} key="r2"
                         visible={this.props.sortOrderDialogVisible}>
                {this.renderSortOrderDialog()}
            </PopupWindow>
        ];
    }

    /**
     * Method used to render header header navigation for List View
     * @returns Rendered columns
     */
    renderHeaderRow() {
        return (
            <View style={{flexDirection:'column'}}>
                <View style={Styles.listHeaderContainer}>
                    <SearchBar
                        containerStyle={Styles.searchBarContainer}
                        inputStyle={Styles.searchBar}
                        icon={{ type: 'font-awesome', name: 'search' }}
                        clearIcon={{type: 'font-awesome', name: 'times'}}
                        onChangeText={(text) => this.props.changeListFilter(text)}
                        placeholder={t("Поиск")}/>
                </View>
                <View style={Styles.headerButtonBar}>
                    <TouchableOpacity onPress={() => this.props.selectAllItems()}>
                        <View style={Styles.checkAllButtonContainer}>
                            <IconFontAwesome name={this.props.isAllItemsChecked() ? 'check-square' : 'square-o'}
                                  color='white' size={20} style={Styles.checkAllIcon}/>
                            <Text style={Styles.headerBarIconText}>{t("Выделить все")}</Text>
                        </View>
                    </TouchableOpacity>
                    <Divider/>
                    <TouchableOpacity onPress={() => this.props.openItem('new')}>
                        <View style={Styles.headerBarIconContainer}>
                            <IconFontAwesome name='plus' color='white' size={20}/>
                            <Text style={Styles.headerBarIconText}>{t("Добавить")}</Text>
                        </View>
                    </TouchableOpacity>
                    <Divider/>
                    {this.renderListActionButtons()}
                </View>
            </View>
        )
    }

    /**
     * Method used to render management buttons for list view
     * @returns Rendered components with buttons
     */
    renderListActionButtons() {
        return [
            <TouchableOpacity onPress={() => this.props.openSortOrderDialog()} key="b1">
                <View style={Styles.headerBarIconContainer}>
                    <IconFontAwesome name='sort' color='white' size={20} style={Styles.headerBarSortIcon}/>
                    <Text style={Styles.headerBarIconText}>{t("Упорядочить")}</Text>
                </View>
            </TouchableOpacity>,
            this.props.selectedItems && this.props.selectedItems.length > 0 ? [
                <Divider key="b2"/>,
                <TouchableOpacity onPress={() => {this.props.deleteItems()}} key="b3">
                    <View style={Styles.headerBarIconContainer}>
                        <IconFontAwesome name='trash' color='white' size={20} style={Styles.headerBarDeleteIcon}/>
                        <Text style={Styles.headerBarIconText}>{t("Удалить")}</Text>
                    </View>
                </TouchableOpacity>]
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
        const checkboxStyle = {paddingLeft:5,color:this.props.isItemChecked(item.uid) ? '#db2525' : '#d7dbdf'};
        return (
            <View key={'list_row_'+this.props.collectionName+"_"+uid} style={Styles.listRowContainer}>
                <TouchableOpacity onPress={() => this.props.selectItem(item.uid)}>
                    <IconFontAwesome name={this.props.isItemChecked(item.uid) ? 'check-square' : 'square-o'}
                          color='#' size={20} style={checkboxStyle}/>
                </TouchableOpacity>
                <View style={Styles.listRowContent}>
                    {columns}
                </View>
                <View style={Styles.listRowOpenIconContainer}>
                    <TouchableOpacity onPress={() => this.props.openItem(uid)}>
                        <IconMaterialCommunity size={45} style={Styles.listRowOpenIcon} name="arrow-right-drop-circle"/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    renderListRowColumns(uid,item) {
        const columns = [];
        let counter = 0;
        for (let field in this.props.listColumns) {
            if (!this.props.listColumns.hasOwnProperty(field)) continue;
            if (typeof(item[field]) === "undefined")
                continue;
            const field_value = this.props.renderListField(field,item[field]);
            let field_color = 'black';
            switch (field) {
                case 'date':
                    field_color = '#db2525';
                    break;
                case 'company':
                    field_color = '#ff6600';
                    break;
            }
            const field_style = {paddingLeft:3,color:field_color};
            if (!field_value) continue;
            columns.push(
                <View style={Styles.listRowColumnContainer} key={'list_row_'+this.props.collectionName+"_"+uid+"_"+(counter++)}>
                    <Text style={Styles.listRowColumnTitle}>
                        {this.props.listColumns[field].title}:
                    </Text>
                    <Text style={field_style}>
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
            let icon = <IconFontAwesome name='sort-down' color="#ff6600" style={[Styles.sortOrderIcon,{opacity:0}]}/>;
            if (this.props.sortOrder.field === field) {
                if (this.props.sortOrder.direction === "ASC")
                    icon = <IconFontAwesome name='arrow-down' color="#ff6600" style={Styles.sortOrderIcon}/>;
                if (this.props.sortOrder.direction === "DESC")
                    icon = <IconFontAwesome name='arrow-up' color="#ff6600" style={Styles.sortOrderIcon}/>
            }
            buttons.push(
                <TouchableOpacity onPress={this.props.changeListSortOrder.bind(this,field)} key={"sortOrderBtn_"+field}>
                    <View style={Styles.sortOrderFieldContainer}>
                        {icon}
                        <Text>{this.props.listColumns[field].title}</Text>
                    </View>
                </TouchableOpacity>
            );
        }
        buttons.push(<Button onPress={this.props.hidePopupWindow} text={t("Закрыть")} key="sortOrderCloseBtn"/>);
        return buttons
    }

    /**
     * Method starts after component rendered and displayed on the screen
     */
    componentDidMount() {
        this.props.updateList();
    }
}

const Styles = StyleSheet.create({
    headerStyle:{
        backgroundColor: '#ff6600',
        elevation:0
    },
    headerTitleStyle: {
        color: 'white'
    },
    rootContainer: {flex:1,
        flexDirection:'column',
        backgroundColor:'white'
    },
    flatList: {paddingRight:5},
    headerButtonBar: {
        flexDirection:'row',
        justifyContent:'space-evenly',
        alignItems:'center',
        height:65,
        backgroundColor:"#3e4552"
    },
    listHeaderContainer: {
        backgroundColor:'#ff6600',
        height:54,
        flexDirection:'row',
        justifyContent:'space-evenly',
        alignItems:'center'
    },
    headerLeftButton: {paddingLeft:10},
    headerRightButton: {paddingRight:10},
    searchBarContainer: {
        backgroundColor:'#ff6600',
        borderTopWidth:0,
        borderBottomWidth:0,
        flex:1
    },
    searchBar: {
        backgroundColor:'white',
        justifyContent:'center'
    },
    checkAllButtonContainer: {
        flexDirection:'column',
        height:'100%',
        alignItems:'center',
        justifyContent:'center'
    },
    checkAllIcon: {
        paddingRight:5,
        paddingLeft:3
    },
    headerBarIconContainer: {
        flexDirection:'column',
        alignItems:'center'
    },
    headerBarIconText: {color:'white'},
    headerBarSortIcon: {paddingRight: 5},
    headerBarDeleteIcon: {
        paddingRight: 5,
        paddingLeft: 5
    },
    listRowContainer: {
        flex:1,
        flexDirection:'row',
        paddingTop:20,
        paddingLeft:20,
        paddingRight:10
    },
    listRowContent: {
        flex:1,
        flexDirection:'column',
        paddingBottom:3,
        paddingLeft:10,
        paddingRight:3,
        backgroundColor:'white'
    },
    listRowOpenIconContainer: {
        flexDirection:'column',
        justifyContent:'center'
    },
    listRowOpenIcon: {color:'#bbdf00'},
    listRowColumnContainer: {
        flex:1,
        flexDirection:'row',
        flexGrow:1
    },
    listRowColumnTitle: {
        fontWeight:'bold',
        paddingRight:3,
        color:'#3e4552'
    },
    sortOrderFieldContainer: {
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        marginBottom:10
    },
    sortOrderIcon: {
        marginRight:5
    },
    sortOrderButton: {
        backgroundColor:'#ff6600',
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding:5,
        borderWidth:1,
        borderColor:'#ff6600',
        borderRadius:5
    },
    sortOrderButtonText: {
        color:'white'
    }
});

export default Entity;