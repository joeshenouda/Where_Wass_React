import React, { Component } from 'react';
import { View, Text, Button,TextInput,StyleSheet } from 'react-native';
//Because facebookAppID not the default export must be wrapped in curly
import firebase,{ facebookAppID } from '../config';
import * as Facebook from 'expo-facebook';

class Login extends Component { 
    constructor(props){
	super(props);
	this.state = {
          email : '',
	  password : ''
	};
    }

<<<<<<< Updated upstream
    async loginWithFacebook() {
	console.log("Called loginWithFacebook");
	const { type, token } = await Facebook.logInWithReadPermissionsAsync(facebookAppID,
	    {permissions: ['public_profile'] }
	);
	console.log("Finished the awaiting");

	if (type === 'success'){
	    //Build firebase credentials with the Facebook access token
	    const credential = firebase.auth.FacebookAuthProvider.credential(token);

	    //Sign in with credential from the facebook user
	    firebase.auth().signInWithCredential(credential).catch((error) =>{
		console.log("We have failed"+error.message)
	    });
	}
    }
=======
    
>>>>>>> Stashed changes

    loginWithEmail(){
		firebase.auth().signInWithEmailAndPassword(this.state.email,this.state.password).catch((error) => console.log("Failure in signing in with email and password"))
		.then(
			() => this.props.navigation.navigate('Account')
		)
	
    }


    render(){
	return(
	    <View style={{flex : 1, justifyContent : "center", alignItems: "center"}}>
	        <TextInput style = {style.textinput} autoCapitalize = 'none' placeholder = 'Enter Email' onChangeText = { (text) => this.setState({email : text}) } />	
	    	<TextInput style = {style.textinput} autoCapitalize = 'none' placeholder = 'Enter Password' secureTextEntry = {true} onChangeText = {(text) => this.setState({password : text})} />
	    	<Button title = 'Log in' onPress = {() => this.loginWithEmail()}/>
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
