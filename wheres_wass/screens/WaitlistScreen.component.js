import React, { Component  } from 'react';
import { StyleSheet,
         Text, 
         View,
         Alert,
         FlatList,
         SafeAreaView,
         Switch,
         TouchableOpacity,
         Linking,
         Button
         } from 'react-native';
import { FontAwesome  } from '@expo/vector-icons';
import firebase from '../config'

firebaseDatabase = firebase.database();


class WaitlistScreen extends Component{
    constructor(props){
        super(props),
        this.state = {
            arrayOfWaitingClients: [],
            isFetching : false,
            now : new Date(),
            waitlistOn : true
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
            <TouchableOpacity  
            onLongPress = {() => {
                Alert.alert(
                    'Remove User',
                    'Are you sure you want to remove this client from the waitlist?',
                    [
                    {text: 'Yes', onPress: () => firebaseDatabase.ref('waitList/'+client.id).remove().then( () => {
                        console.log('Successfully removed '+client.id) 
                    })},
                    {text: 'Cancel'}
                    ],
                    {cancelable: true},
                )
                
            }}>
                <View style={{flex : 1,flexDirection:'row',justifyContent: 'space-between', padding : 20}}>
                    <TouchableOpacity  style={{width:35,borderRadius:50,justifyContent:'center',alignItems:'center', backgroundColor:'#D3D3D3'}} activeOpacity = {0.1} onPress={()=>Linking.openURL(`tel:${client.phone}`)}>
                            <FontAwesome name="phone" size={25}/>
                    </TouchableOpacity>
                    <Text style = {{fontSize: 25}}>{client.name}</Text>
                    <Text style = {{fontSize : 20}}>{Math.round((((new Date() - Date.parse(client.time))%86400000) % 3600000)/60000)}m</Text>
                </View>
            </TouchableOpacity>
        )
    }

    PersonStatic({client}) {
        
        return (
            <View backgroundColor='orange' style={{flex : 1,flexDirection:'row',justifyContent: 'space-between', padding : 20, marginBottom : 20, marginTop : 20}}>
                <Text style = {{fontSize: 25, marginHorizontal : 5}}>{client.name}</Text>
                <Text style = {{fontSize : 20}}>{Math.round((((new Date() - Date.parse(client.time))%86400000) % 3600000)/60000)}m</Text>
            </View>

        )
    }




    //Listens and updates waitlist
    listenForWaitList(FBWaitRef){
        
        //Checks if wass has turned off waitlist feature
        firebaseDatabase.ref('/Admin/waitlist').on('value', (snap) => {
            this.setState({
                waitlistOn : snap.val() == "ON" ? true : false
            })

        })

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
                        id : snap.key,
                        time : snap.val().time,
                        phone : snap.val().phone
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
        setInterval(() => this.setState({now:new Date()}), 60000)
        this.listenForWaitList(this.waitRef)
    }
    componentWillUnmount(){
        this.waitRef.off()
    }

    render(){
        if(this.props.removable){
            //Returns two different layouts depending b/c inStoreWaitlist also uses this component and should not have ability to remove clients
            return(
                <View style={{flex:1}}>
                    <View style={{flexDirection : 'row', alignSelf:'center'}}>
                    <Switch trackColor = {{false :'gray', true: 'green'}} thumbColor = 'white' value= {this.state.waitlistOn} onValueChange = {(newVal) => {
                            if(newVal){
                                firebaseDatabase.ref('/Admin').child('waitlist').set('ON')
                            }
                            else{
                                firebaseDatabase.ref('/Admin').child('waitlist').set('OFF')

                            }
                        }
                        }/>
                    <Text style={{fontSize:30}}>Waitlist</Text>
                    </View>
                    <View style={{backgroundColor:'black', width:400, height:5}}></View>

                    <SafeAreaView style={{flex:1}}>
                        <FlatList
                        data={this.state.arrayOfWaitingClients}
                        renderItem = {({item}) => <this.Person client={item}/>}
                        keyExtractor = {item => item.id}
                        extraData={this.state.arrayOfWaitingClients, this.state.now}
                        refreshing={this.state.isFetching}
                        onRefresh= {() => {
                                            this.setState({isFetching : true})
                                            this.setState({isFetching:false})
                                            }
                                        }
                        />


                    </SafeAreaView>

                </View>
              )
        }
        else{
            return(
                <SafeAreaView style={{flex:1}}>
                    <FlatList
                    data={this.state.arrayOfWaitingClients}
                    renderItem = {({item}) => <this.PersonStatic client={item}/>}
                    keyExtractor = {item => item.id}
                    extraData={this.state.arrayOfWaitingClients, this.state.now}
                    refreshing = {this.state.isFetching}
                    onRefresh= {() =>{
                                         this.setState({isFetching : true})
                                         this.setState({isFetching:false})
                                        }
                                    }
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