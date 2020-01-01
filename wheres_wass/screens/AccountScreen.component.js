import React,{ Component } from 'react';
import { View, Text, Button, TextInput, StyleSheet  } from 'react-native';
import firebase,{facebookAppID} from '../config';
import * as Facebook from 'expo-facebook';
import { FontAwesome } from '@expo/vector-icons';
import accountStyles from '../styles/AccountStyles';

class Account extends Component{
    constructor(props){
		super(props);
		this.state = {
			user : firebase.auth().currentUser
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

	async loginWithFacebook() {
		await Facebook.initializeAsync(facebookAppID).then(console.log("Initialized Async"))
	
		const { type, token } = await Facebook.logInWithReadPermissionsAsync(facebookAppID,
			{permissions: ['public_profile'] }
		);
	
		if (type === 'success'){
			//Build firebase credentials with the Facebook access token
			const credential = firebase.auth.FacebookAuthProvider.credential(token);
	
			//Sign in with credential from the facebook user
			firebase.auth().signInWithCredential(credential).then(this.props.navigation.push('Account')).catch((error) =>{
			console.log("We have failed"+error.message)
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
				<View style = {{flex:1,justifyContent:'center', alignContent :'center', backgroundColor:'black'}}>
					<Text style={{fontSize:40, color : 'white'}}>Hello, Signed in as:</Text>
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
					<Button title = 'Login with Email' onPress= {() => this.props.navigation.navigate('Login') } />
					<Text> OR </Text>
					<Button title = 'Login with Facebook' onPress = {() => this.loginWithFacebook()}/>
					<Text>OR</Text>
					<Button title = 'Create account with Email' onPress = {() => this.props.navigation.navigate('CreateAccount')} />

				</View>
			)
		}
    }
}

export default Account;
