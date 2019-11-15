import React, { Component  } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, SafeAreaView, Image } from 'react-native';
import { createAppContainer } from 'react-navigation';
import {  createDrawerNavigator, DrawerItems  } from 'react-navigation-drawer';
import { createStackNavigator  } from 'react-navigation-stack';
import styles from './styles/Styles';
import HomeScreen from './screens/HomeScreen.component';
import WeeklyScheduleScreen from './screens/WeeklyScheduleScreen.component';


const headerConfigs = { 
	headerTitleStyle: {
	    marginRight: 'auto',
	    marginLeft: 'auto',
	    color: '#fff'
	},
	headerStyle: {
	    backgroundColor: 'black',
	}
	    
       }

const HomeNavigator = createStackNavigator(
    {
   	 Home: HomeScreen,
    },
    {
	defaultNavigationOptions: headerConfigs 
    }
);

const WeeklyNavigator = createStackNavigator(
    {
	Weekly : WeeklyScheduleScreen,
    },
    {
	defaultNavigationOptions: headerConfigs,
    }
)

const CustomDrawerContentComponent = props => (
    <ScrollView>
    <SafeAreaView style = {{ flex:1 }} forceInset={{ top: 'always' , horizontal : 'never' }} >
	<Image style={{width:280, height:200}} source = {require('./assets/navigationheader.jpg')}/> 
	<DrawerItems  {...props} />
    </SafeAreaView>
    </ScrollView>
)



const DrawerNav = createDrawerNavigator({

  Home: HomeNavigator,
  'Weekly Schedule': WeeklyNavigator,

},
{
    drawerBackgroundColor: 'black',
    contentOptions : {
	    activeTintColor: '#eb9834',
	    inactiveTintColor: '#faf9f5',
	},
    contentComponent : CustomDrawerContentComponent,
    hideStatusBar : 'true'

}

)

const AppContainer = createAppContainer(DrawerNav);

export default class App extends Component {
    render() {
	return <AppContainer />;
    }
}



