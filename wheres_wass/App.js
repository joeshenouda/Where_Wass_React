import React, { Component  } from 'react';
import { StyleSheet, 
	 Text, 
	 View, 
	 Button,
	 Image, 
     ScrollView, 
     SafeAreaView,
     TouchableOpacity,
     Linking } from 'react-native';
import { createAppContainer } from 'react-navigation';
import {  createDrawerNavigator, DrawerItems  } from 'react-navigation-drawer';
import { createStackNavigator  } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { FontAwesome } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen.component';
import InformationScreen from './screens/InformationScreen.component';
import AccountScreen from './screens/AccountScreen.component';
import CreateAccountScreen from './screens/CreateAccount.component';
import WaitlistScreen from './screens/WaitlistScreen.component';
import InStoreWaitlistScreen from './screens/InStoreWaitlist.component';
import MonthlyScheduleScreen from './screens/MonthlyScheduleScreen.component';
import AdminMonthlyScreen from './screens/AdminMonthly.component';
import ClientListScreen from './screens/ClientListScreen.component';


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
      tabBarLabel : 'In Store Waitlist',
      tabBarIcon : () => {
          return <FontAwesome name="list" size={25} style = {{color:'black'}}/>
      }
    };
  };

const AdminPortalTabs = createBottomTabNavigator(
    {
        'Admin Portal' : AdminMonthlyScreen,
        Waitlist : WaitlistScreen,
        InStoreWaitlist : InStoreWaitlistStack,
        Clients: ClientListScreen
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
const MonthlyNavigator = createStackNavigator(
    {
        Monthly : MonthlyScheduleScreen,
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
	<ScrollView contentContainerStyle={{flex: 1,  flexDirection: 'column', justifyContent: 'space-between' }}>
        <SafeAreaView forceInset={{ top: 'always' , horizontal: 'never' }}>
            <Image style={{width:280, height:200}} source = {require('./assets/navigationheader.jpg')}/>
            <DrawerItems {...props}/>

        </SafeAreaView>
        <View style={{flex:1}}>
                <FontAwesome.Button name='yelp' color='red' size={45} backgroundColor='black' onPress={ ()=> Linking.openURL('https://www.yelp.com/biz/wadies-salon-east-brunswick')}>
                <Text style={{color:'white'}}>
                    Review us on Yelp!
                </Text>
                </FontAwesome.Button>
                <FontAwesome.Button name='google' size={45} backgroundColor='black' onPress={ ()=> Linking.openURL('https://www.google.com/search?sxsrf=ACYBGNQkFmj0acgn2jJuN-sScOxCCDWkmw%3A1581353381215&ei=pYlBXrflDOupytMPyKSMkAQ&q=wadies+salon+reviews&oq=wadies+salon+reviews&gs_l=psy-ab.3...397.397..670...0.0..0.0.0.......0....1..gws-wiz.0WWJYRELvgE&ved=0ahUKEwj3y7S0uMfnAhXrlHIEHUgSA0IQ4dUDCAs&uact=5#lrd=0x89c3cf6c9809134f:0x894032f0cfe7697c,1,,,')}>

                <Text style={{color:'white'}}>
                    Review us on Google!
                </Text>
                </FontAwesome.Button>
            </View>
	</ScrollView>
)


const DrawerNav = createDrawerNavigator({
  Home: HomeNavigator,
  'Monthly Schedule' : MonthlyNavigator,
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



