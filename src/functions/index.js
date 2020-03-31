const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
   
exports.fcmSend = functions.firestore.document('/products/{id}')
    .onCreate((snap, context) => {
        const newValue = snap.data();
        console.log("Product added : ",newValue);
        const payload = {
            notification: {
                title: "New product!",
                body: newValue.title+" now available. Check it out."
            }
        };

        admin.database()
            .ref('/fcmTokens')
            .once('value')
            .then(snapshot => snapshot.val())
            .then(tokensSnapshot => {    
            const tokens = [];
            for(let key of Object.keys(tokensSnapshot)) {
                tokens.push(tokensSnapshot[key]);
            }
            console.log("Tokens array : ",tokens);          
            return admin.messaging().sendToDevice(tokens, payload).then(response => {
                console.log("Success response",response);      
                // For each message check if there was an error.
                const tokensToRemove = [];
                response.results.forEach((result, index) => {
                    const error = result.error;
                    if (error) {
                        console.error('Failure sending notification to', tokens[index], error);
                        // Cleanup the tokens who are not registered anymore.
            
                    }
                });
                return Promise.all(tokensToRemove);
            });       
        });
});

