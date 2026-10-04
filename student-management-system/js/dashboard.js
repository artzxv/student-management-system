import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


// Check if the user is logged in
onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "index.html";
        return;
    }

    // Get all students from Firestore
    const studentsSnapshot = await getDocs(
        collection(db, "students")
    );

    // Display the number of students
    document.getElementById("totalStudents").textContent =
        studentsSnapshot.size;
});


// Logout
const logoutButton = document.getElementById("logoutButton");

logoutButton.addEventListener("click", async () => {

    await signOut(auth);

    window.location.href = "index.html";

});