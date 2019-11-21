import React, { Component  } from 'react';
import { StyleSheet, Text, View, Button, ImageBackground, Image} from 'react-native';
import styles from '../styles/Styles';
import { FontAwesome  } from '@expo/vector-icons';

//Home component to show current hours
export default class HomeScreen extends Component {
    static navigationOptions = ({ navigation }) =>  {
	return {
	title: "Where's Wass",
	headerLeft: () => (
	    <FontAwesome.Button name="bars" 
	    onPress ={ () => { navigation.toggleDrawer()}}
	    backgroundColor='black'
	    />
	),

    }
    }
    render(){
	return(
		<ImageBackground source={require('../assets/barberbackground.jpg')} 
		style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'}}>
			<Image source={require('../assets/logo.png')}
			style={{width: '45%', height: '45%'}}></Image>
			<View style= {{borderWidth: 1,borderColor: 'black', backgroundColor: 'black'}}>
				<Text style={{ color: 'white', justifyContent: 'center', fontSize: 30,}}>Where's Wass</Text>
				<Text style={{ color: 'white', fontSize:20 }}>Wait:</Text>
				<Text style={{ color: 'white', fontSize:20}}>Here is where today's hours will go</Text>
				<Text style={{ color: 'white', fontSize:20}}>Start Time</Text>
				<Text style={{ color: 'white', fontSize:20}}>to</Text>
				<Text style={{ color: 'white', fontSize:20}}>End Time</Text>
			<Text style ={{color: 'white',fontSize:20}}>Under Construction for Joseph to work</Text>
			<Text> </Text>
			<Text style={{color: 'white', fontSize:20}}> Here is where # in Queue</Text>
			<Button title="Add to Queue"/>
			<Text style={{ color: 'white', fontSize:20}}>Tomorrow's Hours</Text>
			</View>
		</ImageBackground>
	);
    }
}



