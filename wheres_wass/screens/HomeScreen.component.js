import React, { Component  } from 'react';
import { StyleSheet, Text, View, Button, ImageBackground, Image} from 'react-native';
import styles from '../styles/Styles';
import { FontAwesome  } from '@expo/vector-icons';
import firebaseDatabase from '../config';

//To convert numerical day of week received by Date() object to string for Firebase
let daysOfWeek  =['Sunday', 'Monday', 'Tuesday', 'Wednesday','Thursday','Friday','Saturday']
let dayOfWeek = new Date().getDay()

//Two layouts for switching b/t working and non working layouts
const workingLayout = (props) => {
	return(
		<View style = {Homestyles.statusBox}>
			<Text style={{ color: 'white', justifyContent: 'center', fontSize: 30,}}>Where's Wass</Text>
			<Text style = {Homestyles.statusText}>{props.startTime}</Text>
			<Text style = {Homestyles.statusText}>to</Text>
			<Text style = {Homestyles.statusText}>{props.endTime}</Text>
		</View>
	)
}

const notWorkingLayout = () => {
	return(
		<View style ={Homestyles.statusBox}>
			<Text style={{ color: 'white', justifyContent: 'center', fontSize: 30,}}>Where's Wass</Text>
			<Text style = {Homestyles.statusText}>OFF</Text>
		</View>
	)
}


//Home component to show current hours
export default class HomeScreen extends Component {
	constructor(props){
		super(props);
		this.state = {
			working: 'ON',
			openingHour: 'Loading...',
			closingHour: 'Loading...',

		},
		this.business_hoursRef = firebaseDatabase.ref('business_hours/'+daysOfWeek[dayOfWeek])
	}
	//Called everytime a child changes on the database for the given day
	listenForHours(FBref) {

		FBref.on('value', (snap) => {
			this.setState({
				openingHour : snap.child('002_o_opening').val(),
				closingHour : snap.child('003_o_closing').val(),
				working : snap.child('001_o_status').val()
			})
		})

		FBref.on('child_changed',(snap) => {
			this.setState({
				openingHour : snap.child('002_o_opening').val(),
				closingHour : snap.child('003_o_closing').val(),
				working : snap.child('001_o_status').val()
			})
		});
		
	}
	//TBH idek how this works
	componentDidMount(){
		this.listenForHours(this.business_hoursRef)
	}

	//Setting the header for users to access nav drawer
    static navigationOptions = ({ navigation }) =>  {
		return {
		title: "Where's Wass",
		headerLeft: () => (
			<FontAwesome.Button name="bars" 
			onPress ={ () => { navigation.toggleDrawer()}}
			backgroundColor='black'
			/>
		),}
	}
	
    render(){
		//Render a different layout based on working status
		//if ON render the workingLayout with appropriate startTime and endTime
		//else render the nonworkingLayout
		(this.state.working === 'ON') ? status = workingLayout({startTime:this.state.openingHour, endTime:this.state.closingHour}) : status = notWorkingLayout()

		return(
			<ImageBackground source={require('../assets/barberbackground.jpg')} 
			style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'}}>
				<Image source={require('../assets/logo.png')}
				style={{width: '45%', height: '45%'}}></Image>
				{status}
			</ImageBackground>
		);}
}

const Homestyles = StyleSheet.create({
	statusBox: {
		flex : 0.5,
		justifyContent : 'center',
		alignItems : 'center',
		backgroundColor : 'black',
		opacity : 0.8
	},
	statusText: {
		color : 'white',
		fontSize : 20
	}
})



