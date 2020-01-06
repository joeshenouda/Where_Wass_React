import React, { Component  } from 'react';
import { StyleSheet,
         Text, 
         View,
         ScrollView,
         FlatList,
         SafeAreaView,
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

    static navigationOptions = {
        tabBarLabel : 'Wait List',
        tabBarIcon : () => {
            return <FontAwesome name="list" size={25} style = {{color:'black'}}/>
        }     

    }

    Person({client}) {
        
        return (
            <TouchableOpacity style={{flex : 1, justifyContent:'center', alignItems:'center', padding:20}} 
            onPress = {() => firebaseDatabase.ref('waitList/'+client.id).remove().then( () => console.log('Successfully removed '+client.id) )}>
                <Text style = {{fontSize: 25}}>{client.name}</Text>
            </TouchableOpacity>
        )
    }
    PersonStatic({client}) {
        
        return (
            <View style={{flex : 1, justifyContent:'center', alignItems:'center', padding:20}}>
                <Text style = {{fontSize: 25}}>{client.name}</Text>
                <View style = {styles.separator}></View>
            </View>
        )
    }




    //Listens and updates waitlist
    listenForWaitList(FBWaitRef){
        FBWaitRef.orderByKey().on('child_added', (snap) => {
            var identifier;
            console.log('Child added called for waitlistScreen')
            if (snap.val().name){
                identifier = snap.val().name;
            }
            else{
                identifier = snap.val().email;
            }
            this.setState(prevState => ({
                arrayOfWaitingClients : prevState.arrayOfWaitingClients.concat(
                    {
                        name : identifier,
                        id : snap.key
                    }
                    
                )
            }))
        })
        
        FBWaitRef.orderByKey().on('child_removed', (snap) => {
            this.setState(prevState => ({
                arrayOfWaitingClients : prevState.arrayOfWaitingClients.filter(client => client.id != snap.key)
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
        if(this.props.removable){
            return(
                <SafeAreaView style={{flex:1}}>
                    <FlatList
                    data={this.state.arrayOfWaitingClients}
                    renderItem = {({item}) => <this.Person client={item}/>}
                    keyExtractor = {item => item.id}
                    extraData={this.state.arrayOfWaitingClients}
                    />
                </SafeAreaView>
            )
        }
        else{
            return(
                <SafeAreaView style={{flex:1}}>
                    <FlatList
                    data={this.state.arrayOfWaitingClients}
                    renderItem = {({item}) => <this.PersonStatic client={item}/>}
                    keyExtractor = {item => item.id}
                    extraData={this.state.arrayOfWaitingClients}
                    />
                </SafeAreaView>
            )
        }

    }

    
}

WaitlistScreen.defaultProps = {
    removable:true
}

const styles = StyleSheet.create({
    separator: {
		width : '100%',
		height : 5,
		backgroundColor : 'orange'
    }
    
})

export default WaitlistScreen;