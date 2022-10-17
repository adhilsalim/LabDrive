//arrange in order ------------------------------------------

//USERNAME ARRAY FOR CONVERTING ROLL NUM TO EMAIL
var userName = ["aadhilakshmimr", "aaronsamuelmathew", "aarunyaretheep", "abhinands", "abhinavbkannanthanam", "abhinayak", "abhishekpanil", "abidmuhammad", "abinmelvin", "abinsunny", "abishekrpaleri", "adhamsaheer", "adheenathomas", "adhilp", "adhilsalim", "adithyansureshkumar", "adonashibu", "advaithmanoj", "aiswaryalakshminavami", "alanabdulgafar", "alanjoseph", "alankgeorge", "alansebastian", "alansiby", "alanthomasshaji", "albinjoseph", "alijasimrm", "alphonsafrancis", "alwynjoseph", "amalsasikumar", "amithaanil", "anaghatessb", "anandhuanoj", "ancitajferiah", "andriyaraju", "angelthomas", "anitthomas", "annmariajames", "annmathew", "annajob", "annapoornam", "anugrahpremachandran", "arjunsaji", "aronthomas", "arpitamarymathew", "arunka", "ashiquemuhammedtn", "ashwinmathewzachariah", "asinmaryjacob", "aswinmadhavanp", "aswinms", "athulmohan", "athulpshibu", "augustinesalas", "avinjoshy", "balasusanjacob", "catherineachupunnoose", "christinemariajose", "danmodymathew", "deeptaksunny", "diliyasaji", "edwinroy", "elbinsanthosh", "elizabethantony", "elizabethjullu", "elsageorge", "elzabethbobus", "emilthomas", "emilviju", "evanaannbenny"];

//TO CONVERT ROLL NUMBER TO EMAIL
function convertRollNumberToEmail(rollNumber) {
    let username = userName[rollNumber - 1] + '2025@cs.ajce.in';
    return username;
}

//TO PREVENT WEAK PASSWORD ERROR - APPENDING FIXED STRING TO THE END OF PASSWORD
function strongPassword(password) {
    let strongPassword = password + 'AXYer65*&--;k=-12UI';
    return strongPassword;
}

//TO SHOW FORM FILL ERRORS IN UI [SIGN IN AND SIGN UP]
function formFillError(formType) {
    if (formType == 'signUp') {
        signUpErrorDisplay.style.display = 'block';
        signUpErrorDisplay.innerHTML = 'Please fill all the fields correctly<br>1)First and Last name should not be empty<br>2)Roll number should be between 1 and 70<br>3)Birthday should not be empty<br>4)Password should be 4 characters long';
    }
    else if (formType == 'signIn') {
        signInErrorDisplay.style.display = 'block';
        signInErrorDisplay.innerHTML = 'Please fill all the fields correctly<br>1)Roll number should be between 1 and 70<br>2)Password should be 4 characters long';
    }
}

//SHOW LOG IN/SIGN IN ERROR FROM FIREBASE
function showAuthenticationError(error, formType) {

    if (formType == 'signUp') {
        signUpErrorDisplay.style.display = 'block';
        signUpErrorDisplay.innerHTML = error.replace('Firebase: Error (auth/', '').replace(').', '');
    }
    else if (formType == 'signIn') {
        signInErrorDisplay.style.display = 'block';
        signInErrorDisplay.innerHTML = error.replace('Firebase: Error (auth/', '').replace(').', '');
    }
}

//TO VALIDATE SIGN UP FORM
function signUpFormIsOk() {

    if (userFirstName.value != '' && userLastName.value != '' && userRollNumber.value > 0 && userRollNumber.value < 71 && userBirthDay.value != '' && userPasswordShort.value.length == 4) {
        return true;
    }
    else {
        return false;
    }
}

// TO VALIDATE SIGN IN FORM
function signInFormIsOk() {
    if (logInPassword.value.length == 4 && logInRollNumber.value > 0 && logInRollNumber.value < 71) {
        return true;
    }
    else {
        return false;
    }
}

//
function openFolder(foldername) {

}

//to show login page based on login state of user
function loginPageVisible(formVisibility) {
    //console.log('loginPageVisible');

    if (formVisibility) {
        loginBox.style.display = 'block';
    }
    else {
        loginBox.style.display = 'none';
    }
}

//to show app based on login state of user
function showApp(openApp, userData) {
    if (openApp) {
        let userId = userData.uid;
        let usermail = userData.email;
        //console.log('show app id', userId);
        //console.log('show app mail', usermail);
        accountMail.style.display = 'block';
        accountMail.innerHTML = `Logged in as ` + usermail;
    }
    else {
        //console.log('hide app', userData);
        accountMail.style.display = 'none';
    }

}

// TO GET THE FULL NAME OF USER BY APPENDING FIRST AND LAST NAME (AND MID IF PRESENT)
function getFullName() {
    let fullName = userFirstName.value + ' ' + userMidName.value + ' ' + userLastName.value;
    return fullName;
}

//TO REDIRECT TO PASSWORD RESET PAGE
function getUserPassword() {
    window.open("https://forms.gle/npryJAJ72JyC4vp3A");
}