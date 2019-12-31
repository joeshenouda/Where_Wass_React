import React, { Component  } from 'react';
import { StyleSheet, Text, View, Button, Dimensions, ScrollView } from 'react-native';
import scheduleStyles from '../styles/ScheduleStyles';
import { FontAwesome } from '@expo/vector-icons';
import firebase from '../config';
import WeeklyScheduleDay from '../components/WeeklyScheduleDay'


var { height } = Dimensions.get('window');
 
var box_count = 8;
var box_height = height / box_count;


firebaseDatabase = firebase.database();
let daysOfWeek  =['Monday', 'Tuesday', 'Wednesday','Thursday','Friday','Saturday', 'Sunday']



export default class WeeklyScheduleScreen extends Component {
	constructor(props){
		super(props);
		this.state = {
			blurring : false,
			focusing : true
		}
	}
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

  //Focus and blur subscriptions to change props in WeeklyScheduleDay components
  didFocusSubscription() {
	this.props.navigation.addListener('didFocus', () => {
		this.setState({
			focusing : true,
			blurring :false
		})
		console.log('didFocues called for weeklySchedule')
})
}

	didBlurSubscription(){
	this.props.navigation.addListener('didBlur', () => { 
		this.setState({
			focusing : false,
			blurring : true
		})
	console.log('didBlur called for weeklySchedule')
})
}

	componentDidMount(){
		this.didFocusSubscription()
		this.didBlurSubscription()
	}

    render() {
	return (
		<ScrollView horizontal = {false} style = {{flex:2}}>
				<View style = {styles.separator}/>
	    		<WeeklyScheduleDay day = 'Monday' focus = {this.state.focusing} blur = {this.state.blurring}/>
	    		<View style = {styles.separator}/>
	    		<WeeklyScheduleDay day = 'Tuesday' focus = {this.state.focusing} blur = {this.state.blurring}/>
	    		<View style = {styles.separator}/>
	    		<WeeklyScheduleDay day = 'Wednesday' focus = {this.state.focusing} blur = {this.state.blurring}/>
	    		<View style = {styles.separator}/>
	    		<WeeklyScheduleDay day = 'Thursday' focus = {this.state.focusing} blur = {this.state.blurring}/>
	    		<View style = {styles.separator}/>
	    		<WeeklyScheduleDay day = 'Friday' focus = {this.state.focusing} blur = {this.state.blurring} />
	    		<View style = {styles.separator}/>
	    		<WeeklyScheduleDay day = 'Saturday' focus = {this.state.focusing} blur = {this.state.blurring}/>
	    		<View style = {styles.separator}/>
	    		<WeeklyScheduleDay day = 'Sunday' focus = {this.state.focusing} blur = {this.state.blurring}/>
	    		<View style = {styles.separator}/>
		</ScrollView>
		);
	  }
	}

	const styles = StyleSheet.create({
		container: {
		  flex: 1,
		  flexDirection: 'column'
		},
	    separator: {
		width : '100%',
		height : 5,
		backgroundColor : 'orange'
	    }
	  });
