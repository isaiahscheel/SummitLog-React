/*
    File of helper methods and validator methods called by some of the requests.
*/

/*
    Helper method to check if the email is empty or just white space
*/
const isEmpty = (string) => {
    if (string.trim() == '') {
        return true;
    }
    else {
        return false;
    }
}
/*
    Helper method to Check if an email is really an email. Found the Regular Expression online pretty easily
*/
const isEmail = (email) => {
    const regEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regEx)) {
        return true;
    }
    else {
        return false;
    }
}

exports.validateSignupData = (data) => {
    /*
       Empty error object to hold our error messages
   */
    let errors = {};
    /*
        Check if the email is empty
    */
    if (isEmpty(data.email)) {
        errors.email = 'Must not be empty';
    }
    /*
        Check if the email is really on email
    */
    else if (!isEmail(data.email)) {
        errors.email = 'Must be a valid email address';
    }
    /*
        Check if the password is empty
    */
    if (isEmpty(data.password)) {
        errors.password = 'Must not be empty';
    }
    /*
        Check if the passwords match
    */
    if (data.password !== data.confirmPassword) {
        errors.confirmPassword = 'Passwords must match';
    }
    /*
        Check if the handle is empty
    */
    if (isEmpty(data.handle)) {
        errors.handle = 'Must not be empty';
    }

    /*
        Check to see if we have any errors in our object
    */
    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}

exports.validateLogindata = (data) => {

    let errors = {};

    if (isEmpty(user.email)) {
        errors.email = 'Must not be empty';
    }
    if (isEmpty(user.password)) {
        errors.password = 'Must not be empty';
    }
    /*
        Check to see if we have any errors in our object
    */
    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }

}
