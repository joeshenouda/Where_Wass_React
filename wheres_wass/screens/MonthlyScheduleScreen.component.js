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
        //Creating the string for min date on calendar
        this.today = today.getFullYear()

        if(today.getMonth()+1 < 10){
            this.today=this.today+'-0'+ (today.getMonth()+1)
        }
        else{
            this.today=this.today+'-'+ (today.getMonth()+1)
        }

        if(today.getDate() < 10){
            this.today=this.today+'-0'+ today.getDate()
        }
        else{
            this.today=this.today+'-'+ today.getDate()
        }

        //Using two months later to set max date on calendar
        let twoMonthsLater = new Date()
        twoMonthsLater.setMonth(twoMonthsLater.getMonth()+2)
        //Of the form YYYY-MM-DD
        this.twoMonthsLaterString = twoMonthsLater.getFullYear()

        if(twoMonthsLater.getMonth()+1 < 10){
            this.twoMonthsLaterString=this.twoMonthsLaterString+'-0'+ (twoMonthsLater.getMonth()+1)
        }
        else{
            this.twoMonthsLaterString=this.twoMonthsLaterString+'-'+ (twoMonthsLater.getMonth()+1)
        }

        if(twoMonthsLater.getDate() < 10){
            this.twoMonthsLaterString=this.twoMonthsLaterString+'-0'+ twoMonthsLater.getDate()
        }
        else{
            this.twoMonthsLaterString=this.twoMonthsLaterString+'-'+ twoMonthsLater.getDate()
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
                maxDate={this.twoMonthsLaterString}
                minDate={this.today} 
                hideArrows={false}
                disableArrowLeft={false}
                hideExtraDays={true}
                disableMonthChange={false}
                firstDay={7}
                hideDayNames={false}
                showWeekNumbers={false}
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
