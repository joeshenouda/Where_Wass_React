import React, { Component  } from 'react';
import { StyleSheet, Image, View, Button, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import {Calendar} from 'react-native-calendars';
import AdminPortalDay from '../components/AdminPortalDay';
import DialogInput from 'react-native-dialog-input';



export default class AdminMonthly extends Component {
    constructor(props){
        super(props)
        let today = new Date()
        this.state = {
            selectedDate : Date(),
            selectedMonth : today.getMonth()+1,
            selectedDay : today.getDate(),
            selectedYear : today.getFullYear(),
            isDialogVisible : false
        }
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

    static navigationOptions = ({navigation}) => {
        return ({
            tabBarLabel : 'Monthly Schedule',
            tabBarIcon : () => {
                return <FontAwesome name="calendar" size={25} style = {{color:'black'}}/>
            }
        }
        )
	    
    };

    render() {
	return(
	    <View style={{flex:1}}>
			<Calendar
            //gets executed on day press.
            onDayPress={(day) => {this.setState({
                selectedDate : day.dateString,
                selectedDay : day.day,
                selectedMonth : day.month,
                selectedYear : day.year
            })}}
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
            <View style={{flex:1}}>
                <AdminPortalDay month = {this.state.selectedMonth} day={this.state.selectedDay} year={this.state.selectedYear}/>
            </View>
            <DialogInput isDialogVisible={this.state.isDialogVisible}
                title={"Update announcement"}
                message={"Enter new announcement"}
                hintInput ={"Shop closed"}
                textInputProps={{autoCapitalize:'words'}}
                submitInput = {(inputtext) => this.updateAnnouncement(inputtext)}
                closeDialog = {() => this.setState({isDialogVisible:false})}>
            </DialogInput>
            <TouchableOpacity onPress={() => this.setState({isDialogVisible:true})} style={styles.fab}>
                <Image source={require('../assets/hairDryer.png')} style={{padding: 10, height: 25, width: 25, resizeMode: 'cover'}}/>
            </TouchableOpacity>

	    </View>
	);
    }
}

const styles = StyleSheet.create({

	fab: { 
		flex:1,
		position: 'absolute', 
		width: 56, 
		height: 56, 
		alignItems: 'center', 
		justifyContent: 'center', 
		right: 20, 
		bottom: 220, 
		backgroundColor: 'orange', 
		borderRadius: 30, 
		elevation: 10, 
		}, 
	fabIcon: { 
		fontSize: 40, 
		color: 'white' 
	}
  });
