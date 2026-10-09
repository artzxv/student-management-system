import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyAhF172v4MWKzjnyZgjhe4yyhqHig2LrD4",
    authDomain: "student-management-syste-1efe9.firebaseapp.com",
    projectId: "student-management-syste-1efe9",
    storageBucket: "student-management-syste-1efe9.firebasestorage.app",
    messagingSenderId: "725388916069",
    appId: "1:725388916069:web:9d9d4dff55ef000bd49d8c"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);


export { auth, db };
