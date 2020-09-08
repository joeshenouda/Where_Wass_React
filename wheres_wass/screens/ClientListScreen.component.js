import React,{ Component } from 'react';
import { View, Text, SafeAreaView, FlatList, ActivityIndicator, Linking, TouchableOpacity, Alert} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import firebase from '../config';

firebaseDatabase = firebase.database();

class Clients extends Component{
    constructor(props){
        super(props);
        this.state = {
            arrayOfClients: [],
            limit:9,
            lastVisibleKey : null,
            lastVisibleName : null,
            loading : false,
            refreshing : false
        }
    }
    static navigationOptions = {
        tabBarLabel : 'Clients',
        tabBarIcon : () => {
            return <FontAwesome name="user" size={25} style = {{color:'black'}}/>
        }
    }
    PersonStatic({client}) {
        
        return (
            <View style={{flex : 1,flexDirection:'column',justifyContent: 'space-between', margin:10, padding:5, borderBottomColor:'black', borderBottomWidth:5}}>
                <Text selectable={true} style = {{fontSize: 20, textAlign:'center', padding:5}}>{client.username}</Text>
                <Text selectable={true} dataDetectorType={'email'} style={{fontSize:20, textAlign:'center', padding:5}}>{client.email}</Text>
                <Text selectable={true} style={{fontSize:20, color:'blue', textAlign:'center', padding:5}}
                    onPress={()=>Linking.openURL(`tel:${client.phone}`)}>{client.phone}</Text>
            </View>

        )
    }

    retrieveData = async () => {
        this.setState({
            loading : true
        })
        console.log('Retrieving Data')
        
        let nine_clients = []
        firebaseDatabase.ref('wadies/').orderByChild("username").limitToFirst(50).once('value', (snap) => {

            snap.forEach((childSnap) => {
                client = childSnap.val()
                client['id'] = childSnap.key
                nine_clients.push(client)
            })

            console.log('\nretrieveData: Setting last visibile to: '+nine_clients[nine_clients.length-1].id)
            console.log(nine_clients)
            this.setState({
                arrayOfClients : nine_clients,
                lastVisibleKey : nine_clients[nine_clients.length-1].id,
                lastVisibleName : nine_clients[nine_clients.length - 1].username,
                loading : false
            }, () => console.log('retrieveData: Last visible set to: '+this.state.lastVisibleName))
        })

    }

    retrieveMore = async () => {
        if(!this.state.refreshing){
            this.setState({
                refreshing : true
            })

            console.log('Retrieving more clients')
            console.log("Last visible id was:" +this.state.lastVisibleKey)

            let nine_more = []
            firebaseDatabase.ref('wadies/').orderByChild("username")
            .startAt(this.state.lastVisibleName)
            .limitToFirst(50).once('value', (snap) => {

                snap.forEach((childSnap) => {
                    
                    if (childSnap.key == this.state.lastVisibleKey || this.state.arrayOfClients.some(client => client.id == childSnap.key)){
                        console.log("Skipping double id user "+childSnap.val().username+" with id "+childSnap.key)
                    }
                    else{
                        client = childSnap.val()
                        client['id'] = childSnap.key
                        console.log("Adding "+childSnap.val().username+" with id "+childSnap.key)
                        nine_more.push(client)
                    }
                })
                let lastVisibleKey = null
                let lastVisibleName = null
                if (nine_more[nine_more.length - 1] != undefined){
                    lastVisibleKey = nine_more[nine_more.length - 1].id
                    lastVisibleName = nine_more[nine_more.length-1].username
                }
                else{
                    lastVisibleKey = this.state.lastVisibleKey
                }
                console.log('\nretrieveMore: Setting last visibile to: '+lastVisibleKey)
                this.setState(prevState => ({
                    arrayOfClients : prevState.arrayOfClients.concat(nine_more),
                    lastVisibleKey : lastVisibleKey,
                    lastVisibleName : lastVisibleName,
                    refreshing : false
                }),()=>console.log('retrieveMore: Last visible set to: '+this.state.lastVisibleKey))
                console.log("Presented: "+this.state.arrayOfClients.length+" clients")

            })
        }

    }

      // Render Footer
    renderFooter = () => {
        try {
        // Check If Loading
        if (this.state.loading || this.state.refreshing) {
            return (
                <View style={{flex: 1, justifyContent:'center'}}>
                    <ActivityIndicator size="large"/>
                </View>
            )
        }
        else {
            return null;
        }
        }
        catch (error) {
        console.log(error);
        }
    };

    componentDidMount(){
        //Initial Query
        this.retrieveData()    
    }

    render(){
        return(
            <SafeAreaView style={{flex:1}}>
                <FlatList
                data={this.state.arrayOfClients}
                renderItem = {({item}) => <this.PersonStatic client={item}/>}
                keyExtractor = {item => item.id}
                // Footer (Activity Indicator)
                ListFooterComponent={this.renderFooter}
                onEndReachedThreshold={0.5}
                onEndReached={this.retrieveMore}
                refreshing = {this.state.refreshing}
                />
            </SafeAreaView>
        )
    }
}
export default Clients

