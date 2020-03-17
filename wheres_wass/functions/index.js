const functions = require('firebase-functions');

const admin = require('firebase-admin');
const fetch = require("node-fetch");
const { Expo } = require('expo-server-sdk')
let expo = new Expo()
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
            if (Expo.isExpoPushToken(expoToken)) {
                messages.push({
                    "to": expoToken,
                    "body": news
                });
            }
            else{
                console.log('Push token ${expoToken} is not a valid expo token')
            }
        });
        const messages_1 = await Promise.all(messages);
        console.log('About to send message');


        let chunks = expo.chunkPushNotifications(messages_1);

        //Pushes the notification out in chunks so as not overload servers
        (async () => {
            for (let chunk of chunks) {
              try {
                let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                console.log(ticketChunk);
              } catch (error) {
                console.error(error);
              }
            }
          })();

    }
}
    
)