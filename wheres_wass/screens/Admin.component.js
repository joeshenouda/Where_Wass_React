import React, { Component  } from 'react';
import { StyleSheet,
         Text, 
         View,
         Button,
         TextInput,
         Image} from 'react-native';
import styles from '../styles/Styles';
import firebase from '../config';

//Initialize the database object from firebase
firebaseDatabase = firebase.database();

//To convert numerical day of week received by Date() object to string for Firebase
let daysOfWeek  =['Sunday', 'Monday', 'Tuesday', 'Wednesday','Thursday','Friday','Saturday']
let dayOfWeek = new Date().getDay()


class AdminPortal extends Component{
    constructor(props){
		super(props);
		this.state = {
			working: 'ON',
			openingHour: 'Loading...',
			closingHour: 'Loading...',

		},
		this.business_hoursRef = firebaseDatabase.ref('business_hours/'+daysOfWeek[dayOfWeek])
    }
    //Called everytime a child changes on the database for the given day
	listenForHours(FBref) {

		FBref.on('value', (snap) => {
			this.setState({
				openingHour : snap.child('002_o_opening').val(),
				closingHour : snap.child('003_o_closing').val(),
				working : snap.child('001_o_status').val()
			})
		})

		FBref.on('child_changed',(snap) => {
			this.setState({
				openingHour : snap.child('002_o_opening').val(),
				closingHour : snap.child('003_o_closing').val(),
				working : snap.child('001_o_status').val()
			})
		});
		
    }
    //Calls our listenForHours function once before rendering component
	componentDidMount(){
		this.listenForHours(this.business_hoursRef)
    }

    //Setting the header for users to access nav drawer
    static navigationOptions = ({ navigation }) =>  {
		const headerObj = {
			title: "Where's Wass",
			
			headerLeft: () => (
				<FontAwesome.Button name="bars" 
				onPress ={ () => { navigation.toggleDrawer()}}
				backgroundColor='black'
				/>
			)
        }

        return headerObj;
    }
    render(){
        

    }


}