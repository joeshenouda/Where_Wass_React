const functions = require('firebase-functions');

const admin = require('firebase-admin');
const fetch = require("node-fetch");

admin.initializeApp();


exports.sendPushNotification = functions.database.ref('/Admin/news').onUpdate((change, context) => {
    const root = change.after.ref.root;
    const news = change.after.val();
    var messages = []

    //return main promise
    return root.child('/expoTokens').once('value').then(snapshot => {
        snapshot.forEach(snap => {
            var expoToken = snap.val().expoToken;

            if(expoToken){
                messages.push({
                    "to":expoToken,
                    "body": news
                })
            }
        })

        return Promise.all(messages)
    }).then(messages => {
        console.log('About to send message')
        fetch('https://exp.host/--/api/v2/push/send', {
            method:"POST",
            headers:{
                "Accept":"application/json",
                "Content_Type" : "application/json"
            },
            body : JSON.stringify(messages)
        }).then(res => console.log(res))
    })


}
    
)