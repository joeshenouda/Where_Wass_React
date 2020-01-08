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
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { FontAwesome } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen.component';
import WeeklyScheduleScreen from './screens/WeeklyScheduleScreen.component';
import InformationScreen from './screens/InformationScreen.component';
import AccountScreen from './screens/AccountScreen.component';
import CreateAccountScreen from './screens/CreateAccount.component';
import AdminPortalScreen from './screens/Admin.component';
import WaitlistScreen from './screens/WaitlistScreen.component';
import InStoreWaitlistScreen from './screens/InStoreWaitlist.component';

const headerConfigs = { 
    headerTitleStyle: {
        flexGrow:1,
        color: '#fff'
    },
    headerStyle: {
	    backgroundColor: 'black',
    }
	    
}

const InStoreWaitlistStack = createStackNavigator(
    {
        InStoreWaitlist : InStoreWaitlistScreen
    },
    {
        headerMode : 'none'
    }
)

InStoreWaitlistStack.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index == 0) {
      tabBarVisible = false;
    }
  
    return {
      tabBarVisible,
    };
  };

const AdminPortalTabs = createBottomTabNavigator(
    {
        'Admin Portal' : AdminPortalScreen,
        Waitlist : WaitlistScreen,
        InStoreWaitlist : InStoreWaitlistStack
    },
)

AdminPortalTabs.navigationOptions = ({ navigation }) => {
    const { routeName } = navigation.state.routes[navigation.state.index];
  
    // You can do whatever you like here to pick the title based on the route name
    const headerTitle = routeName;

    if(routeName == 'InStoreWaitlist'){
        return{
            headerTitle : 'In Store Waitlist',
            headerLeft : null,
            headerTitleAlign : 'center'
        }
    }
    return {
        headerTitle,
        headerLeft: () => {
            return(  
                <FontAwesome.Button name="home" 
                backgroundColor='black'
                style = {{padding:15}}
                onPress = {() => navigation.navigate('Home')}/>
            )
        },
    }



};

const HomeNavigator = createStackNavigator(
    {
        Home: HomeScreen,
        AdminPortal : AdminPortalTabs,
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


const AccountNavigator = createStackNavigator(
    {
        Account: {
            screen : AccountScreen
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



