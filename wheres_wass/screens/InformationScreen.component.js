import React, { Component  } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import aboutUsStyles from '../styles/AboutUsStyles';
import { FontAwesome  } from '@expo/vector-icons';

export default class InformationScreen extends Component {
    static navigationOptions = ({navigation}) =>  ({
		title: "About Us",
		headerLeft: () => (<FontAwesome.Button name="bars" onPress={() => { navigation.toggleDrawer(); } } backgroundColor='black' />),
	})
    render(){
	return(
	    <View style={aboutUsStyles.container}>
			<Image source={require('../assets/store.jpg')}
			style={{width: '50%', height: '25%'}}></Image>
	    	<Text style={aboutUsStyles.headerStyle}>One more Under Construction</Text>
			<Text style={aboutUsStyles.headerStyle}>Contact Us</Text>
			<Text style={aboutUsStyles.textStyle}>Address:</Text>
	    </View>
		
	);
    }
}