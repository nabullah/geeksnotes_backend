const admin = require("firebase-admin");
const serviceAccount = require("../config/firebase-config.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount.firebaseConfig),
});

module.exports = { admin };
