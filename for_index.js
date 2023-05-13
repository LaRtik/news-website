
const menubtn = document.querySelector('.menu-btn');
const closemenubtn = document.querySelector('.close-menu-btn');
const navbar = document.getElementById("nav-bar");


menubtn.addEventListener("click", function () {
    if (menubtn.className !== "")
    {
        menubtn.style.display = "none";
        closemenubtn.style.display = "block";
        navbar.classList.add("show-nav");
    }
});


closemenubtn.addEventListener("click", function () {
    if (closemenubtn.className !== "")
    {
        closemenubtn.style.display = "none";
        menubtn.style.display = "block";
        navbar.classList.remove("show-nav");
    }
});