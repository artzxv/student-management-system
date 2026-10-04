import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


// ==============================
// CHECK LOGIN
// ==============================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "index.html";

        return;

    }

    loadStudents();

});


// ==============================
// ADD STUDENT
// ==============================

const studentForm =
    document.getElementById("studentForm");


if (studentForm) {

    studentForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        const studentId =
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

            await addDoc(collection(db, "students"), {

                studentId: studentId,
                fullName: fullName,
                age: Number(age),
                program: program,
                section: section,
                contact: contact,
                email: email

            });


            document.getElementById("studentMessage").textContent =
                "Student added successfully!";


            studentForm.reset();


        } catch (error) {

            console.error("Error adding student:", error);

            document.getElementById("studentMessage").textContent =
                "Error adding student.";

        }

    });

}


// ==============================
// DISPLAY STUDENTS
// ==============================

async function loadStudents() {

    const tableBody =
        document.getElementById("studentTableBody");


    if (!tableBody) {

        return;

    }


    try {

        const studentsSnapshot =
            await getDocs(collection(db, "students"));


        const students = [];


        studentsSnapshot.forEach((student) => {

            students.push({

                id: student.id,

                ...student.data()

            });

        });


        function displayStudents(searchText = "") {

            tableBody.innerHTML = "";


            const search =
                searchText.toLowerCase().trim();


            const filteredStudents =
                students.filter((student) => {

                    const studentId =
                        String(student.studentId || "")
                            .toLowerCase();

                    const fullName =
                        String(student.fullName || "")
                            .toLowerCase();


                    return (
                        studentId.includes(search) ||
                        fullName.includes(search)
                    );

                });


            filteredStudents.forEach((student) => {

                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>${student.studentId}</td>

                    <td>${student.fullName}</td>

                    <td>${student.age}</td>

                    <td>${student.program}</td>

                    <td>${student.section}</td>

                    <td>${student.contact}</td>

                    <td>${student.email}</td>

                    <td>

                        <button
                            onclick="editStudent('${student.id}')">
                            Edit
                        </button>

                        <button
                            onclick="deleteStudent('${student.id}')">
                            Delete
                        </button>

                    </td>

                `;


                tableBody.appendChild(row);

            });


            if (filteredStudents.length === 0) {

                const row =
                    document.createElement("tr");


                row.innerHTML = `
                    <td colspan="8">
                        No students found.
                    </td>
                `;


                tableBody.appendChild(row);

            }

        }


        displayStudents();


        const searchInput =
            document.getElementById("searchInput");


        if (searchInput) {

            searchInput.addEventListener("input", () => {

                displayStudents(searchInput.value);

            });

        }


    } catch (error) {

        console.error("Error loading students:", error);

    }

}


// ==============================
// EDIT STUDENT
// ==============================

window.editStudent = function(studentId) {

    window.location.href =
        `edit-student.html?id=${studentId}`;

};


// ==============================
// DELETE STUDENT
// ==============================

window.deleteStudent = async function(studentId) {

    const confirmDelete =
        confirm("Are you sure you want to delete this student?");


    if (!confirmDelete) {

        return;

    }


    try {

        await deleteDoc(
            doc(db, "students", studentId)
        );


        alert("Student deleted successfully!");


        location.reload();


    } catch (error) {

        console.error("Error deleting student:", error);

        alert("Error deleting student.");

    }

};


// ==============================
// LOGOUT
// ==============================

const logoutButton =
    document.getElementById("logoutButton");


if (logoutButton) {

    logoutButton.addEventListener("click", async () => {

        try {

            await signOut(auth);

            window.location.href = "index.html";

        } catch (error) {

            console.error("Logout error:", error);

        }

    });

}