import React, { Component  } from 'react';
import { StyleSheet,
         View,
         ScrollView,
		 Image,
		 TouchableOpacity
         } from 'react-native';
import AdminPortalDay from '../components/AdminPortalDay';
import { FontAwesome  } from '@expo/vector-icons';
import DialogInput from 'react-native-dialog-input';
import firebase from '../config'


firebaseDatabase = firebase.database();


class AdminPortal extends Component{
    constructor(props){
		super(props);
		this.state={
			isDialogVisible : false
		}
    }


    //Setting the header for navigation
    static navigationOptions = ({navigation}) => ({
		tabBarLabel : 'Hours',
		tabBarIcon : () => {
            return <FontAwesome name="calendar" size={25} style = {{color:'black'}}/>
		},
	})

	updateAnnouncement(newAnnouncement){
		let announcementRef = firebaseDatabase.ref('Admin/')
		announcementRef.update({
			news: newAnnouncement
		})
		this.setState({
			isDialogVisible:false
		})
	}
	
    componentDidMount(){
		console.log('componentDidMount called for Admin')
	}
	
    componentWillUnmount(){
		console.log('componentWillUnmount called for Admin')
    }
    render(){
		return(
			<View style={{flex:1}}>
				<ScrollView horizontal={false} style = {{flex:2}}>
					<AdminPortalDay day = 'Monday'/>
					<View style = {styles.separator}/>
					<AdminPortalDay day = 'Tuesday'/>
					<View style = {styles.separator}/>
					<AdminPortalDay day = 'Wednesday'/>
					<View style = {styles.separator}/>
					<AdminPortalDay day = 'Thursday'/>
					<View style = {styles.separator}/>
					<AdminPortalDay day = 'Friday'/>
					<View style = {styles.separator}/>
					<AdminPortalDay day = 'Saturday'/>
					<View style = {styles.separator}/>
					<AdminPortalDay day = 'Sunday'/>
					<DialogInput isDialogVisible={this.state.isDialogVisible}
						title={"Update announcement"}
						message={"Enter new announcement"}
						hintInput ={"Shop closed"}
						textInputProps={{autoCapitalize:'words'}}
						submitInput = {(inputtext) => this.updateAnnouncement(inputtext)}
						closeDialog = {() => this.setState({isDialogVisible:false})}>
					</DialogInput>
				</ScrollView>
				<TouchableOpacity onPress={() => this.setState({isDialogVisible:true})} style={styles.fab}>
					<Image source={require('../assets/hairDryer.png')} style={{padding: 10, height: 25, width: 25, resizeMode: 'cover'}}/>
				</TouchableOpacity>
			</View>
	);
  }


}
const styles = StyleSheet.create({

	scrollArea: {
	  top: 53,
	  width: 360,
	  height: 153,
	  backgroundColor: "rgba(230, 230, 230,1)",
	  position: "absolute",
	  left: 7
	},
	separator:
	{
	   width: '100%',
	   height: 5,
	   backgroundColor: 'black'
	},
	fab: { 
		flex:1,
		position: 'absolute', 
		width: 56, 
		height: 56, 
		alignItems: 'center', 
		justifyContent: 'center', 
		right: 20, 
		bottom: 40, 
		backgroundColor: 'black', 
		borderRadius: 30, 
		elevation: 10, 
		}, 
	fabIcon: { 
		fontSize: 40, 
		color: 'white' 
	}
  });

  export default AdminPortal;
