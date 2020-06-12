import React, { Component } from 'react';
import { View, Image, Button,TextInput,StyleSheet, Alert,Text, KeyboardAvoidingView, Platform } from 'react-native';
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
        if(this.state.name == ''){
            Alert.alert(
                'Could not Create Account',
                'Please enter your name',
                [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                {cancelable: false},
            );
        }
        if(this.state.phoneNumber == '' || !/\d{10}/.test(this.state.phoneNumber)){
            Alert.alert(
                'Could not Create Account',
                'Please enter your phone number',
                [
                    {text: 'OK', onPress: () => console.log('Ok Pressed')},
                ],
                {cancelable: false}
            )
        }
        else{
            firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).catch((errors) => {
                let errorCode = errors.code;
                let errorMessage = errors.message;

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
                                    phoneNumber : this.state.phoneNumber
                                }
                            ).then(() => {
                                    firebase.database().ref('wadies').child(newUser.uid).update({phone: this.state.phoneNumber, email: this.state.email, username: this.state.name});
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
    }


    render(){
    return(
        
            <KeyboardAvoidingView style={{flex:1}}
                behavior = {Platform.OS=='ios'?'padding':'height'}>
                <View style={style.container} backgroundColor='black'>
                    <Text style={{fontSize:40, color:'white', alignSelf:'center'}}>Create Account</Text>
                    <TextInput style={style.input}  placeholderTextColor='gray' placeholder = 'Enter Full Name' onChangeText = { (text) => this.setState({name : text}) } />	
                    <TextInput style={style.input}  placeholderTextColor='gray' autoCapitalize = 'none' placeholder = 'Enter Phone number' keyboardType = 'number-pad' onChangeText = { (text) => this.setState({phoneNumber : text}) } />	
                    <TextInput style={style.input}  placeholderTextColor='gray' autoCapitalize = 'none' placeholder = 'Enter Email' onChangeText = { (text) => this.setState({email : text}) } />	
                    <TextInput style={style.input}  placeholderTextColor='gray' autoCapitalize = 'none' placeholder = 'Enter Password' secureTextEntry = {true} onChangeText = {(text) => this.setState({password : text})} />
                    <TextInput style={style.input}  placeholderTextColor='gray' autoCapitalize = 'none' placeholder = 'Re-Enter Password' secureTextEntry = {true} onChangeText = {(text) => this.setState({reenteredPS : text})} />
                    <Button style={style.button} color= 'orange' title = 'Create Account' onPress = {() => this._onPressCreate()}/>
                </View>
            </KeyboardAvoidingView>
    )
    }


}
const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:'space-evenly'
      },
      input: {
        fontSize: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 10,
        borderBottomWidth : 1,
        borderBottomColor:'white'
      },
      button: {
          alignSelf:'center'

      }
})

export default CreateAccountScreen;