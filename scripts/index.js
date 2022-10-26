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
var currentUserName = '';
var currentUserBirthday = '';
var currentUserEmail = '';
var currentUserRollNumber = '';
var totalUserFolders = 0;
var totalUserFiles = 0;
var currentUserTotalUploads = 0;
var currentUserTotalDownloads = 0;
var html;
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
            console.log('USER LOGGED IN ');

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
    const userAccountDetailsRef = ref(db, 'LabDrive/users/' + auth.currentUser.uid);

    //GETTING USER DATA
    currentUserUID = auth.currentUser.uid;

    //temp
    html = document.getElementById('counterTotalFolders').innerHTML;
    html = '';

    onValue(userAccountDetailsRef, (snapshot) => {

        //SETTING USER DATA
        currentUserName = snapshot.val().fullname;
        currentUserBirthday = snapshot.val().birthday;
        currentUserEmail = snapshot.val().emailid;
        currentUserRollNumber = snapshot.val().rollnumber;
        currentUserTotalUploads = snapshot.val().totalupload;
        currentUserTotalDownloads = snapshot.val().totaldownload;

        html = `<img class="round" width="50" height="50" avatar="${currentUserName}"><br>
        <p title="${currentUserEmail}">${currentUserName}</p><br>
        <p>12 file<br>${currentUserTotalUploads} uploads<br>${currentUserTotalDownloads} downloads</p>`;

        document.getElementById('counterTotalFolders').innerHTML = html;
        const folders = snapshot.val().folders;
        getFolderFromDb(folders);
    }, {
        onlyOnce: true,
    })
}


function getFolderFromDb(folder) {

    //console.log(folder);

    for (const property in folder) {

        //console.log(folder['foldername:']);
        //console.log(property, folder[property]);
        html += `<br><div><p>${folder[property].foldername}</p></div>`;
        document.getElementById('counterTotalFolders').innerHTML = html;

        //console.log('The folder name is ', folder[property].foldername);
        const files = folder[property].files;
        getFilesFromDb(files);
    }
}

function getFilesFromDb(file) {
    for (const property in file) {
        //console.log(property, file[property]);
        html += `<br><div><p><a href="${file[property].fileurl}">${file[property].filename}</a><br>
        ${file[property].filedate}<br>
        ${file[property].filesize}<br>
        ${file[property].filetype}<br>
        </p></div>`;
        document.getElementById('counterTotalFolders').innerHTML = html;

        //console.log(property);
        //console.log(file[property].filename); console.log(file[property].filedate); console.log(file[property].filesize); console.log(file[property].filetype); console.log(file[property].fileurl);
    }
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


