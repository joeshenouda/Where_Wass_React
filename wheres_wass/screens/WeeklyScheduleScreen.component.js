import React, { Component  } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import styles from '../styles/Styles';
import { FontAwesome } from '@expo/vector-icons';

export default class WeeklyScheduleScreen extends Component {
    static navigationOptions = ({navigation}) => {
	return {
	title: "Weekly Schedule",
	headerLeft: () => (
	    <FontAwesome.Button name="bars" 
	    onPress ={ () => { navigation.toggleDrawer()}}
	    backgroundColor='black'
	    />
	),
	    
    };
  };
    render() {
	return(
	    <View style = { styles.container  }>
	    	<Text> DON'T USE </Text>
	    </View>
	);
    }
}
