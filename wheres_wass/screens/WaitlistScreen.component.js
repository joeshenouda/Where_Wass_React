import React, { Component  } from 'react';
import { StyleSheet,
         Text, 
         View,
         ScrollView,
         Button,
         TouchableOpacity
         } from 'react-native';
import AdminPortalDay from '../components/AdminPortalDay';
import { FontAwesome  } from '@expo/vector-icons';
import firebase from '../config'

firebaseDatabase = firebase.database();

const waitingClient = (props) => {
    return(
        <View>
            <Text>{props.identifier}</Text>
            <Text>{props.waitTime}</Text>
        </View>
    )
}

class WaitlistScreen extends Component{
    constructor(props){
        super(props),
        this.state = {
            arrayOfWaitingClients: []
        }
        this.waitRef = firebaseDatabase.ref('waitList/');
    }

    //Setting header for navigation
    static navigationOptions = ({ navigation }) =>  {
		const headerObj = {
			title: "Where's Wass",
			
			headerLeft: () => (
				<FontAwesome.Button name="home" onPress =  {() => navigation.navigate("Home")} backgroundColor = 'black'/>
			),
        }

        return headerObj;
    }

    //Listens and updates waitlist
    listenForWaitList(FBWaitRef){
        FBWaitRef.orderByKey().on('child_added', (snap) => {
            var identifier;
            console.log('Child added called for waitlistScreen')
            if (snap.val().displayName){
                identifier = snap.val().displayName;
            }
            else{
                identifier = snap.val().email;
            }
            this.setState(prevState => ({
                arrayOfWaitingClients : prevState.arrayOfWaitingClients.concat(
                <View style={{flex : 1, justifyContent:'center', alignItems:'center'}}>
                    <Text style = {{fontSize: 25}}>{identifier}</Text>
                    <View style = {styles.separator}></View>
                </View>
                
                
                )
            }))
        })
    }
    componentDidMount(){
        console.log('Called componentDidMount for waitlistScreen')
        this.listenForWaitList(this.waitRef)
    }
    componentWillUnmount(){
        this.waitRef.off()
    }

    render(){
        return(
            <ScrollView horizontal={false} style={{flex:2}}>
                {this.state.arrayOfWaitingClients}
            </ScrollView>
        )

    }

    
}

const styles = StyleSheet.create({
    separator: {
		width : '100%',
		height : 5,
		backgroundColor : 'orange'
	    }
})

export default WaitlistScreen;