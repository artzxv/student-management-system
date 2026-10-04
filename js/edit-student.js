import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


// ==============================
// GET STUDENT ID FROM URL
// ==============================

const urlParams = new URLSearchParams(window.location.search);

const studentId = urlParams.get("id");


// ==============================
// CHECK LOGIN
// ==============================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "index.html";

        return;

    }

    loadStudent();

});


// ==============================
// LOAD STUDENT INFORMATION
// ==============================

async function loadStudent() {

    if (!studentId) {

        document.getElementById("editMessage").textContent =
            "Student not found.";

        return;

    }


    try {

        const studentRef =
            doc(db, "students", studentId);

        const studentSnapshot =
            await getDoc(studentRef);


        if (!studentSnapshot.exists()) {

            document.getElementById("editMessage").textContent =
                "Student not found.";

            return;

        }


        const student = studentSnapshot.data();


        document.getElementById("studentId").value =
            student.studentId || "";

        document.getElementById("fullName").value =
            student.fullName || "";

        document.getElementById("age").value =
            student.age || "";

        document.getElementById("program").value =
            student.program || "";

        document.getElementById("section").value =
            student.section || "";

        document.getElementById("contact").value =
            student.contact || "";

        document.getElementById("email").value =
            student.email || "";


    } catch (error) {

        console.error("Error loading student:", error);

        document.getElementById("editMessage").textContent =
            "Error loading student.";

    }

}


// ==============================
// UPDATE STUDENT
// ==============================

const editStudentForm =
    document.getElementById("editStudentForm");


editStudentForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    const studentIdValue =
        document.getElementById("studentId").value.trim();

    const fullName =
        document.getElementById("fullName").value.trim();

    const age =
        document.getElementById("age").value;

    const program =
        document.getElementById("program").value.trim();

    const section =
        document.getElementById("section").value.trim();

    const contact =
        document.getElementById("contact").value.trim();

    const email =
        document.getElementById("email").value.trim();


    try {

        const studentRef =
            doc(db, "students", studentId);


        await updateDoc(studentRef, {

            studentId: studentIdValue,
            fullName: fullName,
            age: Number(age),
            program: program,
            section: section,
            contact: contact,
            email: email

        });


        document.getElementById("editMessage").textContent =
            "Student updated successfully!";


    } catch (error) {

        console.error("Error updating student:", error);

        document.getElementById("editMessage").textContent =
            "Error updating student.";

    }

});


// ==============================
// LOGOUT
// ==============================

const logoutButton =
    document.getElementById("logoutButton");


logoutButton.addEventListener("click", async () => {

    try {

        await signOut(auth);

        window.location.href = "index.html";

    } catch (error) {

        console.error("Logout error:", error);

    }

});