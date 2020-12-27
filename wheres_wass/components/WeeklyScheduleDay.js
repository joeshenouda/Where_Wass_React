import React, { Component  } from 'react';
import { StyleSheet,
         Text, 
         View,
    	 Dimensions
	} from 'react-native';
import firebase from '../config';
import scheduleStyles from '../styles/ScheduleStyles';

var { height } = Dimensions.get('window');
 
var box_count = 8;
var box_height = height / box_count;

//Initializing the database object from firebase
firebaseDatabase = firebase.database();

class WeeklyScheduleDay extends Component{
    constructor(props){
	super(props);
	this.state = {
	    endTime : 'Loading...',
	    startTime : 'Loading...',
		working : true,
		date : ''
	}
	this.hoursRef = firebaseDatabase.ref('business_hours/'+this.props.day)
    }

    
  listenForHours(FBref) {

		FBref.on('value', (snap) => {
			this.setState({
				startTime : snap.child('002_o_opening').val(),
				endTime : snap.child('003_o_closing').val(),
				working : snap.child('001_o_status').val() == 'ON'
			})
		})

		FBref.on('child_changed',(snap) => {
			this.setState({
				openingHour : snap.child('002_o_opening').val(),
				closingHour : snap.child('003_o_closing').val(),
				working : snap.child('001_o_status').val() == 'ON'
			})
    });
  }

  setDate(){
	  let today = new Date()
	  let dayOfWeek = today.getDay()
	  let daysOfWeek  =['Sunday','Monday', 'Tuesday', 'Wednesday','Thursday','Friday','Saturday']

	  if(daysOfWeek[dayOfWeek] == this.props.day){

		  this.setState({
			  date : (today.getMonth()+1)+'/'+(today.getDate())+'/'+today.getFullYear()
		  })
	  }
	  else{
		  let numPropDayOfWeek = daysOfWeek.indexOf(this.props.day)
		  let dayOffSet = ((numPropDayOfWeek-dayOfWeek) < 0) ? numPropDayOfWeek-dayOfWeek+7 : numPropDayOfWeek-dayOfWeek
		  today.setDate(today.getDate()+dayOffSet)

		  this.setState({
			  date : (today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear()
		  })
	  }

  }

  componentDidMount(){
	this.listenForHours(this.hoursRef)
	this.setDate()
  }

  //When the prop is updated depending on whether our components focuses or blurs we detatch and reattatch the listener
  //This is necessary to real time updates when changes are made in admin portal
  componentDidUpdate(prevProps){
	  if(prevProps.focus != this.props.focus){
		if(this.props.focus && !this.props.blur){
			this.listenForHours(this.hoursRef)
		}
		else{
			this.hoursRef.off()
		}
	}
  }

  render(){
	
	if (this.state.working){
	    return(
		<View style={[styles.box]}>				
			<Text style= {scheduleStyles.textStyle}>{this.props.day}</Text>
			<Text style= {scheduleStyles.dateStyle}>{this.state.date}</Text>
			<Text style= {scheduleStyles.dateStyle}>{this.state.startTime} to {this.state.endTime}</Text>
		</View>
	    )
	}
	  else{
	    return(
		<View style={[styles.box]}>				
			<Text style= {scheduleStyles.textStyle}>{this.props.day}</Text>
			<Text style= {scheduleStyles.dateStyle}>{this.state.date}</Text>
			<Text style= {scheduleStyles.dateStyle}>OFF</Text>
		</View>
	    )
	  }
	
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
  });
export default WeeklyScheduleDay
