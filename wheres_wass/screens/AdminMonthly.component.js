import React, { Component  } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import styles from '../styles/Styles';
import { FontAwesome } from '@expo/vector-icons';
import {Calendar} from 'react-native-calendars';
import AdminPortalDay from '../components/AdminPortalDay';


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
		bottom: 40, 
		backgroundColor: 'black', 
		borderRadius: 30, 
		elevation: 10, 
		}, 
	fabIcon: { 
		fontSize: 40, 
		color: 'white' 
	}
  });
