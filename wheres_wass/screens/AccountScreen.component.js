import React,{ Component } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert, Image } from 'react-native';
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
			password : ''
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
		firebase.auth().signInWithEmailAndPassword(this.state.email,this.state.password).catch((error) => console.log("Failure in signing in with email and password"))
		.then(
			() => {
				Alert.alert(
					'Email Login',
					'Login Successful!',
					[
					  {text: 'Go to Home', onPress: () => this.props.navigation.navigate('Home')},
					],
					{cancelable: false},
				  )
			}
		)
	
    }

	async loginWithFacebook() {
		await Facebook.initializeAsync(facebookAppID).then(console.log("Initialized Async")).catch((error) => {
			Alert.alert(
				'Facebook Login',
				'Login to facebook failed'+error.message,
				[
				  {text: 'Try Again', onPress: () => console.log('Ask me later pressed')},
				  {
					text: 'Cancel',
					onPress: () => console.log('Cancel Pressed'),
					style: 'cancel',
				  },
				],
				{cancelable: false},
			  );
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
	}
    
    componentDidMount(){
		firebase.auth().onAuthStateChanged(
			(currentUser) =>{
				this.setState({user : currentUser})
			}
		)
	}
	
    render(){
		if (this.state.user != null){
			return(
				<View style = {{flex:1,justifyContent:'space-evenly', alignItems :'center', backgroundColor:'black'}}>
					<Image source={require('../assets/logo.png')}
						style={{width: '50%', height: '40%', justifyContent: 'flex-start'}}></Image>
					<Text style={{fontSize:30, color : 'white'}}>Hello, Signed In as:</Text>
					<View style = {{borderColor : 'orange', borderWidth : 4, margin:10}}>
						<Text style={{borderColor:'orange', fontWeight:'bold', fontSize : 30, color:'white'}}>{this.state.user.displayName}</Text>	
					</View>
					<View style = {{borderColor : 'orange', borderWidth : 4, margin:10}}>
						<Text style={{borderColor:'orange', fontWeight:'bold',fontSize : 25, color:'white'}}>{this.state.user.email}</Text> 
					</View>
					<Button title = 'Sign out'  color='orange'  onPress = {() => firebase.auth().signOut().then( () => this.props.navigation.navigate('Home'))}/>


				</View>
			)
		}
		else{
			return(
			<View style = {accountStyles.container}>
					<Image source={require('../assets/logo.png')}
						style={{width: '50%', height: '40%'}}></Image>
					<Text style = {accountStyles.textStyle}>Welcome to Where's Wass!</Text>
					<View style = {accountStyles.buttons}>
					<TextInput style = {style.textinput} autoCapitalize = 'none' placeholder = 'Enter Email' onChangeText = { (text) => this.setState({email : text}) } />	
					<TextInput style = {style.textinput} autoCapitalize = 'none' placeholder = 'Enter Password' secureTextEntry = {true} onChangeText = {(text) => this.setState({password : text})} />
					</View>
					<View style = {accountStyles.buttons}>
					<Button color ='orange' title = 'Log in with email' onPress = {() => this.loginWithEmail()}/>
					<SocialIcon title= 'Sign in with Facebook' button type="facebook" onPress = {() => this.loginWithFacebook()}/>
					<Button color ='orange' title = 'Create account with Email' onPress = {() => this.props.navigation.navigate('CreateAccount')} />
					</View>
				
			</View>
			)
		}
    }
}


const style = StyleSheet.create({
    textinput : {
	borderColor : 'orange',
	borderWidth : 2,
	padding : 10,
	width : 300,
	color : 'white'
	
    }
})

export default Account;
