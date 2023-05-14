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


// create.html
var createArticle = document.getElementById('create-article-form');
var createArticleText = document.getElementById('html-output');
var createArticleTopic = document.getElementById('topic-selector');
var createArticleTitle = document.getElementById('article-name');
var createArticleButton = document.getElementById('submit-button');

const fadeOut = (el) => {
	el.style.opacity = 1;
	el.style.transition = `opacity ${500}ms`;
	el.style.opacity = 0;
  
	setTimeout(() => {
	  el.style.display = 'none';
	}, 500);
  };

function writeNewArticle(topic, title, body) {
	var postData = {
		topic: topic,
		body: body,
		title: title,
		timestamp: firebase.firestore.FieldValue.serverTimestamp(),
		author: localStorage.getItem("login"),
		ips: [],
		views: 0,
	};

	console.log(postData.timestamp);

	if (body.match(/<img src="(.+)">/)) {

		db.collection('posts').add(postData).then((docRef) => {
			console.log('Post added with ID: ', docRef.id);
			alert("Post was succesfully posted!");
			window.location.href = "article/" + docRef.id
		})
			.catch((error) => {
				console.error("Error adding post: ", error);
			});
	}
	else {
		alert("Error: There is no image in your article.");
		return;
	}
}

if (createArticle) {
	if (!localStorage.getItem("login")) {
		createArticle.innerHTML = "<h2>Page is not available</h2>";
	} else {


		db.collection("users")
			.doc(localStorage.getItem("login"))
			.get()
			.then((user) => {
				console.log(user.data().permissions);
				for (let i = 0; i < user.data().permissions.length; i++) {
					console.log(user.data().permissions[i]);
					var topicChoiseForAuthor = document.getElementById(id = `select-topic${i + 1}`);
					if (user.data().permissions[i] === '0') {
						topicChoiseForAuthor.style.display = "none";
					} else {
						topicChoiseForAuthor.style.display = "block";
					}
				}
				fadeOut(document.getElementsByClassName("se-pre-con")[0]);
			}
			)

		var url = window.location.search;
		var id = new URLSearchParams(url);
		if (id.length != 0) id = id.get("id");
		console.log(id);

		if (id) {
			db.collection("posts")
				.doc(id)
				.get()
				.then((doc) => {
					if (!doc.exists) {
						if (!id) window.location.href = "create";
						return;
					}

					createArticleTopic.value = doc.data().topic;
					document.getElementsByClassName("pell-content")[0].innerHTML = doc.data().body;
					document.getElementById('text-output').innerHTML = doc.data().body;
					createArticleText.innerHTML = doc.data().body;
					createArticleTitle.value = doc.data().title;
					fadeOut(document.getElementsByClassName("se-pre-con")[0]);
				})
		}
	}

	createArticle.onsubmit = function (e) {
		e.preventDefault();
		var topic = createArticleTopic.value;
		var text = createArticleText.value;
		var title = createArticleTitle.value;
		var url = window.location.search;
		var id = new URLSearchParams(url);
		if (id.length != 0) id = id.get("id");

		if (title.length > 80) {
			alert("Title length can not more then 80 symbols");
			return;
		}

		console.log(id);

		if (id) {
			if (!text.match(/<img src="(.+)">/)) {
				alert("Error: There is no image in your article.");
				return;
			}
			db.collection("posts")
				.doc(id)
				.update({
					topic: topic,
					body: text,
					title: title,
				}).then(() => {
					console.log('Post updated with ID: ', id);
					alert("Post was succesfully updated!");
					window.location.href = "article/" + id;
					fadeOut(document.getElementsByClassName("se-pre-con")[0]);
					return;
				}).catch((error) => {
					console.error("Error adding post: ", error);
				});
		}
		else writeNewArticle(topic, title, text);
	}
}

window.onload = function() {
	fadeOut(document.getElementsByClassName("se-pre-con")[0]);
}