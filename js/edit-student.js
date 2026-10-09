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
// GET STUDENT DOCUMENT ID
// ==============================

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const studentDocumentId =
    urlParams.get("id");


// ==============================
// CHECK LOGIN
// ==============================

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            window.location.href =
                "index.html";

            return;

        }

        if (!studentDocumentId) {

            document.getElementById(
                "editMessage"
            ).textContent =
                "Student not found.";

            return;

        }

        await loadStudent();

    }
);


// ==============================
// LOAD STUDENT
// ==============================

async function loadStudent() {

    try {

        const studentRef =
            doc(
                db,
                "students",
                studentDocumentId
            );


        const studentSnapshot =
            await getDoc(studentRef);


        if (!studentSnapshot.exists()) {

            document.getElementById(
                "editMessage"
            ).textContent =
                "Student not found.";

            return;

        }


        const student =
            studentSnapshot.data();


        // STUDENT ID

        document.getElementById(
            "studentId"
        ).value =
            student.studentId || "";


        // FIRST NAME

        document.getElementById(
            "firstName"
        ).value =
            student.firstName || "";


        // MIDDLE NAME

        document.getElementById(
            "middleName"
        ).value =
            student.middleName || "";


        // LAST NAME

        document.getElementById(
            "lastName"
        ).value =
            student.lastName || "";


        // AGE

        document.getElementById(
            "age"
        ).value =
            student.age || "";


        // PROGRAM

        const programSelect =
            document.getElementById(
                "program"
            );

        const otherProgram =
            document.getElementById(
                "otherProgram"
            );


        const program =
            student.program || "";


        const standardPrograms = [
            "BSCS",
            "BSIT",
            "BSEd",
            "BSBA"
        ];


        if (
            standardPrograms.includes(
                program
            )
        ) {

            programSelect.value =
                program;

            otherProgram.style.display =
                "none";

            otherProgram.required =
                false;

        } else if (program) {

            programSelect.value =
                "Other";

            otherProgram.value =
                program;

            otherProgram.style.display =
                "block";

            otherProgram.required =
                true;

        } else {

            programSelect.value =
                "";

            otherProgram.style.display =
                "none";

            otherProgram.required =
                false;

        }


        // SECTION

        document.getElementById(
            "section"
        ).value =
            student.section || "";


        // CONTACT

        document.getElementById(
            "contact"
        ).value =
            student.contact || "";


        // EMAIL

        document.getElementById(
            "email"
        ).value =
            student.email || "";


        // GUARDIAN NAME

        document.getElementById(
            "guardianName"
        ).value =
            student.guardianName || "";


        // GUARDIAN CONTACT

        document.getElementById(
            "guardianContact"
        ).value =
            student.guardianContact || "";


    } catch (error) {

        console.error(
            "Error loading student:",
            error
        );

        document.getElementById(
            "editMessage"
        ).textContent =
            "Error loading student.";

    }

}


// ==============================
// PROGRAM DROPDOWN
// ==============================

const programSelect =
    document.getElementById(
        "program"
    );

const otherProgram =
    document.getElementById(
        "otherProgram"
    );


if (
    programSelect &&
    otherProgram
) {

    programSelect.addEventListener(
        "change",
        () => {

            if (
                programSelect.value ===
                "Other"
            ) {

                otherProgram.style.display =
                    "block";

                otherProgram.required =
                    true;

                otherProgram.focus();

            } else {

                otherProgram.style.display =
                    "none";

                otherProgram.required =
                    false;

                otherProgram.value =
                    "";

            }

        }
    );

}


// ==============================
// SAVE CHANGES
// ==============================

const editStudentForm =
    document.getElementById(
        "editStudentForm"
    );


if (editStudentForm) {

    editStudentForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const editMessage =
                document.getElementById(
                    "editMessage"
                );


            // GET VALUES

            const firstName =
                document.getElementById(
                    "firstName"
                ).value.trim();


            const middleName =
                document.getElementById(
                    "middleName"
                ).value.trim();


            const lastName =
                document.getElementById(
                    "lastName"
                ).value.trim();


            const age =
                document.getElementById(
                    "age"
                ).value;


            const section =
                document.getElementById(
                    "section"
                ).value.trim();


            const contact =
                document.getElementById(
                    "contact"
                ).value.trim();


            const email =
                document.getElementById(
                    "email"
                ).value.trim();


            const guardianName =
                document.getElementById(
                    "guardianName"
                ).value.trim();


            const guardianContact =
                document.getElementById(
                    "guardianContact"
                ).value.trim();


            // GET PROGRAM

            let program =
                programSelect.value;


            if (
                program === "Other"
            ) {

                program =
                    otherProgram.value.trim();

            }


            // VALIDATE CONTACT

            if (
                !/^\d{11}$/.test(
                    contact
                )
            ) {

                editMessage.textContent =
                    "Contact number must be exactly 11 digits.";

                return;

            }


            // VALIDATE GUARDIAN CONTACT

            if (
                !/^\d{11}$/.test(
                    guardianContact
                )
            ) {

                editMessage.textContent =
                    "Guardian contact number must be exactly 11 digits.";

                return;

            }


            // VALIDATE OTHER PROGRAM

            if (
                programSelect.value ===
                    "Other" &&
                program === ""
            ) {

                editMessage.textContent =
                    "Please enter the program.";

                return;

            }


            // CREATE FULL NAME

            const fullName =
                [
                    firstName,
                    middleName,
                    lastName
                ]
                    .filter(Boolean)
                    .join(" ");


            try {

                const studentRef =
                    doc(
                        db,
                        "students",
                        studentDocumentId
                    );


                await updateDoc(
                    studentRef,
                    {

                        firstName:
                            firstName,

                        middleName:
                            middleName,

                        lastName:
                            lastName,

                        fullName:
                            fullName,

                        age:
                            Number(age),

                        program:
                            program,

                        section:
                            section,

                        contact:
                            contact,

                        email:
                            email,

                        guardianName:
                            guardianName,

                        guardianContact:
                            guardianContact

                    }
                );


                editMessage.textContent =
                    "Student updated successfully!";


                setTimeout(
                    () => {

                        window.location.href =
                            "students.html";

                    },
                    1000
                );


            } catch (error) {

                console.error(
                    "Error updating student:",
                    error
                );


                editMessage.textContent =
                    "Error updating student.";

            }

        }
    );

}


// ==============================
// CANCEL
// ==============================

const cancelButton =
    document.getElementById(
        "cancelButton"
    );


if (cancelButton) {

    cancelButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "students.html";

        }
    );

}


// ==============================
// LOGOUT
// ==============================

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


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
