var userName = ['adhilsalim', 'adhilp', 'abhinands'];

//to convert roll number to email address
function convertRollNumberToEmail(rollNumber) {
    console.log('convertRollNumberToEmail: ', rollNumber);
    let username = userName[rollNumber - 1] + '2025@cs.ajce.in';
    return username;
}

//to prevent weak password error
function strongPassword(password) {
    let strongPassword = password + 'AXYer65*&--;k=-12UI';
    console.log('strongPassword: ', strongPassword);
    return strongPassword;
}

//to show error on login in
function showLoginError(message) {
    console.log('logInError: ', message);
}

//to validate sign up form
function signUpFormIsOk() {
    //add conditions to validate the following: nameIsNotEmpty, userNameIsNotEmptyForEmail, passwordIs4Character, birthdayIsNotEmpty
    return true;
}

//to show login page based on login state of user
function loginPageVisible(formVisibility) {
    console.log('loginPageVisible');

    if (formVisibility) {
        loginBox.style.display = 'block';
    }
    else {
        loginBox.style.display = 'none';
    }


}

//to show app based on login state of user
function showApp(openApp) {
    if (openApp) {
        console.log('show app');
    }
    else {
        console.log('hide app');
    }

}

//to get full name of user
function getFullName() {
    let fullName = userFirstName.value + ' ' + userMidName.value + ' ' + userLastName.value;
    return fullName;
}