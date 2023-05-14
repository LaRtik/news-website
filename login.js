const firebaseConfig = {
    apiKey: "AIzaSyDUTdJc9CBz0guQhx4feR8rd1EpN258wq0",
    authDomain: "news-website-1d780.firebaseapp.com",
    databaseURL: "https://news-website-1d780-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "news-website-1d780",
    storageBucket: "news-website-1d780.appspot.com",
    messagingSenderId: "146865053490",
    appId: "1:146865053490:web:14078a681b908f0d5e812b",
    measurementId: "G-GHTN6WZCJ8"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);

// login.html
var loginForm = document.getElementById('login-form');
var loginText = document.getElementById('login');
var passwordText = document.getElementById('password');
var errorField = document.getElementById('error-field');

const fadeOut = (el) => {
	el.style.opacity = 1;
	el.style.transition = `opacity ${500}ms`;
	el.style.opacity = 0;
  
	setTimeout(() => {
	  el.style.display = 'none';
	}, 500);
  };

if (loginForm) {
    if (localStorage.getItem("login") != null) {
        loginForm.innerHTML = `<h2> You are logged as ${localStorage.getItem("login").toUpperCase()}</h2>`
        const logoutButton = document.createElement("button");
        logoutButton.id = "login-button";
        logoutButton.style.minHeight = "40px";
        logoutButton.innerText = "LOGOUT";
        logoutButton.addEventListener("click", function () {
            let confirm = window.confirm("Do you really want to logout?");
            if (!confirm) return;
            localStorage.clear();
            window.location.reload();
        })
        loginForm.appendChild(logoutButton);
    }

    loginForm.onsubmit = function (e) {
        e.preventDefault();
        var login = loginText.value;
        var password = passwordText.value;
        db.collection('users').doc(login)
            .get()
            .then((doc) => {
                console.log(doc)
                if (!doc.exists) {
                    alert("Incorrect login.");
                    return;
                }
                if (doc.data().password !== password) {
                    alert("Incorrect password. Please check all the symbols");
                    return;
                }
                localStorage.setItem("login", login);
                localStorage.setItem("admin", doc.data().admin);
                localStorage.setItem("permissions", doc.data().permissions);
                //console.log(currentUser);
                alert(`Welcome, ${login}!`);
                window.location.replace("create");
				fadeOut(document.getElementsByClassName("se-pre-con")[0]);
            });
    };
}

window.onload = function() {
	fadeOut(document.getElementsByClassName("se-pre-con")[0]);
}