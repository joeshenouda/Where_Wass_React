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
			<Text style={aboutUsStyles.headerStyle}>Contact Us</Text>
			<Text style={aboutUsStyles.textStyle}>Phone: (732) 432-9004</Text>
			<Text style={aboutUsStyles.textStyle}>Address: 716 NJ-18,</Text>
			<Text style={aboutUsStyles.textStyle}>East Brunswick, NJ 08816</Text>
			<Text style={aboutUsStyles.textStyle}>www.wadiessalon.com</Text>
			<Text style={aboutUsStyles.headerStyle}>About Us</Text>
			<Text style={aboutUsStyles.textStyle}>Our family owned and operated salon has been in business at our current location for over 15 years. Established in 2002, we are conveniently located in the heart of East Brunswick on state route 18. Wadies is the home-salon to thousands of loyal men and women over the past decade. Specializing in different hair types with over 30 years of experience, you can trust us with a simple haircut, getting your Brazilian Keratin treatment, or a fresh new color. Not to mention that we are proudly the most competitively priced salon in the area!</Text>
	    </View>
		
	);
    }
}