//To get the elements of the html document the following lines are used 
const form = document.getElementById('form')
const email_input = document.getElementById('email_input')
const password_input = document.getElementById('password_input')
const error_message = document.getElementById('error_message')

//Here the valid email pattern is defined for verifying it 
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

//remember me checkbox functionality is added here
const rememberMeCheckbox = document.getElementById('remember_me');


window.onload = function () {
    if (localStorage.getItem('email') && localStorage.getItem('password')) {
        email_input.value = localStorage.getItem('email');
        password_input.value = localStorage.getItem('password');
        rememberMeCheckbox.checked = true;
    }
};

//for the form the submit event is added using addEventListener
form.addEventListener('submit',(e) =>{
    e.preventDefault()         //this will prevent the form from auto submitting

    error_message.innerText = ''

    const email = email_input.value
    const password = password_input.value
    const loader = document.getElementById('loader')


    
    let errors = getLoginFormErrors(email,password)            //Defining the errors that we get from login form


    //the following lines make sure that if the array storing errors has length greater than 0 it will throw the error message else it will proceeds with fetch
    if (errors.length > 0){                                    
        error_message.innerText = errors.join('\n')
        return
    }

    loader.classList.remove('loader-hidden')

    // in the fetch a post method is used that will add the data i.e email and password to the url that is provided

    fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body : JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(response => response.json())    
    .then(data => {
        showAlert('Login Successful')  //if there are no errors this success message will be displayed
        console.log(data)
    })
    .catch(error => {
        showAlert('Login Failed')         //if there are errors this error message will be displayed
        console.error('Error',error)
    })
    .finally(()=>{
        loader.classList.add('loader-hidden')

    })
    
})


//with the use of following function input validation is done and corresponding error messages are displayed i.e if the input field is empty or wrong input is given 

function getLoginFormErrors(email,password){
    let errors = []
    if (email === ''|| email == null) {
        errors.push('Email is required')
    }
    else if (!emailPattern.test(email)){
        errors.push('Incorrect Email')
    }
    if (password === ''|| password == null) {
        errors.push('Password is required')
    }
    else if (password.length < 6){
        errors.push('Password must be at least 6 characters')
    }
    return errors
}

//the following function is used for displaying the success and failure messages as popup

function showAlert(message){
    const popup = document.getElementById('alertPopup')
    const popupMessage = document.getElementById('Popup-message')
    const okButton = document.querySelector('.Ok-btn')

    popupMessage.textContent = message
    popup.style.display = 'block'
    okButton.onclick = function(){
        popup.style.display = 'none'
    }

    window.onclick = function(event) {
        if (event.target == popup){
            popup.style.display = 'none'
        }
    }
}

//the following section is used to make the password hidden or visible

document.querySelector('.fa-eye').addEventListener('click',function(){
    const type = password_input.type === 'password' ? 'text' : 'password'
    password_input.type = type
    this.classList.toggle('fa-eye-slash')
})