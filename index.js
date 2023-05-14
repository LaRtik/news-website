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
var topArticles = document.getElementsByClassName('column_blocks');

// get topic
var topic = document.getElementById('article-id');
var bestArticle;

const fadeOut = (el) => {
	el.style.opacity = 1;
	el.style.transition = `opacity ${500}ms`;
	el.style.opacity = 0;

	setTimeout(() => {
		el.style.display = 'none';
	}, 500);
};

function load() {
	if (topArticles) {
		console.log("Started loading")
		const postsRef = db.collection("posts");

		function que(sortBy) {
			var query;
			if (topic.innerText !== "ID") {
				query = postsRef.where("topic", "==", topic.innerText).orderBy(sortBy);
				const articleTopicId = document.getElementById(id = `${topic.innerText}-id`);
				articleTopicId.style.fontWeight = 'bold';
			}
			else query = postsRef.orderBy(sortBy);

			console.log(query);

			query
				.get()
				.then((querySnapshot) => {
					for (let i = querySnapshot.docs.length - 1; i >= Math.max(0, querySnapshot.docs.length - 4); i--) {
						// console.log(i);
						var doc = querySnapshot.docs[i];
						var ahref = document.createElement("a");
						ahref.href = "article/" + doc.id;
						if (!bestArticle) bestArticle = doc.id;
						var article = document.createElement("article");
						var articlePicture = document.createElement("img");
						var articleTime = document.createElement("small");
						articleTime.className = "article-date";
						var articleName;
						if (sortBy == "views" && i == querySnapshot.docs.length - 1) articleName = document.createElement("h1");
						else articleName = document.createElement("h3");
				
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

						if (sortBy == "views" && i == querySnapshot.docs.length - 1) article.appendChild(articlePicture);
						article.appendChild(articleName);
						article.appendChild(articleTime);
						article.appendChild(articleBody);
						ahref.appendChild(article);
						if ((sortBy == "views" && i == querySnapshot.docs.length - 1) || sortBy == "timestamp") articles[0].appendChild(ahref);
						else topArticles[0].appendChild(ahref);
					};
					if (sortBy == "timestamp") fadeOut(document.getElementsByClassName("se-pre-con")[0]);
					else {
						const recentNews = document.createElement('h1');
						recentNews.textContent = 'Недавние новости';
						recentNews.style.paddingLeft = '20px';
						recentNews.style.paddingTop = '100px';
						articles[0].appendChild(recentNews);
					}
				})
		}
		que("views");
		que("timestamp");
		
		const apikey = "a9739ef3e07f9ff117929e20cf0a343c";
		const lat = "53.88";
		const lon = "27.52";
		fetch(`http://api.weatherapi.com/v1/current.json?key=4179ef8802d74aeaa8593805231405&q=Minsk`)
		.then(response => response.json())
 		.then(data => {
			console.log(data);
			const ahref = document.createElement("a");
			const forecast = document.getElementById("forecast");
			ahref.href = "https://yandex.by/pogoda/minsk?lat=53.902735&lon=27.555691";
			var nameval = data.location.name;
			forecast.appendChild(ahref);
            //var descrip = data['weather']['0']['description'];
            var temperature = data.current.temp_c;
            //var wndspd = data['wind']['speed'];
			if (!nameval || !temperature) return;
			
			console.log(forecast);
			ahref.innerHTML += `${nameval} ${temperature}°C `;

			const image = document.createElement("img");
			image.src = data.current.condition.icon;
			ahref.appendChild(image);
			//forecast.innerHTML += wndspd;
		})		
	}
}

load();




