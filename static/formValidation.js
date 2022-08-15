function confirm_password(){
    let inputPass = document.querySelector('input[name=passwordRegister');
    let confirmPass = document.querySelector('input[name=passwordCheck');

    if(inputPass.value === confirmPass.value){
        confirmPass.setCustomValidity('');
    }
    else{
        confirmPass.setCustomValidity('Password does not match. Please try again.');
    }
}

