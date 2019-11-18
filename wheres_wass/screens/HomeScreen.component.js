import React, { Component  } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
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
	    <View style={ styles.container }>
	    	<Text>Under Construction</Text>

		 <TouchableOpacity onPress={() => props.navigation.navigate('Queue')}>
		 <Text>Add to Queue</Text>
	   </TouchableOpacity>
	   </View>
	);
    }
}



