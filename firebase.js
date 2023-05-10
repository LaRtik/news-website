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


var createArticle = document.getElementById('create-article-form');
var createArticleText = document.getElementById('html-output');
var createArticleTitle = document.getElementById('topic-selector');
var createArticleButton = document.getElementById('submit-button');
var loginForm = document.getElementById('login-form');
var loginText = document.getElementById('login');
var passwordText = document.getElementById('password');
var errorField = document.getElementById('error-field');
var adminTableBody = document.getElementById('admin-table-body');

function writeNewArticle(title, body) {
	var postData = {
		body: body,
		title: title,
	};

	db.collection('posts').add(postData).then((docRef) => {
		console.log('Post added with ID: ', docRef.id);
		alert("Post was succesfully posted!");
		window.location.reload();
	})
		.catch((error) => {
			console.error("Error adding post: ", error);
		});
}

if (createArticle) {
	createArticle.onsubmit = function (e) {
	e.preventDefault();
	var text = createArticleText.value;
	var title = createArticleTitle.value;	
	if (title.length > 80) {
		alert("Title length can not more then 80 symbols");
		return;
	}
	writeNewArticle(title, text);
};
}


if (loginForm) {
	if (localStorage.getItem("user")) {	
		errorField.innerHTML = "Now logged as " + localStorage.getItem("user");
	}
	
	loginForm.onsubmit = function (e) {
		e.preventDefault();
		var login = loginText.value;
		var password = passwordText.value;
		if (db.collection('users').where("login", "==", login)) {
			if (db.collection('users').where("password", "==", password)) {

			}
		}

		//db.collection('posts').add(postData).then((docRef) => {
		//	console.log('Post added with ID: ', docRef.id);
		//	alert("Post was succesfully posted!");
		//	window.location.reload();
		//})
		//	.catch((error) => {
		//		console.error("Error adding post: ", error);
		//	});
		auth.signInWithEmailAndPassword(login, password)
			.then((userCredential) => {
				// Signed in
				user = userCredential.user;
				errorField.innerHTML = "Now logged as " + auth.currentUser.email;
				localStorage.setItem("user", user.email);
				window.location.href = "create.html";
				// ...
			})
			.catch((error) => {
				var errorCode = error.code;
				var errorMessage = error.message;
				alert(errorMessage);
				errorField.innerHTML = error;
			});
	};
}

if (adminTableBody) {
	const listAllUsers = (nextPageToken) => {
		auth
		.listUsers(1000, nextPageToken)
		.then((listUsersResult) => {
			listUsersResult.users.forEach((userRecord) => {
				console.log('user', userRecord.toJSON());
			})
			if (listUsersResult.pageToken) {
				listAllUsers(listUsersResult.pageToken)
			}
		})
		.catch((error) => {
			console.log("Error listening users: ", error);
		});
	}
	listAllUsers();
}





