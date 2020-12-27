import React, { Component  } from 'react';
import { Text, 
         View,
	} from 'react-native';
import firebase from '../config';

//Initializing the database object from firebase
firebaseDatabase = firebase.database();

class MonthlyScheduleDay extends Component{
    constructor(props){
        super(props)
        this.state={
            working:true,
            start_time:'Loading...',
            end_time:'Loading...'
        }
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        this.monthlyHoursRef=firebaseDatabase.ref('business_hours/'+months[this.props.month-1]+'/'+this.props.day)
    }

    grabMonthlyHours(){
        this.monthlyHoursRef.on('value', (snap) => {
            this.setState({
                start_time:snap.child('start_time').val(),
                end_time:snap.child('end_time').val(),
                working : snap.child('working').val() == 'ON'
            })
        })
    }
    componentDidMount(){
        this.grabMonthlyHours()

    }
    componentWillUnmount(){
        this.monthlyHoursRef.off()
    }

    render(){
        if(this.state.working){
            return(
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <Text>{this.props.month}-{this.props.day}-{this.props.year}</Text>
                    <Text>Start Time:{this.state.start_time}</Text>
                    <Text>End Time: {this.state.end_time}</Text>
                </View>
            )
        }
        else{
            return(
                <View style={{flex:1}}>
                    <Text>{this.props.month}-{this.props.day}-{this.props.year}</Text>
                    <Text>OFF</Text>
                </View>
            )
        }
    }


}

export default(MonthlyScheduleDay)