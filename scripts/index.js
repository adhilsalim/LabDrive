//IMPORTING FIREBASE SERVICE - AUTH, RT DB, STORAGE
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js';
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js';
import {
    getDatabase,
    ref,
    set,
    onValue,
    push,
    onChildAdded,
    onChildChanged,
    onChildRemoved
} from "https://www.gstatic.com/firebasejs/9.12.1/firebase-database.js";
import {
    getStorage,
    ref as sRef,
    uploadBytesResumable,
    getDownloadURL
} from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-storage.js';


//FIREBASE INITIALIZATION
const firebaseApp = initializeApp({
    apiKey: "AIzaSyCyIzzAEVq7Dt7i3nJDzRaLLWFa7Zqblqs",
    authDomain: "adhil-services.firebaseapp.com",
    databaseURL: "https://adhil-services-default-rtdb.firebaseio.com",
    projectId: "adhil-services",
    storageBucket: "adhil-services.appspot.com",
    messagingSenderId: "493243510921",
    appId: "1:493243510921:web:099fcb83fb7c10ebd95658"
});

//====================================GLOBAL VARIABLES=======================================//
var currentUserUID = '';
var totalFolders = 0;

//==================================AUTHENTICATION=========================================//
const auth = getAuth(firebaseApp); //auth

// CHECKING CURRENT AUTH STATE
/*
onAuthStateChanged(auth, (user) => {
    if (user != null) {

        //const userDisplayName = user.displayName;
        //const userPhotoUrl = user.photoURL;
        //const userEmailVerified = user.emailVerified;

        console.log('user logged in: ', user);
        const userUid = user.uid;
        const userEmail = user.email;

        //console.log(userDisplayName, userEmail, userPhotoUrl, userEmailVerified, userUid);
        //getUserData();

    } else {
        console.log('user logged out');
    }
});*/
const monitorAuthState = () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log('USER LOGGED IN ', user);

            showApp(true, user); //open app
            loginPageVisible(false); //close login page

            getUserData(); //get user data
        }
        else {
            console.log('USER LOGGED OUT');

            showApp(false, 'null'); //close app
            loginPageVisible(true); //open login page
        }
    });
}
monitorAuthState();


//GET BASIC USER DATA [INCOMPLETE]
function getUserData() {
    const db = getDatabase();
    const userFileRef = ref(db, 'LabDrive/users/' + auth.currentUser.uid + '/folders');
    const userAccountDetailsRef = ref(db, 'LabDrive/users/' + auth.currentUser.uid);

    //GETTING USER DATA
    currentUserUID = auth.currentUser.uid;

    //temp
    var html = document.getElementById('counterTotalFolders').innerHTML;

    /*onValue(userFileRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            totalFolders++;
            const childKey = childSnapshot.key;
            const childData = childSnapshot.val();
            console.log(childData.foldername);
            html += `<p id="cd${childData.folderName}" onclick="openFolder(this.id)"><b>${childData.foldername}</b></p>`;
            document.getElementById('counterTotalFolders').innerHTML = html;
            //console.log(html);
        });
    }, {
        onlyOnce: true,
    })*/


    onValue(userAccountDetailsRef, (snapshot) => {
        /*snapshot.forEach((childSnapshot) => {
            const childKey = childSnapshot.key;
            const childData = childSnapshot.val();
            console.log(childKey, childData);
            //console.log(childData.foldername);
            //html += `<p id="cd${childData.folderName}" onclick="openFolder(this.id)"><b>${childData.foldername}</b></p>`;
            //document.getElementById('counterTotalFolders').innerHTML = html;
            //console.log(html);
        });*/
        console.log('birthday', snapshot.val().birthday);
        console.log('email', snapshot.val().emailid);
        console.log('name', snapshot.val().fullname);
        console.log('rollnumber', snapshot.val().rollnumber);
        console.log('totalupload', snapshot.val().totalupload);
        console.log('totaldownload', snapshot.val().totaldownload);
    }, {
        onlyOnce: true,
    })
}



//LOG IN USER WITH ROLL NUMBER AND PASSWORD (EMAIL AND PASSWORD)
const loginEmailWithPassword = async () => {
    const userEmail = convertRollNumberToEmail(logInRollNumber.value);
    const userPassword = strongPassword(logInPassword.value);

    if (signInFormIsOk()) {
        try {
            const usersCredential = await signInWithEmailAndPassword(auth, userEmail, userPassword);
            console.log(usersCredential.user);
        }
        catch (error) {
            //console.log('the error message is', String(error.message));
            showAuthenticationError(String(error.message), 'signIn');
        }
    }
    else {
        formFillError('signIn');
    }
}
btnLogin.addEventListener('click', loginEmailWithPassword);

//FORGET PASSWORD
passwordForgetButton.addEventListener("click", () => {
    getUserPassword();
});

//SIGN UP WITH ROLL NUMBER AND PASSWORD (EMAIL AND PASSWORD)
const createAccount = async () => {
    const userEmail = convertRollNumberToEmail(userRollNumber.value);
    const userPassword = strongPassword(userPasswordShort.value);

    if (signUpFormIsOk()) {
        try {
            const usersCredential = await createUserWithEmailAndPassword(auth, userEmail, userPassword);
            const userUniqueId = usersCredential.user.uid;

            //store user data to realtime db
            writeUserData(userUniqueId, getFullName(), userRollNumber.value, userBirthDay.value, userEmail, userPasswordShort);

            /* localStorage for storing password */
            if (typeof (Storage) != "undefined") {
                if (defaultDevice.checked) {
                    localStorage.setItem(String(userBirthDay.value), String(userPasswordShort.value));
                }

            } else {
                console.log('no local storage');
            }
        }
        catch (error) {
            console.log('the error message is', error);
            showAuthenticationError(error.message, 'signUp');
        }
    }
    else {
        formFillError('signUp');
    }

}
btnSignUp.addEventListener('click', createAccount);

//LOG OUT USER
const logOut = async () => {
    await signOut(auth);
}
btnLogout.addEventListener('click', logOut);


//==================================DATABASE=========================================//
//STORING USERDATA TO DATABASE
function writeUserData(userId, name, rnum, bday, email, pass) {
    const db = getDatabase();

    //const dbRef = ref(db, 'LabDrive/users/' + userId);
    //const newPostRef = push(dbRef);

    set(ref(db, 'LabDrive/users/' + userId), {
        fullname: name,
        rollnumber: rnum,
        birthday: bday,
        emailid: email,
        totalupload: 0,
        totaldownload: 0
    }).then(() => {
        console.log('data saved'); //user data saved
    }).catch((error) => {
        console.log(error); //error
    });

    //calling function to create the user folders
    createUserFolder(userId, db, 'OOPS');
    createUserFolder(userId, db, 'DS');
    createUserFolder(userId, db, 'Others');
}

//CREATING FOLDER
function createUserFolder(userId, db, folderName) {
    const userFoldersRef = ref(db, 'LabDrive/users/' + userId + '/folders');
    const newUserFolder = push(userFoldersRef);
    var folderId = newUserFolder.key;

    set(newUserFolder, {
        foldername: folderName
    }).then(() => {
        addWelcomeFile(userId, db, folderId, folderName);
        console.log('folder created'); //folder created
    }).catch((error) => {
        console.log(error); //error
    });
}


function addWelcomeFile(userId, db, folderId, folderName) {

    const userFilesRef = ref(db, 'LabDrive/users/' + userId + '/folders/' + folderId + '/files');
    const newUserFile = push(userFilesRef);

    set(newUserFile, {
        filename: 'Welcome to LabDrive',
        fileurl: 'https://google.com',
        filetype: 'text/plain',
        filesize: '0.00 KB',
        filedate: '2021-01-01'
    }).then(() => {
        console.log('file created'); //file created
    }).catch((error) => {
        console.log(error); //error
    });
}








//==================================STORAGE=========================================//
var files = [];
var reader = new FileReader();

//DISPLAY FILE NAME AND EXTENSION
var fileNameDisplay = document.getElementById('fileNameDisplay');
var fileExtDisplay = document.getElementById('fileExtDisplay');

//FILE UPLOAD PROGRESS BAR
var fileUploadProgressBar = document.getElementById('fileProgressText');

//FILE ACTION BUTTONS
var fileSelectionButton = document.getElementById('fileSelBtn');
var fileUploadButton = document.getElementById('fileUpBtn');
var fileDownloadButton = document.getElementById('fileDownBtn');

var fileInput = document.createElement('input');
fileInput.type = 'file';

//FILE SELECTION
fileInput.onchange = e => {
    files = e.target.files;

    var extension = GetFileExt(files[0]).toLowerCase();
    var name = GetFileName(files[0]);
    console.log(extension);
    if (extension == '.c' || extension == '.java' || extension == '.txt') {
        fileNameDisplay.value = name;
        fileExtDisplay.innerHTML = extension;
    }
    else {
        console.log('file type not allowed');
    }

    reader.readAsDataURL(files[0]);
}

//FILE AFTER SELECTION
reader.onload = function () {
    console.log('file loaded');
}

fileSelectionButton.addEventListener('click', function () {
    fileInput.click();
});


//FUNCTION TO GET FILE EXTENSION
function GetFileExt(file) {
    var temp = file.name.split('.');
    var ext = temp.slice((temp.length - 1), (temp.length));
    return '.' + ext[0];
}

//FUNCTION TO GET FILE NAME
function GetFileName(file) {
    var temp = file.name.split('.');
    var fname = temp.slice(0, -1).join('.');
    return fname;
}

async function UploadProcess() {

    //SETTING FILE, FILENAME, FILETYPE 
    var fileToUpload = files[0];
    var fileName = fileNameDisplay.value + fileExtDisplay.innerHTML;

    const metaData = {
        contentType: fileToUpload.type
    }


    //STORAGE REFERENCE
    const storage = getStorage();
    const storageReference = sRef(storage, 'LabDrive/' + currentUserUID + + fileName);

    const uploadTask = uploadBytesResumable(storageReference, fileToUpload, metaData);

    uploadTask.on('state_changed', function (snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        fileUploadProgressBar.innerHTML = 'Upload is ' + progress + '% done';
    }, function (error) {
        console.log(error);
    }, function () {
        getDownloadURL(uploadTask.snapshot.ref).then(function (downloadURL) {
            console.log('File available at', downloadURL);
        });
    });
}

fileUploadButton.addEventListener('click', UploadProcess);