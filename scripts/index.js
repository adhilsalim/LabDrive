//importing firebase services
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


//firebase initialize
const firebaseApp = initializeApp({
    apiKey: "AIzaSyCyIzzAEVq7Dt7i3nJDzRaLLWFa7Zqblqs",
    authDomain: "adhil-services.firebaseapp.com",
    databaseURL: "https://adhil-services-default-rtdb.firebaseio.com",
    projectId: "adhil-services",
    storageBucket: "adhil-services.appspot.com",
    messagingSenderId: "493243510921",
    appId: "1:493243510921:web:099fcb83fb7c10ebd95658"
});

const auth = getAuth(firebaseApp); //reference to authentication

//==================================AUTH=========================================//

//check auth state
onAuthStateChanged(auth, (user) => {
    if (user != null) {
        console.log('user logged in: ', user);
        const userDisplayName = user.displayName;
        const userEmail = user.email;
        const userPhotoUrl = user.photoURL;
        const userEmailVerified = user.emailVerified;
        const userUid = user.uid;
        console.log(userDisplayName, userEmail, userPhotoUrl, userEmailVerified, userUid);
    } else {
        console.log('user logged out');
    }
});

//login with existing account
const loginEmailWithPassword = async () => {
    console.log('login with email and password');
    const userEmail = convertRollNumberToEmail(signUpRollNumber.value);
    console.log(userEmail);
    const userPassword = strongPassword(signUpPassword.value);
    console.log(userPassword);

    console.log(signUpRollNumber.value.length);
    console.log(signUpPassword.value.length);
    if (signUpRollNumber.value.length != 0 && signUpPassword.value.length == 4) {
        console.log('sign up form is ok');
        try {
            const usersCredential = await signInWithEmailAndPassword(auth, userEmail, userPassword);
            console.log(usersCredential.user);
        }
        catch (error) {
            showLoginError(error.message);
        }
    }
    else {
        console.log('sign up form is not ok');
        showLoginError('displayErrorMessage');
    }


}
btnLogin.addEventListener('click', loginEmailWithPassword);

//create new account
const createAccount = async () => {
    console.log('create account function');
    const userEmail = convertRollNumberToEmail(userRollNumber.value);
    console.log(userEmail);
    const userPassword = strongPassword(userPasswordShort.value);
    console.log(userPassword);

    if (signUpFormIsOk()) {
        console.log('form is ok');
        try {
            console.log('try block');
            const usersCredential = await createUserWithEmailAndPassword(auth, userEmail, userPassword);
            const userUniqueId = usersCredential.user.uid;
            //console.log('THE UID 1', userUniqueId);
            //console.log(usersCredential.user.value);
            //console.log('THE UID 2', usersCredential.uid);
            writeUserData(userUniqueId, getFullName(), userRollNumber.value, userBirthDay.value, userEmail, userPasswordShort);
        }
        catch (error) {
            console.log(error);
            showLoginError(error.message);
        }
    }
    else {
        console.log('form is not ok');
        showLoginError('displayErrorMessage');
    }

}
btnSignUp.addEventListener('click', createAccount);


//monitor auth state
const monitorAuthState = () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log('user logged in');
            console.log(user);
            showApp(true, user);
            loginPageVisible(false);
        }
        else {
            console.log('user logged out');
            showApp(false, 'null');
            loginPageVisible(true);
        }
    });
}
monitorAuthState();

//logout
const logOut = async () => {
    await signOut(auth);
}
btnLogout.addEventListener('click', logOut);

//==================================DATABASE=========================================//
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
    });

    set(ref(db, 'LabDrive/users/' + userId + '/folders'), {

    });

    const userFoldersRef = ref(db, 'LabDrive/users/' + userId + '/folders');
    const newUserFolder = push(userFoldersRef);
    set(newUserFolder, {
        foldername: 'Java'
    });
}

/*onValue(distref, (snapshot) => {
    const data = snapshot.val();
    console.log(data);
    updatedist(posElement, data);
});*/

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