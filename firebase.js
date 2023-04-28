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


var createArticle = document.getElementById('create-article-form');
var createArticleText = document.getElementById('html-output');
var createArticleTitle = document.getElementById('topic-selector');
var createArticleButton = document.getElementById('submit-button');

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