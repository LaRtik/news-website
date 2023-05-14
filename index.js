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


// index
var articles = document.getElementsByClassName('big_blocks');

// get topic
var topic = document.getElementById('article-id');



if (articles) {
	const postsRef = db.collection("posts");
	var query;
	if (topic.innerText !== "ID") {
		query = postsRef.where("topic", "==", topic.innerText).orderBy("timestamp");
		const articleTopicId = document.getElementById(id = `${topic.innerText}-id`);
		articleTopicId.style.fontWeight = 'bold';
	}
	else query = postsRef.orderBy("timestamp");

	query
		.get()
		.then((querySnapshot) => {
			for (let i = querySnapshot.docs.length - 1; i >= querySnapshot.docs.length - 4; i--) {
				// console.log(i);
				var doc = querySnapshot.docs[i];
				var ahref = document.createElement("a");
				ahref.href = "article/" + doc.id;
				var article = document.createElement("article");
				var articlePicture = document.createElement("img");
				var articleTime = document.createElement("p");
				var articleName = document.createElement("h1");
				var articleBody = document.createElement("p");
				//Data
				const date = doc.data().timestamp.toDate();
				const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
				articleTime.innerText = formattedDate;
				//Title
				articleName.innerText = doc.data().title;

				//Picture+Body
				var indexOfPicture = doc.data().body.match(/<img src="(.+)">/);
				articleBody.innerText = doc.data().body.replace(/<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g, '').slice(0, 80) + "...";
				articlePicture.src = indexOfPicture[1];

				article.appendChild(articlePicture);
				article.appendChild(articleTime);
				article.appendChild(articleName);
				article.appendChild(articleBody);
				ahref.appendChild(article);
				articles[0].appendChild(ahref);
			};
		})
	const recentNews = document.createElement('h1');
	recentNews.textContent = 'Недавние новости';
	recentNews.style.paddingLeft = '20px';
	articles[0].appendChild(recentNews);
}