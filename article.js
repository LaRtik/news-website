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

var editArticleButton = document.getElementById("edit-button");
var deleteArticleButton = document.getElementById("delete-button");

const fadeOut = (el) => {
	el.style.opacity = 1;
	el.style.transition = `opacity ${500}ms`;
	el.style.opacity = 0;
  
	setTimeout(() => {
	  el.style.display = 'none';
	}, 500);
  };

if (articleContainer) {

	var articleID = document.getElementById('article-id').innerText;

	async function getUserIP() {
		try {
			const response = await fetch('https://api.ipify.org?format=json');
			const data = await response.json();
			console.log('User IP Address:', data.ip);
			return data.ip;
		} catch (error) {
			console.error('Error fetching IP:', error);
		}
	}


	if (editArticleButton) {
		editArticleButton.addEventListener("click", function () {
			window.location.href = `../create?id=${articleID}`;
		})
	}

	
	const query = db.collection('posts').doc(articleID);

	if (deleteArticleButton) {
		deleteArticleButton.addEventListener("click", function () {
			let confirm = window.confirm("Do you really want to delete the article?");
        if (confirm) {
			query
			.delete()
			.then(() => {
				alert("Article was succesfully deleted. Bye =(");
				windows.localion.href = "";
			})
			.catch((error) => {
				alert("Error detected while deleting the article. Check the console");
				console.log(error);
			})
		};
		})
	}

	query
	.get()
		.then((doc) => {
			if (!doc.exists) {
				articleContainer[0].innerHTML = "<h2>Article not found</h2>";
				fadeOut(document.getElementsByClassName("se-pre-con")[0]);
				return;
			}
			getUserIP()
			.then((ip) => {
				if (!ip) {
					console.log("Failed to load user IP");
				}
				else if (!doc.data().ips.includes(ip)) db.runTransaction(transaction => {
					// This code may get re-run multiple times if there are conflicts.
					return transaction.get(query).then(doc => {
						if (!doc.data().ips) {
							console.log(firebase.firestore.FieldValue)
							transaction.set({
								ips: []
							}, {merge : true});
						} else if (!doc.data().ips.includes(ip)) {
							const views = doc.data().views + 1 ? doc.data().views : 1;
							console.log(views);
							console.log(ip);
							//ips.push(ip);
							transaction.update(query, { ips: firebase.firestore.FieldValue.arrayUnion(ip), views: views });
						}
					});
				}).then(function () {
					console.log("Transaction successfully committed!");
				}).catch(function (error) {
					console.log("Transaction failed: ", error);
				});
			});
			
			
			if (localStorage.getItem("login") === doc.data().author || localStorage.getItem("admin") == "true") {
				editArticleButton.style.display = "block";
				deleteArticleButton.style.display = "block";
			} 

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
			fadeOut(document.getElementsByClassName("se-pre-con")[0]);

		});
}
