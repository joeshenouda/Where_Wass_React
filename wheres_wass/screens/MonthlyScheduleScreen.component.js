import React, { Component  } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import {Calendar} from 'react-native-calendars';
import firebase from '../config';

//Creating firebase database object
firebaseDatabase = firebase.database()

export default class MonthlyScheduleScreen extends Component {
    constructor(props){
        super(props)
        let today = new Date()
        this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        this.state = {
            selectedDate : Date(),
            selectedMonth : today.getMonth()+1,
            selectedDay : today.getDate(),
            selectedYear : today.getFullYear(),
            working : false,
            start_time : 'Loading...',
            end_time : 'Loading...',
        }
    }

    static navigationOptions = ({navigation}) => {
        return {
        title: "Monthly Schedule",
        headerLeft: () => (
            <FontAwesome.Button name="bars" 
            onPress ={ () => { navigation.toggleDrawer()}}
            backgroundColor='black'
            />
        ),
            
        };
    };

    grabMonthlyHours(day){
        let monthlyHoursRef = firebaseDatabase.ref('business_hours/'+this.months[day.month-1]+'/'+day.day)
        monthlyHoursRef.once('value', (snap) => {
            //Check that the day exists in the database as well as its start,end time and working status
            if(snap.exists() && snap.child('start_time').exists() && snap.child('end_time').exists() && snap.child('working').exists()){
                this.setState({
                    start_time:snap.child('start_time').val(),
                    end_time:snap.child('end_time').val(),
                    working : snap.child('working').val() == 'ON',
                    selectedDay : day.day,
                    selectedMonth : day.month,
                    selectedYear : day.year,
                    selectedDate : day.dateString
                })
            }
            else{
                this.setState({
                    start_time : 'Time not yet set',
                    end_time : 'Time not yet set',
                    working:true,
                    selectedDay : day.day,
                    selectedMonth : day.month,
                    selectedYear : day.year,
                    selectedDate : day.dateString
                })
            }
        })
    }

    getWorkingStatus(working) {
        if(working){
            return(
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <Text style={styles.dateHeader}>{this.state.selectedMonth}/{this.state.selectedDay}/{this.state.selectedYear}</Text>
                    <Text style={styles.statusText}>{this.state.start_time}</Text>
                    <Text style={{color:'white', fontSize:25}}>to</Text>
                    <Text style={styles.statusText}>{this.state.end_time}</Text>
                </View>
            )
        }
        else{
            return(
                <View style={{flex:1, justifyContent:'center', alignItems : 'center'}}>
                    <Text style={styles.dateHeader}>{this.state.selectedMonth}/{this.state.selectedDay}/{this.state.selectedYear}</Text>
                    <Text style={[styles.statusText, {fontSize:50}]}>OFF</Text>
                </View>
            )
        }
    }

    componentDidMount(){
        let today = new Date()
        let initialDay = {
            day:today.getDate(),
            month:today.getMonth()+1,
            year : today.getFullYear()
        }
        this.grabMonthlyHours(initialDay)
    }

    render() {
        const hoursStatus = this.getWorkingStatus(this.state.working)
        return(
            <View style={{flex:1}}>
                <Calendar
                //gets executed on day press.
                onDayPress={(day) => {
                    this.grabMonthlyHours(day)
                }}
                monthFormat={'MMM yyyy'}
                hideArrows={false}
                hideExtraDays={false}
                disableMonthChange={false}
                firstDay={7}
                hideDayNames={false}
                showWeekNumbers={false}
                onPressArrowLeft={substractMonth => substractMonth()}
                onPressArrowRight={addMonth => addMonth()}
                markedDates={{[this.state.selectedDate] : {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}}}
                style={{
                    flex:1,
                    borderWidth: 1,
                    borderColor: 'orange',
                }}
                theme={{
                    backgroundColor: 'white',
                    calendarBackground: 'black',
                    textMonthFontFamily: 'serif',
                    textMonthFontSize: 20,
                    selectedDayBackgroundColor: 'white',
                    selectedDayTextColor: 'black',
                    monthTextColor: 'white',
                    dayTextColor: 'white',
                    textDisabledColor: 'gray',
                    arrowColor: 'white',
                    indicatorColor: 'orange',

                }}
                />
                <View style={{flex:1, backgroundColor : 'black'}}>
                    {hoursStatus}
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    dateHeader : {
        fontSize : 50,
        fontWeight : 'bold',
        textDecorationLine : 'underline',
        color:'white'
    },
    statusText : {
        fontSize : 30,
        marginTop : 15,
        marginBottom : 15,
        fontWeight : 'bold',
        color : 'white'
    }

})
