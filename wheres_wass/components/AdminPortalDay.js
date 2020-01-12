import React, { Component  } from 'react';
import { StyleSheet,
         Text, 
         View,
         Switch
         } from 'react-native';
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
      editingStart : true,
      date : '',
      day: this.props.day,
      month : this.props.month,
      year : this.props.year
    }
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    this.monthlyHoursRef=firebaseDatabase.ref('business_hours/'+months[this.state.month-1]+'/'+this.state.day)
    console.log('Admin Portal day given was '+this.props.day)
  }

  updateWorkingStatus(prevWorking){
      this.setState(prevState => ({
        working : !prevState.working,
        show : false
      }
    ))

    !prevWorking ? this.monthlyHoursRef.child('working').set('ON') :  this.monthlyHoursRef.child('working').set('OFF')
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
    else if(hour >= 12){
      console.log('The hour is greater than 12 '+hour)
      if (hour == 12){
        hour=12
      }else{
        hour = hour % 12
      }
      AMorPM = 'PM'
    }

    const reconstructedTime = hour+':'+minute+' '+AMorPM;

    //Define which time node we are updating
    let timeToUpdate = this.state.editingStart ? 'start_time' : 'end_time';
    
    //Setting the state according to which time was updated (start or end)
    console.log('timeToUpdate is '+timeToUpdate)
    if(timeToUpdate == 'start_time'){ 
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

    this.monthlyHoursRef.child(timeToUpdate).set(reconstructedTime)
    
  
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

		FBref.once('value', (snap) => {
      if(snap.child('start_time').exists() && snap.child('end_time').exists()){
        console.log('Snap exists')
        this.setState({
          startTime : snap.child('start_time').val(),
          endTime : snap.child('end_time').val(),
          working : snap.child('working').val() == 'ON'
        })
      }
      else{
        console.log('Snap does not exist')
        this.setState({
          startTime : 'Set Start Time',
          endTime : 'Set End Time',
          working : false
        })
      }
    })
  }

  setDate(){
	  let today = new Date()
	  let dayOfWeek = today.getDay()
	  let daysOfWeek  =['Sunday','Monday', 'Tuesday', 'Wednesday','Thursday','Friday','Saturday']

	  if(daysOfWeek[dayOfWeek] == this.props.day){

		  this.setState({
			  date : (today.getMonth()+1)+'/'+(today.getDate())
		  })
	  }
	  else{
		  let numPropDayOfWeek = daysOfWeek.indexOf(this.props.day)
		  let dayOffSet = ((numPropDayOfWeek-dayOfWeek) < 0) ? numPropDayOfWeek-dayOfWeek+7 : numPropDayOfWeek-dayOfWeek
		  today.setDate(today.getDate()+dayOffSet)

		  this.setState({
			  date : (today.getMonth()+1)+'/'+today.getDate()
		  })
	  }

  }

  componentWillUpdate(nextProp, nextState){
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    this.monthlyHoursRef = firebaseDatabase.ref('business_hours/'+months[nextProp.month-1]+'/'+nextProp.day)
    if(nextProp.day != this.props.day || nextProp.month != this.props.month){
      this.listenForHours(this.monthlyHoursRef)
    }
  }
    
  componentDidMount(){
    this.monthlyHoursRef.off()
    this.listenForHours(this.monthlyHoursRef)
    this.setDate()
  }

  componentWillUnmount(){
  }

  render(){
    return (
          <View style={styles.rect}>
            <Text style={styles.dayOfWeek}>{this.props.month}/{this.props.day}/{this.props.year}</Text>
            <View style={{flexDirection:'row', marginBottom : 50, justifyContent:'center'}}>
              <Switch trackColor = {{false :'white', true: 'green'}} thumbColor = 'white' value= {this.state.working} onValueChange = {() => this.updateWorkingStatus(this.state.working)}/>
              <Text style ={{fontSize : 25, color:'white'}}>Working</Text>
            </View>
            <View style = {{flex : 1, flexDirection : 'row', marginHorizontal : 5}}>
              <Text style={styles.startTime}>Start Time:</Text>
                <Text onPress = {this.timepickerStart} style = {styles.timeText}>{this.state.startTime}</Text>
              </View>

              <View style = {{flex :1, flexDirection : 'row' , marginHorizontal : 5}}>
                <Text style={styles.startTime}>End Time:</Text>
                <Text onPress = {this.timepickerEnd} style = {styles.timeText}>{this.state.endTime}</Text>
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
      backgroundColor: "black"
    },
    dayOfWeek: {
        color: "white",
        fontSize: 25,
        textAlign: "center",
        textDecorationLine: "underline",
        marginBottom : 20
      },
    materialCheckboxWithLabel2: {
      flex: 1,
    },
    startTime : {
        flex : 1,
        color: "white",
        fontSize: 25,
    },
    timeText: {
        color: "white",
        fontSize: 25,
        letterSpacing: 0,
        marginBottom : 10,
        textDecorationLine: "underline"
    },
    startTime2Row: {
 
        flexDirection: "row",
        marginTop: 11,
        marginLeft: 20
    },

})
export default AdminPortalDay;
