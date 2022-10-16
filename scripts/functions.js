var userName = ["aadhilakshmimr", "aaronsamuelmathew", "aarunyaretheep", "abhinands", "abhinavbkannanthanam", "abhinayak", "abhishekpanil", "abidmuhammad", "abinmelvin", "abinsunny", "abishekrpaleri", "adhamsaheer", "adheenathomas", "adhilp", "adhilsalim", "adithyansureshkumar", "adonashibu", "advaithmanoj", "aiswaryalakshminavami", "alanabdulgafar", "alanjoseph", "alankgeorge", "alansebastian", "alansiby", "alanthomasshaji", "albinjoseph", "alijasimrm", "alphonsafrancis", "alwynjoseph", "amalsasikumar", "amithaanil", "anaghatessb", "anandhuanoj", "ancitajferiah", "andriyaraju", "angelthomas", "anitthomas", "annmariajames", "annmathew", "annajob", "annapoornam", "anugrahpremachandran", "arjunsaji", "aronthomas", "arpitamarymathew", "arunka", "ashiquemuhammedtn", "ashwinmathewzachariah", "asinmaryjacob", "aswinmadhavanp", "aswinms", "athulmohan", "athulpshibu", "augustinesalas", "avinjoshy", "balasusanjacob", "catherineachupunnoose", "christinemariajose", "danmodymathew", "deeptaksunny", "diliyasaji", "edwinroy", "elbinsanthosh", "elizabethantony", "elizabethjullu", "elsageorge", "elzabethbobus", "emilthomas", "emilviju", "evanaannbenny"];

//to convert roll number to email address
function convertRollNumberToEmail(rollNumber) {
    //console.log('convertRollNumberToEmail: ', rollNumber);
    let username = userName[rollNumber - 1] + '2025@cs.ajce.in';
    return username;
}

//to prevent weak password error
function strongPassword(password) {
    let strongPassword = password + 'AXYer65*&--;k=-12UI';
    //console.log('strongPassword: ', strongPassword);
    return strongPassword;
}

//to show error on login in
function showLoginError(message) {
    signInErrorDisplay.style.display = 'block';
    signInErrorDisplay.innerHTML = message;
    console.log('logInError: ', message);
}

//to validate sign up form
function signUpFormIsOk() {
    //add conditions to validate the following: nameIsNotEmpty, userNameIsNotEmptyForEmail, passwordIs4Character, birthdayIsNotEmpty
    if (userFirstName.value != '' && userLastName.value != '' && userRollNumber.value > 0 && userRollNumber.value < 71 && userBirthDay.value != '' && userPasswordShort.value.length == 4) {
        return true;
    }
    else {
        signInErrorDisplay.style.display = 'block';
        signInErrorDisplay.innerHTML = 'Please fill all the fields correctly<br>1)First and Last name should not be empty<br>2)Roll number should be between 1 and 70<br>3)Birthday should not be empty<br>4)Password should be 4 characters long';
        return false;
    }
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

//to get full name of user
function getFullName() {
    let fullName = userFirstName.value + ' ' + userMidName.value + ' ' + userLastName.value;
    return fullName;
}

//to get password if the user is on his/her default device
function getUserPassword() {
    window.open("https://forms.gle/npryJAJ72JyC4vp3A");
}