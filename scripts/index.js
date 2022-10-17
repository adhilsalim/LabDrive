//IMPORTING FIREBASE SERVICE - AUTH, RT DB, STORAGE
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js';
import {
    getAuth,
    onAuthStateChanged,
    connectAuthEmulator,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js';
import {
    getDatabase,
    ref,
    set,
    onValue,
    push
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
    var userFolders = database.ref('leads');
    leadsRef.on('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val();
        });
    });
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
            showLoginError(error.message);
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
            console.log(error);
            showLoginError(error.message);
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
        password: pass
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

    set(newUserFolder, {
        foldername: folderName
    }).then(() => {
        console.log('folder created'); //folder created
    }).catch((error) => {
        console.log(error); //error
    });
}

//onChildAdded()
//onChildChanged()
//onChildRemoved()









//==================================STORAGE=========================================//
var files = [];
var reader = new FileReader();

var namebox = document.getElementById('namebox');
var extlabel = document.getElementById('extlabel');
var myimg = document.getElementById('myimg');
var proglab = document.getElementById('proglab');
var selbtn = document.getElementById('selbtn');
var upbtn = document.getElementById('upbtn');
var downbtn = document.getElementById('downbtn');

var input = document.createElement('input');
input.type = 'file';

input.onchange = e => {
    files = e.target.files;

    var extension = GetFileExt(files[0]);
    var name = GetFileName(files[0]);

    namebox.value = name;
    extlabel.innerHTML = extension;

    reader.readAsDataURL(files[0]);
}

reader.onload = function () {
    myimg.src = reader.result;
}

selbtn.addEventListener('click', function () {
    input.click();
});

function GetFileExt(file) {
    var temp = file.name.split('.');
    var ext = temp.slice((temp.length - 1), (temp.length));
    return '.' + ext[0];
}

function GetFileName(file) {
    var temp = file.name.split('.');
    var fname = temp.slice(0, -1).join('.');
    return fname;
}

async function UploadProcess() {
    var imagToUpload = files[0];
    var imgname = namebox.value + extlabel.innerHTML;

    const metaData = {
        contentType: imagToUpload.type
    }

    const storage = getStorage();
    const storageref = sRef(storage, 'images/' + imgname);

    const uploadTask = uploadBytesResumable(storageref, imagToUpload, metaData);

    uploadTask.on('state_changed', function (snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        proglab.innerHTML = 'Upload is ' + progress + '% done';
    }, function (error) {
        console.log(error);
    }, function () {
        getDownloadURL(uploadTask.snapshot.ref).then(function (downloadURL) {
            console.log('File available at', downloadURL);
        });
    });
}

upbtn.addEventListener('click', UploadProcess);