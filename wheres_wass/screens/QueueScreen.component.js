import React, { Component  } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import styles from '../styles/Styles';
import { FontAwesome } from '@expo/vector-icons';

export default class QueueScreen extends Component {
    static navigationOptions = ({navigation}) => {
	return {
	title: "Queue",
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
	    	<Text> Also under construction </Text>
	    </View>
	);
    }
}
