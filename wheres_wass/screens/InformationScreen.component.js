import React, { Component  } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import styles from '../styles/Styles';
import { FontAwesome  } from '@expo/vector-icons';

export default class InformationScreen extends Component {
    static navigationOptions = ({navigation}) =>  ({
		title: "About Us",
		headerLeft: () => (<FontAwesome.Button name="bars" onPress={() => { navigation.toggleDrawer(); } } backgroundColor='black' />),
	})
    render(){
	return(
	    <View style={ styles.container }>
	    	<Text>One more Under Construction</Text>
			<Text>Address:</Text>
	    </View>
	);
    }
}