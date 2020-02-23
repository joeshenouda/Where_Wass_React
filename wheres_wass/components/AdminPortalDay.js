import React, { Component  } from 'react';
import { StyleSheet,
         Text, 
         View,
         Switch,
         Modal,
         Button,
         TouchableOpacity,
         Image
         } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import firebase from '../config';
import DialogInput from 'react-native-dialog-input';


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
      //This is for handling the iOS time picker
      timeSelected:new Date(),
      show: false,
      editingStart : true,
      date : '',
      day: this.props.day,
      month : this.props.month,
      year : this.props.year,
      isDialogVisible : false

    }
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    this.monthlyHoursRef=firebaseDatabase.ref('business_hours/'+months[this.state.month-1]+'/'+this.state.day)
    console.log('Admin Portal day given was '+this.props.day)
  }

  updateAnnouncement(newAnnouncement){
		let announcementRef = firebaseDatabase.ref('Admin/')
		announcementRef.update({
			news: newAnnouncement
		})
		this.setState({
			isDialogVisible:false
		})
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
        startTime : reconstructedTime,
        timeSelected:time
      })
    }
    else{
      this.setState({
        endTime : reconstructedTime,
        timeSelected:time
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
            <View style={{flex:1, flexDirection:'row', justifyContent:'space-between'}}>
              <Switch trackColor = {{false :'white', true: 'green'}} thumbColor = 'white' value= {this.state.working} onValueChange = {() => this.updateWorkingStatus(this.state.working)}/>
              <Text style ={{fontSize : 25, color:'white'}}>Working</Text>
              <View style={{flex:1, flexDirection:'row', justifyContent:'center'}}>
                <TouchableOpacity onPress={() => this.setState({isDialogVisible:true})} style={styles.fab}>
                  <Image source={require('../assets/hairDryer.png')} style={{padding: 10, height: 25, width: 25, resizeMode: 'cover'}}/>
                </TouchableOpacity>
              </View>
            </View>
            <View style = {{flex : 1, flexDirection : 'row', marginHorizontal : 5}}>
              <Text style={styles.startTime}>Start Time:</Text>
                <Text onPress = {this.timepickerStart} style = {styles.timeText}>{this.state.startTime}</Text>
              </View>

              <View style = {{flex :1, flexDirection : 'row' , marginHorizontal : 5}}>
                <Text style={styles.startTime}>End Time:</Text>
                <Text onPress = {this.timepickerEnd} style = {styles.timeText}>{this.state.endTime}</Text>
              </View>
             { Platform.OS==='android' &&  this.state.show && <DateTimePicker value= {new Date()}
                    mode={this.state.mode}
                    is24Hour={false}
                    display="default"
                    onChange={this.setTime} />
            }
            {
              Platform.OS==='ios' &&
              <Modal 
              animationType="slide"
              visible={this.state.show} 
              style={{backgroundColor:'white'}}
              transparent={true}
              presentationStyle="overFullScreen"
              >
                <View
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,.2)',
                    justifyContent: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <View
                    style={{
                      backgroundColor: 'white',
                      padding: 20,
                      borderRadius:30
                    }}
                  >
                    <View>
                    <DateTimePicker value= {this.state.timeSelected}
                    mode="time"
                    is24Hour={false}
                    onChange={this.setTime}
                    style={{width:'100%'}}
                  />
                    </View>
                    <View style={{ alignItems: 'center' }}>
                    <Button title="Done" onPress={()=>this.setState({show:false})}/>
                    </View>
                  </View>
                </View>
              </Modal>
            }

            <DialogInput isDialogVisible={this.state.isDialogVisible}
                title={"Update announcement"}
                message={"Enter new announcement"}
                hintInput ={"Shop closed"}
                textInputProps={{autoCapitalize:'words'}}
                submitInput = {(inputtext) => this.updateAnnouncement(inputtext)}
                closeDialog = {() => this.setState({isDialogVisible:false})}>
            </DialogInput>


          </View>
    )
  }

}

const styles = StyleSheet.create({
    rect: {
      flex : 1,
      justifyContent : 'center',
      backgroundColor: "black",
      alignItems:'center'
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
    fab: { 
        flex:1,
        height:56,
        marginLeft:'75%',
        alignItems:'center',
        justifyContent: 'center',  
        backgroundColor: 'orange', 
        borderRadius: 30, 
    }, 
    fabIcon: { 
        fontSize: 40, 
        color: 'white' 
    }

})
export default AdminPortalDay;
