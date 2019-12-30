import React, { Component  } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import styles from '../styles/Styles';
import { FontAwesome } from '@expo/vector-icons';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';


export default class MonthlyScheduleScreen extends Component {
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
    render() {
	return(
	    <View>
			<Calendar
  current={Date()}
  minDate={undefined}
  maxDate={undefined}
  //gets executed on day press.
  onDayPress={(day) => {console.log('selected day', day)}}
  onDayLongPress={undefined}
  monthFormat={'MMM yyyy'}
  onMonthChange={undefined}
  hideArrows={true}
  hideExtraDays={false}
  disableMonthChange={true}
  firstDay={7}
  hideDayNames={false}
  showWeekNumbers={false}
  onPressArrowLeft={substractMonth => substractMonth()}
  onPressArrowRight={addMonth => addMonth()}
  markedDates={{
	  '2019-11-21': { marked: true, selectedColor: 'blue', }
  }}
  style={{
	  borderWidth: 1,
	  borderColor: 'red',
	  height: 375
  }}
  theme={{
	  backgroundColor: '#0000000',
	  calendarBackground: '#000000',
	  textMonthFontFamily: 'serif',
	  textMonthFontSize: 20,
	  monthTextColor: 'white',
	  dayTextColor: 'white',
	  textDisabledColor: 'red',
	  arrowColor: 'white',
  }}
/>
<Text> Also under construction </Text>

	    </View>
	);
    }
}
