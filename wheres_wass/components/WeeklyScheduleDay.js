import React, { Component  } from 'react';
import { StyleSheet,
         Text, 
         View,
    	 Dimensions
	} from 'react-native';
import firebase from '../config';
import scheduleStyles from '../styles/ScheduleStyles';

var { height } = Dimensions.get('window');
 
var box_count = 7;
var box_height = height / box_count;

//Initializing the database object from firebase
firebaseDatabase = firebase.database();

class WeeklyScheduleDay extends Component{
    constructor(props){
	super(props);
	this.state = {
	    endTime : 'Loading...',
	    startTime : 'Loading...',
	    working : true
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

  componentDidMount(){
	this.listenForHours(this.hoursRef)
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
	console.log('WeeklyScheduleDay rendered')
	
	if (this.state.working){
	    return(
		<View style={[styles.box]}>				
			<Text style= {scheduleStyles.textStyle}>{this.props.day}</Text>
			<Text style= {scheduleStyles.textStyle}>{this.state.startTime} to {this.state.endTime}</Text>
		</View>
	    )
	}
	  else{
	    return(
		<View style={[styles.box]}>				
			<Text style= {scheduleStyles.textStyle}>{this.props.day}</Text>
			<Text style= {scheduleStyles.textStyle}>OFF</Text>
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
