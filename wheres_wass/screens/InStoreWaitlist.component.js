import React, { Component  } from 'react';
import { StyleSheet,
         Text, 
         View,
         ScrollView,
         Button,
         TouchableOpacity,
         TextInput,
         ImageBackground
         } from 'react-native';
import firebase from '../config';
import Waitlist from './WaitlistScreen.component';
import DialogInput from 'react-native-dialog-input';
import inStoreStyles from '../styles/inStoreStyles';

firebaseDatabase = firebase.database();

class InStoreWaitlist extends Component{
    constructor(props){
        super(props)
        this.state = {
            isDialogVisible : true,
        }
        this.waitlistRef = firebaseDatabase.ref('waitList')
    }

    static navigationOptions = {
        tabBarLabel : 'In store waitlist',

    }

    submitToWaitlist(nameInput){
        this.waitlistRef.push({name : nameInput, time: new Date().toString()})
        this.setState({
            isDialogVisible:false
        })
    }

    addClient()  {
        this.setState({
            isDialogVisible : true
        })
    }
    


    render(){
        console.log('We are re-rendering InStoreWaitlist')
        return(
            <View style= {inStoreStyles.container}>		
            <ImageBackground source={require('../assets/background.jpg')} style={{width:'100%', height:'100%'}}>
			    <Text style = {inStoreStyles.mainHeader}>Welcome to Wadie's Salon</Text>
                    <DialogInput isDialogVisible={this.state.isDialogVisible}
                        title={"Add to Waitlist"}
                        message={"Please enter your name to be added to the waitlist"}
                        hintInput ={"John Doe"}
                        textInputProps={{autoCapitalize:'words'}}
                        submitInput = {(inputtext) => this.submitToWaitlist(inputtext)}
                        closeDialog = {() => this.setState({isDialogVisible:false})}>
                    </DialogInput>
                    <Waitlist style = {{flex:1, color: 'white'}} removable = {false}/>
                    <TouchableOpacity onPress={() => this.addClient()} style={styles.fab}>
                        <Text style={styles.fabIcon}>+</Text>
                    </TouchableOpacity>
            </ImageBackground>
            </View>

           
        )
    }

    
}

const styles = StyleSheet.create({ 
    fab: { 
      position: 'absolute', 
      width: 56, 
      height: 56, 
      alignItems: 'center', 
      justifyContent: 'center', 
      right: 20, 
      bottom: 60, 
      backgroundColor: 'black', 
      borderRadius: 30, 
      elevation: 10, 
      }, 
      fabIcon: { 
        fontSize: 40, 
        color: 'white' 
      }
  });



export default InStoreWaitlist;
