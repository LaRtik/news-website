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

var articleContainer = document.getElementsByClassName('article-container')

var editArticleButton = document.getElementById("edit-button")

if (articleContainer) {
	var articleID = document.getElementById('article-id').innerText;
	if (editArticleButton) {
		editArticleButton.addEventListener("click", function() {
			window.location.href = `../create?id=${articleID}`;
		})
	}

	db.collection('posts')
		.doc(articleID)
		.get()
		.then((doc) => {
			if (!doc.exists) {
				articleContainer[0].innerHTML = "<h2>Article not found</h2>";
				return;
			}

			if (localStorage.getItem("login") != doc.data().author && localStorage.getItem("admin") != "true") editArticleButton.style.display = "none";

			const articleText = document.createElement("div");
			articleText.innerHTML = doc.data().body;

			const articleName = document.createElement("h1");
			articleName.innerText = doc.data().title;
			articleContainer[0].appendChild(articleName);

			const articleDate = document.createElement("small");
			const date = new Date(doc.data().timestamp.toDate());
			const formattedDate = date.toLocaleString();
			articleDate.innerText = formattedDate;
			articleDate.className = "article-date";
			articleContainer[0].appendChild(articleDate);

			articleContainer[0].appendChild(articleText);

		});



}