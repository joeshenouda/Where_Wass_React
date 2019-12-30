import React, { Component  } from 'react';
import { StyleSheet, Text, View, Button, Dimensions } from 'react-native';
import scheduleStyles from '../styles/ScheduleStyles';
import { FontAwesome } from '@expo/vector-icons';
import firebase from '../config';


var { height } = Dimensions.get('window');
 
var box_count = 8;
var box_height = height / box_count;


firebaseDatabase = firebase.database();
let daysOfWeek  =['Monday', 'Tuesday', 'Wednesday','Thursday','Friday','Saturday', 'Sunday']
let dayOfWeek = new Date().getDay()

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
	return (
		<View style={styles.container}>
			<View style={[styles.box, styles.box1]}>
				<Text style= {scheduleStyles.textStyle}>Monday</Text>
				<Text style= {scheduleStyles.textStyle}>Joe</Text>
			</View>
			<View style={[styles.box, styles.box2]}>				
				<Text style= {scheduleStyles.textStyle}>Tuesday</Text>
				<Text style= {scheduleStyles.textStyle}>Joe</Text>
			</View>
			<View style={[styles.box, styles.box3]}>
				<Text style= {scheduleStyles.textStyle}>Wednesday</Text>
				<Text style= {scheduleStyles.textStyle}>Joe</Text>
			</View>
			<View style={[styles.box, styles.box4]}>
				<Text style= {scheduleStyles.textStyle}>Thursday</Text>
				<Text style= {scheduleStyles.textStyle}>Joe</Text>
			</View>
			<View style={[styles.box, styles.box5]}>
				<Text style= {scheduleStyles.textStyle}>Friday</Text>
				<Text style= {scheduleStyles.textStyle}>Joe</Text>
			</View>
			<View style={[styles.box, styles.box6]}>
				<Text style= {scheduleStyles.textStyle}>Saturday</Text>
				<Text style= {scheduleStyles.textStyle}>Joe</Text>
			</View>
			<View style={[styles.box, styles.box7]}>
				<Text style= {scheduleStyles.textStyle}>Sunday</Text>
				<Text style= {scheduleStyles.textStyle}>Joe</Text>
			</View>
			<View style={[styles.box, styles.box8]}></View>
		</View>
		);
	  }
	}

	const styles = StyleSheet.create({
		container: {
		  flex: 1,
		  flexDirection: 'column'
		},
		box: {
		  height: box_height,
		  justifyContent: 'center',
		  backgroundColor: 'black'
		},
		box2: {
			backgroundColor: '#2f4f4f'
		},
		box4: {
			backgroundColor: '#2f4f4f'
		},
		box6: {
			backgroundColor: '#2f4f4f'
		}
	  });