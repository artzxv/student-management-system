import {
    collection,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    db,
    auth
} from "./firebase.js";


const studentTableBody =
    document.getElementById("studentTableBody");

const searchInput =
    document.getElementById("searchInput");

const logoutButton =
    document.getElementById("logoutButton");


const deleteModal =
    document.getElementById("deleteModal");

const cancelDelete =
    document.getElementById("cancelDelete");

const confirmDelete =
    document.getElementById("confirmDelete");


let students = [];

let studentToDelete = null;


/* =========================
   AUTHENTICATION
========================= */

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "index.html";

        return;

    }

    loadStudents();

});


/* =========================
   LOAD STUDENTS
========================= */

async function loadStudents() {

    try {

        const snapshot =
            await getDocs(
                collection(db, "students")
            );


        students = [];


        snapshot.forEach((studentDoc) => {

            students.push({

                id: studentDoc.id,

                ...studentDoc.data()

            });

        });


        /* SORT STUDENT ID ASCENDING */

        students.sort((a, b) => {

            return a.studentId.localeCompare(
                b.studentId,
                undefined,
                {
                    numeric: true
                }
            );

        });


        displayStudents(students);


    } catch (error) {

        console.error(
            "Error loading students:",
            error
        );

    }

}


/* =========================
   DISPLAY STUDENTS
========================= */

function displayStudents(studentList) {

    studentTableBody.innerHTML = "";


    if (studentList.length === 0) {

        studentTableBody.innerHTML = `
            <tr>
                <td colspan="10" style="text-align:center;">
                    No students found.
                </td>
            </tr>
        `;

        return;

    }


    studentList.forEach((student) => {


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${student.studentId || ""}
            </td>

            <td>
                ${student.fullName || ""}
            </td>

            <td>
                ${student.age || ""}
            </td>

            <td>
                ${student.program || ""}
            </td>

            <td>
                ${student.section || ""}
            </td>

            <td>
                ${student.contact || ""}
            </td>

            <td>
                ${student.email || ""}
            </td>

            <td>
                ${student.guardianName || ""}
            </td>

            <td>
                ${student.guardianContact || ""}
            </td>

            <td>

                <a
                    href="edit-student.html?id=${student.id}"
                    class="edit-button"
                >
                    Edit
                </a>

                <button
                    class="delete-button"
                    data-id="${student.id}"
                >
                    Delete
                </button>

            </td>

        `;


        studentTableBody.appendChild(row);

    });


    /* ADD DELETE BUTTON EVENTS */

    document
        .querySelectorAll(".delete-button")
        .forEach((button) => {

            button.addEventListener(
                "click",
                () => {

                    studentToDelete =
                        button.dataset.id;

                    deleteModal.classList.add(
                        "show"
                    );

                }
            );

        });

}


/* =========================
   SEARCH
========================= */

searchInput.addEventListener(
    "input",
    () => {

        const searchValue =
            searchInput.value
                .toLowerCase()
                .trim();


        const filteredStudents =
            students.filter((student) => {

                const studentId =
                    String(
                        student.studentId || ""
                    ).toLowerCase();

                const fullName =
                    String(
                        student.fullName || ""
                    ).toLowerCase();

                const program =
                    String(
                        student.program || ""
                    ).toLowerCase();


                return (

                    studentId.includes(
                        searchValue
                    )

                    ||

                    fullName.includes(
                        searchValue
                    )

                    ||

                    program.includes(
                        searchValue
                    )

                );

            });


        displayStudents(
            filteredStudents
        );

    }
);


/* =========================
   CANCEL DELETE
========================= */

cancelDelete.addEventListener(
    "click",
    () => {

        studentToDelete = null;

        deleteModal.classList.remove(
            "show"
        );

    }
);


/* =========================
   CONFIRM DELETE
========================= */

confirmDelete.addEventListener(
    "click",
    async () => {

        if (!studentToDelete) {

            return;

        }


        try {

            await deleteDoc(
                doc(
                    db,
                    "students",
                    studentToDelete
                )
            );


            studentToDelete = null;

            deleteModal.classList.remove(
                "show"
            );


            await loadStudents();


        } catch (error) {

            console.error(
                "Error deleting student:",
                error
            );

            alert(
                "Error deleting student."
            );

        }

    }
);


/* =========================
   CLOSE MODAL
========================= */

deleteModal.addEventListener(
    "click",
    (event) => {

        if (
            event.target === deleteModal
        ) {

            studentToDelete = null;

            deleteModal.classList.remove(
                "show"
            );

        }

    }
);


/* =========================
   LOGOUT
========================= */

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
