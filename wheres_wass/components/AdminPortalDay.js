import React, { Component  } from 'react';
import { StyleSheet,
         Text, 
         View,
         ScrollView,
         TextInput,
         } from 'react-native';

import CheckBox from 'react-native-checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import firebase from '../config';

//Initializing the database object from firebase
firebaseDatabase = firebase.database();


class AdminPortalDay extends Component{
  constructor(props){
    super(props);
    this.state = {
      endTime : 'Loading...',
      startTime : 'Loading...',
      working : true,
      mode: 'time',
      show: false,
      editingStart : true
    }
    this.hoursRef = firebaseDatabase.ref('business_hours/'+this.props.day)
  }

  updateWorkingStatus(prevWorking){
    this.setState({
      working : !prevWorking
    })

    !prevWorking ? this.hoursRef.child('001_o_status').set('ON') :  this.hoursRef.child('001_o_status').set('OFF')
  }

  setTime = (event, time) => {
    console.log(time)
    //Convert Date object to string
    const stringTime = time.toLocaleTimeString('en-US')
    const decomposedTime = stringTime.split(':')

    let hour = decomposedTime[0]
    let minute = decomposedTime[1]
    let AMorPM = 'AM'

    if (hour[0] == '0'){
      hour = hour[1]
      if (hour == '0'){
        hour = '12'
      }
    }
    else if(hour > 12){
      console.log('The hour is greater than 12 '+hour)
      hour = hour % 12
      AMorPM = 'PM'
    }

    const reconstructedTime = hour+':'+minute+' '+AMorPM;

    console.log(reconstructedTime)

    //Define which time node we are updating
    let timeToUpdate = this.state.editingStart ? '002_o_opening' : '003_o_closing';
    
    //Setting the state according to which time was updated (start or end)
    if(timeToUpdate){ 
	this.setState({
	  show : false,
	  startTime : reconstructedTime
	})
    }
    else{
	this.setState({
	  show : false,
	  endTime : reconstructedTime
	})
 
    }

    this.hoursRef.child(timeToUpdate).set(reconstructedTime)
    
  
  }

  timepickerStart = () => {
    this.showStart('time');
  }

  timepickerEnd = () => {
    this.showEnd('time');
  }
  

  showStart = mode => {
    this.setState({
      show: true,
      editingStart : true,
      mode,
    });
  }

  showEnd = mode => {
    this.setState({
      show: true,
      editingStart : false,
      mode,
    });
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
    console.log('componentDidMount for AdminPortalDay was called')
    this.listenForHours(this.hoursRef)
  }

  componentWillUnmount(){
    console.log('componentWillUnmount for AdminPortalDay was called')
    this.hoursRef.off()
  }

  render(){
    return (
          <View style={styles.rect}>
            <Text style={styles.dayOfWeek}>{this.props.day}</Text>
            <CheckBox label = 'Working' checked= {this.state.working} onChange = {(checked) => this.updateWorkingStatus(checked)}/>
            <View>
            <View style = {{flex : 1, flexDirection : 'row', marginHorizontal : 5}}>
              <Text style={styles.startTime}>Start Time:</Text>
                <Text onPress = {this.timepickerStart} style = {styles.timeText}>{this.state.startTime}</Text>
              </View>

              <View style = {{flex :1, flexDirection : 'row' , marginHorizontal : 5}}>
                <Text style={styles.startTime}>End Time:</Text>
                <Text onPress = {this.timepickerEnd} style = {styles.timeText}>{this.state.endTime}</Text>
              </View>

            </View>
             { this.state.show && <DateTimePicker value= {new Date()}
                    mode={this.state.mode}
                    is24Hour={false}
                    display="default"
                    onChange={this.setTime} />
            }

        </View>
    )
  }

}

const styles = StyleSheet.create({
    rect: {
      flex : 1,
      justifyContent : 'center',
      flexDirection: 'column',
      backgroundColor: "rgba(230, 230, 230,1)"
    },
    dayOfWeek: {
        color: "rgba(8,7,7,1)",
        fontSize: 25,
        textAlign: "center",
        textDecorationLine: "underline"
      },
    materialCheckboxWithLabel2: {
      flex: 1,
    },
    startTime : {
        flex : 1,
        color: "rgba(8,7,7,1)",
        fontSize: 20,
    },
    timeText: {
        color: "gray",
        fontSize: 20,
        letterSpacing: 0,
        marginBottom : 10,
        textDecorationLine: "underline"
    },
    startTime2Row: {
 
        flexDirection: "row",
        marginTop: 11,
        marginLeft: 10
    },

})
export default AdminPortalDay;
