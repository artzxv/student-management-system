import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    db,
    auth
} from "./firebase.js";


/* =========================
   CHECK LOGIN
========================= */

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "index.html";

        return;

    }

    loadDashboard();

});


/* =========================
   LOAD DASHBOARD
========================= */

async function loadDashboard() {

    try {

        const studentsRef = collection(db, "students");

        const snapshot = await getDocs(studentsRef);


        /* =========================
           TOTAL STUDENTS
        ========================= */

        const totalStudents =
            snapshot.size;

        document.getElementById(
            "totalStudents"
        ).textContent = totalStudents;


        /* =========================
           TOTAL PROGRAMS
        ========================= */

        const programs = new Set();


        snapshot.forEach((doc) => {

            const student = doc.data();

            if (
                student.program &&
                student.program.trim() !== ""
            ) {

                programs.add(
                    student.program.trim()
                );

            }

        });


        document.getElementById(
            "totalPrograms"
        ).textContent = programs.size;


    } catch (error) {

        console.error(
            "Error loading dashboard:",
            error
        );

    }

}


/* =========================
   LOGOUT
========================= */

const logoutButton =
    document.getElementById("logoutButton");


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async () => {

            try {

                await signOut(auth);

                window.location.href =
                    "index.html";

            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );

            }

        }
    );

}
