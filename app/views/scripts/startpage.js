const signupButton = document.getElementById("signup");
const signinButton = document.getElementById("signin");
const usernameSignup = document.getElementById("usernamesignup");
const passwordSignup = document.getElementById("passwordsignup");
const usernameSignin = document.getElementById("usernamesignin");
const passwordSignin = document.getElementById("passwordsignin");

signupButton.addEventListener("click",e => {
    const data = {
        "username": usernameSignup.value,
        "password": passwordSignup.value
    };
    fetch("http://localhost:8000/auth/signup",{
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(data)
    })
});

signinButton.addEventListener("click",() => {

})