import React, { Component  } from 'react';
import { StyleSheet,
         Text, 
         View,
         ScrollView,
         Button,
         } from 'react-native';
import AdminPortalDay from '../components/AdminPortalDay';
import { FontAwesome  } from '@expo/vector-icons';



class AdminPortal extends Component{
    constructor(props){
		super(props);
    }


    //Setting the header for navigation
    static navigationOptions = ({ navigation }) =>  {
		const headerObj = {
			title: "Where's Wass",
			
			headerLeft: () => (
				<FontAwesome.Button name="home" onPress =  {() => navigation.navigate("Home")} backgroundColor = 'black'/>
			),

			headerRight: () => (
				<Button title = 'Waitlist' onPress = {() => navigation.navigate('Waitlist')} color = 'orange'/>
			)
        }

        return headerObj;
    }
    componentDidMount(){
	console.log('componentDidMount called for Admin')
    }
    componentWillUnmount(){
	console.log('componentWillUnmount called for Admin')
    }
    render(){
		return(
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

			</ScrollView>
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
	}
  });

  export default AdminPortal;
