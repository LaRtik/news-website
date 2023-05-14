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

                }
            )
    }

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
    }
}