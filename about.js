
//about
var listWithLinks = document.getElementById('list-footer');
var editorFeatures = document.getElementById('admin-capabilities');
var createFeatures = document.getElementById('create-capabilities');


if (listWithLinks) {
	if (localStorage.getItem("login")) {
		createFeatures.style.display = "block";
	}

	if (localStorage.getItem("admin") === "true") {
		editorFeatures.style.display = "block";
	}
}

const fadeOut = (el) => {
	el.style.opacity = 1;
	el.style.transition = `opacity ${500}ms`;
	el.style.opacity = 0;
  
	setTimeout(() => {
	  el.style.display = 'none';
	}, 500);
  };

window.onload = function() {
	fadeOut(document.getElementsByClassName("se-pre-con")[0]);
}