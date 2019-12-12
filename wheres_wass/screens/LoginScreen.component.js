import React, { Component } from 'react';
import { View, Text, Button,TextInput,StyleSheet } from 'react-native';
//Because facebookAppID not the default export must be wrapped in curly
import firebase,{facebookAppID} from '../config';
import * as Facebook from 'expo-facebook';

//Sets the onAuthStateChanged listener callback method
firebase.auth().onAuthStateChanged((user)=>{
    if(user!=null){
	console.log("We're in hello" + user.displayName);
    }
});

class Login extends Component { 
    constructor(props){
	super(props);
	this.state = {
          email : '',
	  password : ''
	};
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
	    firebase.auth().signInWithCredential(credential).then(this.props.navigation.navigate('Home')).catch((error) =>{
		console.log("We have failed"+error.message)
	    });
	}
    }

    loginWithEmail(){
	firebase.auth().signInWithEmailAndPassword(this.state.email,this.state.password).catch((error) => console.log("Failure in signing in with email and password"))
	
    }

    signOut(){
	firebase.auth().signOut().then(() => this.props.navigation.navigate('Home'))
    }


    render(){
	return(
	    <View style={{flex : 1, justifyContent : "center", alignItems: "center"}}>
	        <TextInput style = {style.textinput} placeholder = 'Enter Email' onChangeText = { (text) => this.setState({email : text}) } />	
	    	<TextInput style = {style.textinput} placeholder = 'Enter Password' secureTextEntry = {true} onChangeText = {(text) => this.setState({password : text})} />
	    	<Button title = 'Log in' onPress = {() => this.loginWithEmail()}/>
	    	<Button onPress = {() => this.loginWithFacebook()} title = 'Login with Facebook'/>
	    	<Button title = "Sign Out" onPress = {() => this.signOut()}/>
	    </View>
	)
    }


}

const style = StyleSheet.create({
    textinput : {
	borderColor : 'orange',
	borderWidth : 2,
	padding : 10,
	width : 300
	
    }
})

export default Login;
