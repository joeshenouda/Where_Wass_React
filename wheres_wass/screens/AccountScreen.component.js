import React,{ Component } from 'react';
import { View, Text, Button, TextInput, StyleSheet  } from 'react-native';
import firebase,{facebookAppID} from '../config';
import * as Facebook from 'expo-facebook';
import { FontAwesome } from '@expo/vector-icons';

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
			console.log('Set the user state to currentUser making it '+this.state.user)
			}
		)
	}
	
    render(){
	if (this.state.user != null){
	    return(
		<View>
		    <Text>Signed in as {this.state.user.displayName} </Text>
		    <Button title = 'Sign out' onPress = {() => firebase.auth().signOut().then( 
			() => this.props.navigation.navigate('Home')
		    )}/>
		</View>
	    )
    }
	else{
	    return(
		<View style = {{flex: 1 , justifyContent : 'center', alignItems : 'center'}}>
		    <Text>You are not signed in</Text>
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
