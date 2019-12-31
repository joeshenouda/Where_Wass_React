import React, { Component  } from 'react';
import { StyleSheet, Text, View, Button, ImageBackground, Image, Alert} from 'react-native';
import styles from '../styles/Styles';
import { FontAwesome  } from '@expo/vector-icons';
import firebase from '../config';


//Initializing the database object from firebase
firebaseDatabase = firebase.database();

//To convert numerical day of week received by Date() object to string for Firebase
let daysOfWeek  =['Sunday', 'Monday', 'Tuesday', 'Wednesday','Thursday','Friday','Saturday']
let dayOfWeek = new Date().getDay()

//object mapping uids to push ids
let uid_to_pushRef = {}

let addToWaitList = (props) => {
	let user = firebase.auth().currentUser;
	if (user == null){
		// Works on both Android and iOS
		Alert.alert(
			//Alert
			'User not logged in',
			//Alert message
			'You must sign in to use the waitlist feature',
			[
				{
					text: 'Sign in',
					onPress: () => props.navigation.navigate('Account')
				},
				{
					text: 'Cancel',
					onPress: () => console.log('Cancel Pressed'),
					style: 'cancel',
				},
			],
			{cancelable: false},
		);
	}
	else{
		firebaseDatabase.ref('waitList').push({uid : user.uid, name : user.displayName, email : user.email})
	}
}

let removeFromWaitList = () => {
	var parentPushRef = uid_to_pushRef[firebase.auth().currentUser.uid]
	console.log('The push id is '+parentPushRef)

	//Remove this child from the waitlist
	firebaseDatabase.ref('waitList/'+parentPushRef).remove().then(
		() => console.log('Successfully removed ' + firebase.auth().currentUser.uid+ ' from waitlist')
	)
}
//Two layouts for switching b/t working and non working layouts
const workingLayout = (props) => {
	var waitlistButton = props.joinedWaitList ? <Button color = 'red' title = 'Leave Waitlist' onPress = {() => removeFromWaitList()}/> : 
												<Button color = 'orange' title = 'Join waitlist' onPress = {() => addToWaitList(props)}/>

	return(
		<View style = {Homestyles.statusBox}>
			<Text style={{ color: 'white', justifyContent: 'center', fontSize: 30,}}>Where's Wass?</Text>
			<Text style = {{color: 'orange', justifyContent: 'center', fontSize : 25}}> Waitlist: {props.queueLength} clients</Text>
			{waitlistButton}
			<Text style = {Homestyles.statusText}>{props.startTime}</Text>
			<Text style = {Homestyles.statusText}>to</Text>
			<Text style = {Homestyles.statusText}>{props.endTime}</Text>
			<Text style = {{fontSize : 15, color : 'white'}}>Tomorrow: </Text>

		</View>
	)
}

const notWorkingLayout = () => {
	return(
		<View style ={Homestyles.statusBox}>
			<Text style={{ color: 'white', justifyContent: 'center', fontSize: 30,}}>Where's Wass?</Text>
			<Text style = {Homestyles.statusText}>OFF</Text>
			<Text style = {{fontSize : 12, color : 'white'}}>Tomorrow: </Text>
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
			queueLength : 0,
			joinedWaitList : false,
			clientsInWait : []
		},
		this.business_hoursRef = firebaseDatabase.ref('business_hours/'+daysOfWeek[dayOfWeek])
		this.waitListRef = firebaseDatabase.ref('waitList');
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

	//Listener for children added to Wait list
	listenForWaitlist(FBWaitRef){

		FBWaitRef.orderByKey().on('child_added', (snap) => {
			console.log('Child added was called for waitList')
			var currUser = firebase.auth().currentUser;
			uid_to_pushRef[snap.val().uid] = snap.key; 
			if(currUser != null && snap.val().uid == currUser.uid){
				console.log('Child added called for waitlist with uid = '+snap.val().uid+ ' and currentUser uid is '+firebase.auth().currentUser.uid)
				this.setState(prevState => ({
					queueLength : prevState.clientsInWait.includes(snap.val().uid) ? prevState.queueLength : prevState.queueLength+1,
					joinedWaitList : true,
					clientsInWait : prevState.clientsInWait.concat(snap.val().uid)
				}))
			}
			else{
				if(!this.state.clientsInWait.includes(snap.val().uid)){
					this.setState(prevState => ({
						queueLength : prevState.queueLength+1,
						clientsInWait : prevState.clientsInWait.concat(snap.val().uid),
						//First checks that currUser is not null if it is null make joinedWaitList false
						//Then assigns joinedWaitList to true only if clientInWait contains the currUser's uid
						joinedWaitList : currUser ? (prevState.clientsInWait.includes(currUser.uid) ? true : false) : false
					}))
				}
			}
		})

		FBWaitRef.orderByKey().on('child_removed', (snap) => {
			var currUser = firebase.auth().currentUser;
			if(currUser != null && snap.val().uid == currUser.uid){
				this.setState(prevState => ({
					queueLength : prevState.queueLength-1,
					joinedWaitList : false,
					//filter returns a new array with all the elements that pass the test in the function
					//In this case we keeping all the uids that are not eqaul to the one that was removed in Firebase
					clientsInWait : prevState.clientsInWait.filter(uids => uids != snap.val().uid)
				}))
			}
			else{
				this.setState(prevState => ({
					queueLength : prevState.queueLength - 1,
					//filter returns a new array with all the elements that pass the test in the function
					//In this case we keeping all the uids that are not eqaul to the one that was removed in Firebase
					clientsInWait : prevState.clientsInWait.filter(uids => uids != snap.val().uid)
				}))
			}
		})
	}
	//Listen for admin will change the header bar by adding a button when the authState changes and is Wass or Joe Shenouda
	listenForAdmin(){
		firebase.auth().onAuthStateChanged( (currUser) => {
			if (currUser != null && (currUser.uid =='wxvpFDGbWlQSVLtWiXepnkShU6D3'|| currUser.uid == 'Fl410iXYnfM19EZODAY4mWKmehW2')){
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
			this.listenForWaitlist(this.waitListRef)
		})
	}

    	didBlurSubscription(){
	    this.props.navigation.addListener('didBlur', () => { 
		this.business_hoursRef.off()
		this.waitListRef.off()
	})
	}

	//Calls our listenForHours function once before rendering component
	componentDidMount(){
	    this.didFocusSubscription()
	    this.didBlurSubscription()
		this.listenForAdmin()
	}

	componentWillUnmount(){
		this.business_hoursRef.off()
		this.waitListRef.off()
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
		(this.state.working === 'ON') ? status = workingLayout({startTime:this.state.openingHour,
																endTime:this.state.closingHour, 
																navigation:this.props.navigation, 
																queueLength: this.state.queueLength,
																joinedWaitList : this.state.joinedWaitList}) : status = notWorkingLayout()

		return(
			<ImageBackground source={require('../assets/barberbackground.jpg')} 
			style={{alignItems: 'center', width: '100%', height: '100%'}}>
					<Image source={require('../assets/logo.png')}
					style={{width: '45%', height: '45%', flex: 0.7, bottom : '-10%'}}></Image>
					{status}				
			</ImageBackground>
		);}
}

const Homestyles = StyleSheet.create({
	statusBox: {
		flex : 0.5,
		justifyContent : 'space-between',
		alignItems : 'center',
		backgroundColor : 'black',
		opacity : 0.8,
		margin : 30,
		padding : 35,
		top : '-2.5%'
	},
	statusText: {
		color : 'white',
		fontSize : 20
	}
})



