import React, { Component  } from 'react';
import { StyleSheet, 
		Text, 
		View, 
		Button,
		Image, ScrollView, SafeAreaView } from 'react-native';
import { createAppContainer } from 'react-navigation';
import {  createDrawerNavigator, DrawerItems  } from 'react-navigation-drawer';
import { createStackNavigator  } from 'react-navigation-stack';
import styles from './styles/Styles';
import HomeScreen from './screens/HomeScreen.component';
import WeeklyScheduleScreen from './screens/MonthlyScheduleScreen.component';
import InformationScreen from './screens/InformationScreen.component';
import Queue from './screens/QueueScreen.component'
import QueueScreen from './screens/QueueScreen.component';
import AgendaScreen from './screens/MonthlyScheduleScreen.component2';


const headerConfigs = { 
	headerTitleStyle: {
		textAlign: 'center',
		flexGrow:1,
		alignSelf: 'center',
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

const InfoNavigator = createStackNavigator(
	{
		Info: InformationScreen
	},
	{
	defaultNavigationOptions: headerConfigs
	}
);

const QueueNavigator = createStackNavigator(
	{
		Queue: QueueScreen
	},
	{
	defaultNavigationOptions: headerConfigs
	}
);
const AgendaNavigator = createStackNavigator(
	{
		Agenda: AgendaScreen
	},
	{
	defaultNavigationOptions: headerConfigs
	}
);
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
  'Monthly Schedule': WeeklyNavigator,
  'About Us': InfoNavigator,
  'Queue': QueueNavigator,
  'Agenda': AgendaNavigator,

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



