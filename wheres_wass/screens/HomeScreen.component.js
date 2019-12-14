import React, { Component  } from 'react';
import { StyleSheet, Text, View, Button, ImageBackground, Image} from 'react-native';
import styles from '../styles/Styles';
import { FontAwesome  } from '@expo/vector-icons';
import firebase from '../config';


//Initializing the database object from firebase
firebaseDatabase = firebase.database();

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
		    console.log('setState for Home was called')
		});
		
	}
	//Listen for admin will change the header bar by adding a button when the authState changes and is Wass
	listenForAdmin(){
		firebase.auth().onAuthStateChanged( (currUser) => {
			if (currUser != null && currUser.uid =='wxvpFDGbWlQSVLtWiXepnkShU6D3'){
				this.props.navigation.setParams({'admin': 'true'})
			}
			else{
				this.props.navigation.setParams({'admin': 'false'})
			}
		})
	}

    	didFocusSubscription() {
	    this.props.navigation.addListener('didFocus', () => {
	    this.listenForHours(this.business_hoursRef)
    	    console.log('didFocus called for HomeScreen')
	})
	}

    	didBlurSubscription(){
	    this.props.navigation.addListener('didBlur', () => { 
	    this.business_hoursRef.off()
	    console.log('didBlur called for HomeScreen')
	})
	}

	//Calls our listenForHours function once before rendering component
	componentDidMount(){
	    	console.log('componentDidMount for home was called')
		//this.listenForHours(this.business_hoursRef)
	    	this.didFocusSubscription()
	    	this.didBlurSubscription()
		this.listenForAdmin()
	}

	componentWillUnmount(){
	    	console.log('componentWillUnmount for home was called')
		this.business_hoursRef.off()
	}

	//Setting the header for users to access nav drawer
    static navigationOptions = ({ navigation }) =>  {
		const headerObj = {
			title: "Where's Wass",
			
			headerLeft: () => (
				<FontAwesome.Button name="bars" 
				onPress ={ () => { navigation.toggleDrawer()}}
				backgroundColor='black'
				/>
			)
		}
		//Checks if the person signed in is now Wass and adds a property to the headerObj for a button
		if (navigation.getParam('admin','false') == 'true'){
			headerObj['headerRight'] = () => (
				<Button title='Admin' onPress={() => {navigation.navigate('AdminPortal')}}/>
			)
		}

		return headerObj;
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
		width : 250,
		justifyContent : 'center',
		alignItems : 'center',
		backgroundColor : 'black',
		opacity : 0.8,
	},
	statusText: {
		color : 'white',
		fontSize : 20
	}
})



