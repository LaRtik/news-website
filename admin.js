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
const fadeOut = (el) => {
	el.style.opacity = 1;
	el.style.transition = `opacity ${500}ms`;
	el.style.opacity = 0;
  
	setTimeout(() => {
	  el.style.display = 'none';
	}, 500);
  };

// admin.html
var adminTable = document.getElementById('admin-table');
var adminTableForm = document.getElementById('admin-table-form');


if (adminTable) {
    var savedUsers = {}

    if (localStorage.getItem("admin") === "true") {
        // editorFeatures.style.display = "block";
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
                        if (permissions[i] === '1') cell.innerHTML = `<input type="checkbox" id = "${doc.id}-${i}" checked></td>`;
                        else cell.innerHTML = `<input type="checkbox" id = "${doc.id}-${i}"></td>`;
                    }
                    // doc.data() is never undefined for query doc snapshots
                    //console.log(doc.id);
                    savedUsers[doc.id] = permissions;
                });
				fadeOut(document.getElementsByClassName("se-pre-con")[0]);
            })
            .catch((error) => {
                console.log("Error getting users: ", error);
            });
    }
    else {
        //TODO
        // editorFeatures.style.display = "none";
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
		fadeOut(document.getElementsByClassName("se-pre-con")[0]);
        window.location.reload();
    }
}