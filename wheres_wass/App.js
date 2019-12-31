import React, { Component  } from 'react';
import { StyleSheet, 
	 Text, 
	 View, 
	 Button,
	 Image, 
         ScrollView, 
         SafeAreaView } from 'react-native';
import { createAppContainer } from 'react-navigation';
import {  createDrawerNavigator, DrawerItems  } from 'react-navigation-drawer';
import { createStackNavigator  } from 'react-navigation-stack';
import styles from './styles/Styles';
import HomeScreen from './screens/HomeScreen.component';
import WeeklyScheduleScreen from './screens/WeeklyScheduleScreen.component';
import InformationScreen from './screens/InformationScreen.component';
import QueueScreen from './screens/QueueScreen.component';
import AgendaScreen from './screens/MonthlyScheduleScreen.component2';
import LoginScreen from './screens/LoginScreen.component';
import AccountScreen from './screens/AccountScreen.component';
import CreateAccountScreen from './screens/CreateAccount.component';
import AdminPortalScreen from './screens/Admin.component';
import WaitlistScreen from './screens/WaitlistScreen.component';

const headerConfigs = { 
    headerTitleStyle: {
	flexGrow:1,
	color: '#fff'
    },
    headerStyle: {
	backgroundColor: 'black',
    }
	    
}

const HomeNavigator = createStackNavigator(
    {
        Home: HomeScreen,
        AdminPortal : AdminPortalScreen,
        Waitlist: WaitlistScreen

    },
    {
	defaultNavigationOptions: headerConfigs 
    }
)

const WeeklyNavigator = createStackNavigator(
    {
	Weekly : WeeklyScheduleScreen,
    },
    {
	defaultNavigationOptions: headerConfigs,
    }
)

const InfoNavigator = createStackNavigator(
    {
	Info: InformationScreen
    },
    {
	defaultNavigationOptions: headerConfigs
    }
)

const QueueNavigator = createStackNavigator(
    {
	Queue: QueueScreen
    },
    {
	defaultNavigationOptions: headerConfigs
    }
)
const AccountNavigator = createStackNavigator(
    {
        Account: {
            screen : AccountScreen
        },
        Login: {
            screen : LoginScreen
        },
        CreateAccount: {
            screen : CreateAccountScreen
        }
    },
    {
        defaultNavigationOptions: headerConfigs,
        initialRouteName : 'Account'
    }
)
const CustomDrawerContentComponent = props => (
	<ScrollView>
	<SafeAreaView style = {{ flex:1 }} forceInset={{ top: 'always' , horizontal: 'never' }}>
		<Image style={{width:280, height:200}} source = {require('./assets/navigationheader.jpg')}/>
		<DrawerItems {...props}/>
	</SafeAreaView>
	</ScrollView>
)


const DrawerNav = createDrawerNavigator({
  Home: HomeNavigator,
  'Weekly Schedule': WeeklyNavigator,
  'About Us': InfoNavigator,
  Queue: QueueNavigator,
  Account : AccountNavigator
},
{
    drawerBackgroundColor: 'black',
    contentOptions : {
	    activeTintColor: '#eb9834',
	    inactiveTintColor: '#faf9f5',
	},
     contentComponent : CustomDrawerContentComponent,
     hideStatusBar : 'true',
}

)

const AppContainer = createAppContainer(DrawerNav);

export default class App extends Component {
    render() {
	return <AppContainer />;
    }
}



