const admin = require("firebase-admin")
const serviceAccount = require("../firebase-adminsdk.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "avtosalon-43555.appspot.com"
});

const bucket = admin.storage().bucket();

module.exports = bucket;