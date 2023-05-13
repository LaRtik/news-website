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

// login.html
var loginForm = document.getElementById('login-form');
var loginText = document.getElementById('login');
var passwordText = document.getElementById('password');
var errorField = document.getElementById('error-field');

// admin.html
var adminTable = document.getElementById('admin-table');
var adminTableForm = document.getElementById('admin-table-form');

// index
var articles = document.getElementsByClassName('big_blocks');



function writeNewArticle(topic, title, body) {
	var postData = {
		topic: topic,
		body: body,
		title: title,
		timestamp: firebase.firestore.FieldValue.serverTimestamp(),
	};

	console.log(postData.timestamp);

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
		var topic = createArticleTopic.value;
		var text = createArticleText.value;
		var title = createArticleTitle.value;
		if (title.length > 80) {
			alert("Title length can not more then 80 symbols");
			return;
		}
		writeNewArticle(topic, title, text);
	};
}


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
			if (doc.data().password != password) {
				alert("Incorrect password. Please check all the symbols");
				return;
			}
			localStorage.setItem("login", login);
			localStorage.setItem("admin", doc.data().admin);
			localStorage.setItem("permissions", doc.data().permissions);
			//console.log(currentUser);
			alert(`Welcome, ${login}!`);
			window.location.replace("create");
		});
	};
}

if (adminTable) {
	var savedUsers = {}

	if (localStorage.getItem("admin") == "true") {
		db.collection("users")
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					var row = adminTable.insertRow();
					var cell = row.insertCell();
					cell.innerHTML = `<td id="table-username">${doc.id}</td>`;
					var permissions = doc.data().permissions;
					//console.log(permissions);
					for (let i = 0; i < 4; i++) {
						var cell = row.insertCell();
						if (permissions[i] == '1') cell.innerHTML = `<input type="checkbox" id = "${doc.id}-${i}" checked></td>`;
						else cell.innerHTML = `<input type="checkbox" id = "${doc.id}-${i}"></td>`;
					}
					// doc.data() is never undefined for query doc snapshots
					//console.log(doc.id);
					savedUsers[doc.id] = permissions;
				});
			})
			.catch((error) => {
				console.log("Error getting users: ", error);
			});
	}
	else {
		var header = document.getElementById("permissions-header");
		header.innerText = "Page is not available";
		var table = document.getElementById("table-container");
		table.innerHTML = "";
		//table.style.display = "none";
	}




	adminTableForm.onsubmit = async function (e) {
		e.preventDefault();
		var nCells = adminTable.rows.item(0).cells.length;
		var needUpdate = {};

		for (var key in savedUsers) {
			var perms = "";

			for (let j = 1; j < nCells; j++) {
				console.log(document.getElementById(`${key}-${j - 1}`));
				if (document.getElementById(`${key}-${j - 1}`).checked) perms += "1";
				else perms += "0";
			}
			//console.log(perms);

			if (savedUsers[key] != perms) {
				needUpdate[key] = perms
			}
		}

		if (Object.keys(needUpdate).length === 0) {
			alert("There is nothing to update here.");
			return;
		}
		let confirm = window.confirm("Do you really want to update permissions?");
		if (!confirm) window.location.reload();

		// batch is a set of transactions
		var batch = db.batch();

		for (key in needUpdate) {
			batch.update(db.collection("users").doc(key), { permissions: needUpdate[key] })
		}

		await batch.commit();
		window.location.reload();
	}
}

if (articles) {
    db.collection("posts")
        .orderBy("timestamp")
        .get()
        .then((querySnapshot) => {
            for (let i = querySnapshot.docs.length - 1; i >= 0; i--)
            {
                console.log(i);
                var doc = querySnapshot.docs[i];
                var article = document.createElement("article");
				var imageSlider = document.createElement("div");
				imageSlider.className = "image-slider";

				article.appendChild(imageSlider);

                var articlePicture = document.createElement("img");
                var articleTime = document.createElement("small");
                var articleName = document.createElement("h1");
                var articleBody = document.createElement("p");

                // Date
                const date = new Date(doc.data().timestamp.toDate());
				const formattedDate = date.toLocaleString();
                articleTime.innerText = formattedDate;
				articleTime.className = "article-date";

                // Title
                articleName.innerText = doc.data().title;

                // Picture+Body
                var indexOfPicture = doc.data().body.match(/<img src="(.+)">/);
                articleBody.innerText = doc.data().body.replace(/<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g,'').slice(0, 80) + "...";
                articlePicture.src=indexOfPicture[1];

                imageSlider.appendChild(articlePicture);
				imageSlider.appendChild(articleTime);
                imageSlider.appendChild(articleName);
                imageSlider.appendChild(articleBody);
                articles[0].appendChild(article);
            };
        })
}

