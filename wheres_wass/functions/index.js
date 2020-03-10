const functions = require('firebase-functions');

const admin = require('firebase-admin');
const fetch = require("node-fetch");

admin.initializeApp();


exports.sendPushNotification = functions.database.ref('/Admin/news').onUpdate(async (change, context) => {

    //Checks if notify is set to true first
    notify = true
    const notifyStatus = change.after.ref.parent.child('notify')
    await notifyStatus.once('value').then((snap) => snap.val()=="False" ? notify=false : notify=true)
    console.log('Notify is '+notify)
    if (notify){
        const root = change.after.ref.root;
        const adminRef = change.after.ref.parent
        var news =''
        adminRef.child('news').once('value').then((snap) => news = snap.val());
        var messages = []
        //return main promise
        const snapshot = await root.child('/expoTokens').once('value');
        snapshot.forEach(snap_2 => {
            var expoToken = snap_2.val().expoToken;
            if (expoToken) {
                messages.push({
                    "to": expoToken,
                    "body": news
                });
            }
        });
        const messages_1 = await Promise.all(messages);
        console.log('About to send message');
        fetch('https://exp.host/--/api/v2/push/send', {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content_Type": "application/json"
            },
            body: JSON.stringify(messages_1)
        }).then(res => console.log(res));
    }
}
    
)