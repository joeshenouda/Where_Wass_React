import React, { Component } from 'react';
import { View, Text, Button,TextInput,StyleSheet, Alert, KeyboardAvoidingView } from 'react-native';
//Because facebookAppID not the default export must be wrapped in curly
import firebase from '../config';

class CreateAccountScreen extends Component { 
    constructor(props){
    super(props);
    this.state = {
        email : '',
        password : '',
        reenteredPS : '',
        name : '',
        phoneNumber : ''
    };
    }

    _onPressCreate() {
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).catch((errors) => {
            let errorCode = errors.code;
            let errorMessage = errors.message;
            if(this.state.name = ''){
                Alert.alert(
                    'Could not Create Account',
                    'Please enter your name',
                    [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                    ],
                    {cancelable: false},
                );
            }
            if (errorCode == 'auth/weak-password'){
                Alert.alert(
                    'Could not Create Account',
                    'Password too weak',
                    [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                    ],
                    {cancelable: false},
                );
            }
            else{
                Alert.alert(
                    'Could not Create Account',
                    errorMessage,
                    [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                    ],
                    {cancelable: false},
                );
            }
        }).then( 
            (userCreds) => {
                if(userCreds){
                    var newUser = userCreds.user;
                    if(newUser != null){
                        newUser.updateProfile(
                            {
                                displayName : this.state.name,
                            }
                        ).then(() => {
                                this.props.navigation.navigate('Account')
                            }
                        ).catch((error => console.log(error.message)))
                        
                    }
                    else{
                        this.props.navigation.push('CreateAccount')
                    } 
                }
            }
        )
    }


    render(){
    return(
        <KeyboardAvoidingView
            contentContainerStyle={style.container}
            behavior = 'padding'>
            <TextInput style = {style.input} placeholder = 'Enter Full Name' onChangeText = { (text) => this.setState({name : text}) } />	
            <TextInput style = {style.input} autoCapitalize = 'none' placeholder = 'Enter Phone number' keyboardType = 'number-pad' onChangeText = { (text) => this.setState({phoneNumber : text}) } />	
            <TextInput style = {style.input} autoCapitalize = 'none' placeholder = 'Enter Email' onChangeText = { (text) => this.setState({email : text}) } />	
            <TextInput style = {style.input} autoCapitalize = 'none' placeholder = 'Enter Password' secureTextEntry = {true} onChangeText = {(text) => this.setState({password : text})} />
            <TextInput style = {style.input} autoCapitalize = 'none' placeholder = 'Re-Enter Password' secureTextEntry = {true} onChangeText = {(text) => this.setState({reenteredPS : text})} />

            <Button color= 'orange' title = 'Create Account' onPress = {() => this._onPressCreate()}/>
        </KeyboardAvoidingView>
    )
    }


}
const style = StyleSheet.create({
    container: {
        backgroundColor: '#4c69a5',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      input: {
        height: 50,
        backgroundColor: '#fff',
        marginHorizontal: 10,
        marginVertical: 5,
      }
})

export default CreateAccountScreen;