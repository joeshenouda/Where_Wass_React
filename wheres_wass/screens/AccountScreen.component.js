import React,{ Component } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert, Image, KeyboardAvoidingView } from 'react-native';
import firebase,{facebookAppID} from '../config';
import * as Facebook from 'expo-facebook';
import { FontAwesome } from '@expo/vector-icons';
import accountStyles from '../styles/AccountStyles';
import { SocialIcon } from 'react-native-elements';

class Account extends Component{
    constructor(props){
		super(props);
		this.state = {
			user : firebase.auth().currentUser,
			email : '',
			password : '',
			unSubFunc : null
		}
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

	loginWithEmail(){
		firebase.auth().signInWithEmailAndPassword(this.state.email,this.state.password).catch((error) =>{
			Alert.alert(
				'Error',
				error.message,
				[
				  {text: 'Try Again', onPress: () => console.log('Ask me later pressed')},
				],
				{cancelable: false},
			  );
		})
    }

	async loginWithFacebook() {
		try{
			await Facebook.initializeAsync(facebookAppID).then(console.log("Initialized Async")).catch((error) => {
				console.log(error)
			})

		
			const { type, token, expires, permissions, declinedPermissions } = await Facebook.logInWithReadPermissionsAsync(facebookAppID,
				{permissions: ['public_profile'] }
			);
		
			if (type === 'success'){
				//Prints out permissions
				console.log('Granted permissions are  '+permissions)
				console.log('Declined permissions are '+declinedPermissions)

				//Build firebase credentials with the Facebook access token
				const credential = firebase.auth.FacebookAuthProvider.credential(token);
		
				//Sign in with credential from the facebook user
				firebase.auth().signInWithCredential(credential).then(
					Alert.alert(
						'Facebook Login',
						'Login Successful!',
						[
						{text: 'Go to Home', onPress: () => this.props.navigation.navigate('Home')},
						],
						{cancelable: false},
					)
				).catch((error) =>{
					Alert.alert(
						'Facebook Login',
						'Login to firebase failed'+error.message,
						[
						{text: 'Try Again', onPress: () => console.log('try again pressed')},
						{
							text: 'Cancel',
							onPress: () => console.log('Cancel Pressed'),
							style: 'cancel',
						},
						],
						{cancelable: false},
					);
				});
			}
			else{
				console.log('Cancelled facebook')
		}
	}
		catch({message}){
			console.log('Facebook login error '+message)
		}
	}
	didFocusSubscription() {
	    this.props.navigation.addListener('didFocus', () => {
			const unsub = firebase.auth().onAuthStateChanged((currentUser) => {
				//First checks that we are on the Account screen
				if(this.props.navigation.state.routeName == 'Account'){
					//Checks if the auth state has changed from null to non-null
					if(currentUser != null && this.state.user == null){
						Alert.alert(
							'Welcome',
							'Login Successful!',
							[
								{text: 'Go to Home', onPress: () => this.props.navigation.navigate('Home')},
							],
							{cancelable: true},
						)
					}
					this.setState({user:currentUser, unSubFunc : unsub})
				}
			})
		})
	}

	didBlurSubscription(){
		if(this.state.unSubFunc != null){
			this.state.unSubFunc()
		}
	}
    
    componentDidMount(){
		this.didFocusSubscription()
		this.didBlurSubscription()
	}
	
    render(){
		if (this.state.user != null){
			return(
				<View style = {{flex:1,justifyContent:'space-evenly', alignItems :'center', backgroundColor:'black'}}>
					<Image source={require('../assets/logo.png')}
						style={{width: '50%', height: '40%', justifyContent: 'flex-start'}}></Image>
					<Text style={{fontSize:30, color : 'white'}}>Hello, Signed In as:</Text>
					<View>
						<Text style={{color: 'white'}}>Your Name:</Text>
						<Text style={{ fontWeight:'bold', fontSize : 30, color:'white'}}>{this.state.user.displayName}</Text>	
					</View>
					<View>
						<Text style={{color: 'white'}}>Your Email:</Text>
						<Text style={{ fontWeight:'bold',fontSize : 25, color:'white'}}>{this.state.user.email}</Text> 
					</View>
					<Button title = 'Sign out'  color='orange'  onPress = {() => firebase.auth().signOut().then( () => this.props.navigation.navigate('Home'))}/>


				</View>
			)
		}
		else{
			return(
			<KeyboardAvoidingView behavior='padding' style={{flex:1, justifyContent:'space-between'}}>
				<View style = {accountStyles.container}>
					<Image source={require('../assets/logo.png')} style = {{width:'50%', height:'50%', alignSelf:'center', bottom:'-10%'}}></Image>
					<Text style = {accountStyles.textStyle}>Welcome to Where's Wass!</Text>
					<TextInput style = {accountStyles.textinput} autoCapitalize = 'none' placeholder = 'Enter Email' onChangeText = { (text) => this.setState({email : text}) } />	
					<TextInput style = {accountStyles.textinput} autoCapitalize = 'none' placeholder = 'Enter Password' secureTextEntry = {true} onChangeText = {(text) => this.setState({password : text})} />
					<View style={{margin:10}}>
						<Button style = {accountStyles.buttons} color ='orange' title = 'Log in with email' onPress = {() => this.loginWithEmail()}/>
						<SocialIcon style = {accountStyles.buttons} title= 'Sign in with Facebook' button type="facebook" onPress = {() => this.loginWithFacebook()}/>
						<Button style = {accountStyles.buttons} color ='orange' title = 'Create account with Email' onPress = {() => this.props.navigation.navigate('CreateAccount')} />
					</View>
				</View>
			</KeyboardAvoidingView>
			)
		}
    }
}


export default Account;
