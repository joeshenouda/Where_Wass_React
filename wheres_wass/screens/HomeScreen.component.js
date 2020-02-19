import React, { Component  } from 'react';
import { StyleSheet, Text, View, Button, ImageBackground, Image, Alert,ScrollView,
	 TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import { FontAwesome  } from '@expo/vector-icons';
import firebase from '../config';
import Modal from 'react-native-modal';

//Initializing the database object from firebase
firebaseDatabase = firebase.database();

//To convert numerical day of month received by Date() object to string for Firebase
let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
let today = new Date()

//object mapping uids to push ids
let uid_to_pushRef = {}

//Home component to show current hours
export default class HomeScreen extends Component {
	constructor(props){
		super(props);
		this.state = {
			working: 'ON',
			openingHour: 'Loading...',
			closingHour: 'Loading...',
			tomorrowWorking : 'OFF',
			tomorrowOpeningHour : 'Loading...',
			tomorrowClosingHour : 'Loading...',
			queueLength : 0,
			joinedWaitList : false,
			clientsInWait : [],
			waitlistOn : true,
			currUserSnapKey : '',
			announcementVisible : false,
			announcementMessage : ''
		},
		this.business_hoursMonthlyRef = firebaseDatabase.ref('business_hours/'+months[today.getMonth()]+'/'+today.getDate())

		let tomorrow = new Date(today)
		tomorrow.setDate(today.getDate()+1)
		this.business_hoursMonthlyRefTomorrow = firebaseDatabase.ref('business_hours/'+months[tomorrow.getMonth()]+'/'+tomorrow.getDate())

		this.waitListRef = firebaseDatabase.ref('waitList');
	}
	//Called everytime a child changes on the database for the given day
	listenForHours(isTomorrow) {
		console.log('Listen for hours called')

		let monthlyValExists = true
		//First checks if we want TODAY's hours
		if(!isTomorrow){
			//This checks if the data exists in the monthly
			this.business_hoursMonthlyRef.on('value', (snap) => {
				if(snap.exists() && snap.child('start_time').exists() && snap.child('end_time').exists() && snap.child('working').exists()){
					console.log('Monhtly EXISTS!!')
					this.setState({
						openingHour : snap.child('start_time').val(),
						closingHour : snap.child('end_time').val(),
						working : snap.child('working').val()
					})
				}
			})
				
			
		}
		else{
			//This first checks if the data exists in the monthly
			this.business_hoursMonthlyRefTomorrow.on('value', (snap) => {
				if(snap.exists() && snap.child('start_time').exists() && snap.child('end_time').exists() && snap.child('working').exists()){
					this.setState({
						tomorrowOpeningHour : snap.child('start_time').val(),
						tomorrowClosingHour : snap.child('end_time').val(),
						tomorrowWorking : snap.child('working').val()
					})
				}
				else{
					monthlyValExists = false
				}
			})
		}
		
	}

	//Listener for children added to Wait list
	listenForWaitlist(FBWaitRef){

	    	//Checks if wass has turned off waitlist feature
	    	firebaseDatabase.ref('/Admin/waitlist').on('value', (snap) => {
		    this.setState({
				waitlistOn : snap.val() == "ON" ? true : false
			})

		})

		FBWaitRef.orderByKey().on('child_added', (snap) => {
			console.log('Child added was called for waitList')
			var currUser = firebase.auth().currentUser;
			uid_to_pushRef[snap.val().uid] = snap.key; 
			if(currUser != null && snap.val().uid == currUser.uid){
				console.log('Child added called for waitlist with uid = '+snap.val().uid+ ' and currentUser uid is '+firebase.auth().currentUser.uid)
				this.setState(prevState => ({
					queueLength : prevState.queueLength,
					joinedWaitList : true,
					clientsInWait : prevState.clientsInWait.concat(snap.key),
					currUserSnapKey : snap.key
				}))
			}
			else{
				if(!this.state.clientsInWait.includes(snap.key) || snap.val().uid == null){
					console.log('Child added called for waitlist with snap key '+snap.key+' and joinedWaitlist is '+this.state.joinedWaitList)
					this.setState(prevState => ({
						queueLength : !prevState.joinedWaitList ? prevState.queueLength+1 : prevState.queueLength,
						clientsInWait : prevState.clientsInWait.concat(snap.key),
					}))
				}
			}
		})

		FBWaitRef.orderByKey().on('child_removed', (snap) => {
			var currUser = firebase.auth().currentUser;
			if(currUser != null && snap.val().uid == currUser.uid){
				this.setState(prevState => ({
					queueLength : prevState.clientsInWait.length - 1,
					joinedWaitList : false,
					//filter returns a new array with all the elements that pass the test in the function
					//In this case we keeping all the uids that are not eqaul to the one that was removed in Firebase
					clientsInWait : prevState.clientsInWait.filter(keys => keys != snap.key)
				}))
			}
			else{
				this.setState(prevState => ({
					//If the current user is behind the person who was just removed from the queue we will decrease queue length
					//else keep it the same 
					queueLength : (prevState.currUserSnapKey.localeCompare(snap.key) > 0) ? prevState.queueLength - 1 : prevState.queueLength,
					//filter returns a new array with all the elements that pass the test in the function
					//In this case we keeping all the uids that are not eqaul to the one that was removed in Firebase
					clientsInWait : prevState.clientsInWait.filter(keys => keys != snap.key)
				}))
			}
		})
	}
	//Listen for admin will change the header bar by adding a button when the authState changes and is Wass or Joe Shenouda
	listenForAdmin(){
		const unsubscribe = firebase.auth().onAuthStateChanged(
			(currentUser) =>{
				//Immediateyl unsubscribe the onAuthStateChanged because we override it again in AccountScreen
				unsubscribe();
				this.setState({user : currentUser})
				if (currentUser != null && (currentUser.uid =='wxvpFDGbWlQSVLtWiXepnkShU6D3'|| currentUser.uid == 'Fl410iXYnfM19EZODAY4mWKmehW2')){
					this.props.navigation.setParams({'admin': 'true'})
				}
				else{
					this.props.navigation.setParams({'admin': 'false'})
				}
			}
		)

	}

	//Function to add user to waitlist
	addToWaitList = () => {
		let user = firebase.auth().currentUser;
		let waitlist = this.state.waitlistOn
		console.log('The value of waitlist is '+waitlist);
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
						onPress: () => this.props.navigation.navigate('Account')
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
		else if (!waitlist){
		    Alert.alert(
			    //Alert
			    'Sorry',
			    //Alert message
			    'We are not currently accepting anymore clients on the waitlist',
			    [
				    {
					text: 'Ok',
				    },
			    ],
			    {cancelable: false},
			);

		}
		else{
			let dateNow = new Date()
			firebaseDatabase.ref('waitList').push({uid : user.uid, name : user.displayName, email : user.email, time : dateNow.toString()})
		}
	}

	//Function to remove user from waitlist
	removeFromWaitList = () => {
		var parentPushRef = uid_to_pushRef[firebase.auth().currentUser.uid]
		console.log('The push id is '+parentPushRef)
	
		//Remove this child from the waitlist
		firebaseDatabase.ref('waitList/'+parentPushRef).remove().then(
			() => console.log('Successfully removed ' + firebase.auth().currentUser.uid+ ' from waitlist')
		)
	}

    	didFocusSubscription() {
	    this.props.navigation.addListener('didFocus', () => {
			this.listenForHours(false)
			this.listenForHours(true)
			this.listenForWaitlist(this.waitListRef)
			this.listenForAdmin()
		})
	}

    	didBlurSubscription(){
	    this.props.navigation.addListener('didBlur', () => { 
		this.business_hoursMonthlyRef.off()
		this.business_hoursMonthlyRefTomorrow.off()
		this.waitListRef.off()
		//Reset everything
		this.setState({
			clientsInWait : [],
			queueLength : 0,
			joinedWaitList : false
		})
	})
	}


	//Shows announcement first thing when one opens the app
	componentDidMount(){
		this.props.navigation.setParams({makeAnnouncementVisible: () => {
			console.log('Make annoucnement visible called')
			let announcementRef = firebaseDatabase.ref('Admin')
				announcementRef.once('value',(snap) => {
					this.setState({
						announcementVisible : true,
						announcementMessage : snap.child('news').val()
					})
				})
			}	
		})


		firebaseDatabase.ref('Admin').once('value',(snap) => {
			this.setState({
				announcementVisible : true,
				announcementMessage : snap.child('news').val()
			})
		})

	    this.didFocusSubscription()
		this.didBlurSubscription()
		

		
	}

	componentWillUnmount(){
		this.business_hoursMonthlyRefTomorrow.off()
		this.business_hoursMonthlyRef.off()
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
		else{
			headerObj['headerRight'] = () => (
				<TouchableOpacity onPress={navigation.getParam('makeAnnouncementVisible')}>
			    	<View style={{flex:1}}>
						<Image source={require('../assets/hairDryer.png')} style={{padding: 10, marginRight: 20, height: 25, width: 25, top:10 , resizeMode: 'cover'}}/>
			    			<View style={Homestyles.redBadge}/>
			</View>	
			    </TouchableOpacity>
			)
		}

		return headerObj;
	}
	
    render(){
		//Determine whether working next day or not
		var workingTomorrow = this.state.tomorrowWorking == 'OFF' ? <Text style = {Homestyles.tomorrowStatus}>Tomorrow we are closed</Text> :
		<Text style = {Homestyles.tomorrowStatus}>Tomorrow: {this.state.tomorrowOpeningHour} to {this.state.tomorrowClosingHour}</Text> 

		//Two layouts for switching b/t working and non working layouts
		const workingLayout = () => {
			var waitlistButton = this.state.joinedWaitList ? <Button color = 'red' title = 'Leave Waitlist' onPress = {() => this.removeFromWaitList()}/> : 
														<Button color = 'orange' title = 'Join waitlist' onPress = {() => this.addToWaitList()}/>

			return(
				<View style = {Homestyles.statusBox}>
					<Text style = {{color: 'orange', justifyContent: 'center', fontSize : 20, marginBottom : 10}}> {this.state.queueLength} clients ahead of you</Text>
					{waitlistButton}
					<Text style = {Homestyles.statusText}>{this.state.openingHour}</Text>
					<Text style = {{fontSize:20, color: 'gray'}}>to</Text>
					<Text style = {Homestyles.statusText}>{this.state.closingHour}</Text>
					{workingTomorrow}
				</View>
			)
		}

		const notWorkingLayout = () => {
			return(
				<View style ={Homestyles.statusBox}>
					<Text style = {{color:'white', fontSize:35, alignSelf : 'center'}}>Off</Text>
					{workingTomorrow}
				</View>
			)
		}
		//Render a different layout based on working status
		//if ON render the workingLayout with appropriate startTime and endTime
		//else render the nonworkingLayout
		(this.state.working === 'ON') ? status = workingLayout() : status = notWorkingLayout()

		return(
			<ImageBackground source={require('../assets/barberbackground.jpg')} 
			style={{alignItems: 'center', width: '100%', height: '100%'}}>
				<Image source={require('../assets/logo.png')} style={{width: '45%', height: '45%', flex: 1, bottom : '-10%'}}/>
				{status}	
				<Modal isVisible={this.state.announcementVisible}
				onBackdropPress={()=> this.setState({announcementVisible:false})} hideModalContentWhileAnimating={true}
				backdropTransitionOutTiming={0}>
				<TouchableOpacity 
					activeOpacity={1} 
					onPressOut={() => {this.setModalVisible(false)}}>
					<ScrollView 
					directionalLockEnabled={true} 
					>
					<TouchableWithoutFeedback>
					<View style={{ flex: 1, justifyContent:'center', alignContent:'center', alignItems:'center'}} >
						<View style={{flex:1, borderRadius:30, width : 500}} backgroundColor='white'>
							<Image source={require('../assets/announcementPic.png')} style={{flex:1, resizeMode:'cover', width:500, height: 300, borderTopLeftRadius:30, borderTopRightRadius:30}}/>
							<Text style={{flex:3, padding:10, alignSelf:'center'}}>{this.state.announcementMessage}</Text>
						</View>
					</View>					
					</TouchableWithoutFeedback>
					</ScrollView>
				</TouchableOpacity> 
				</Modal>
			</ImageBackground>
		);}
}

const Homestyles = StyleSheet.create({
	statusBox: {
		flex : 1,
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
		fontSize : 30
	},
	tomorrowStatus: {
		color : 'white',
		fontSize: 15,
	},
	redBadge: {
	    backgroundColor:'red',
	    position:'absolute',
	    width: 15,
	    height: 15,
	    right: 10,
	    top:5,
	    borderRadius: 80,
	}
})



