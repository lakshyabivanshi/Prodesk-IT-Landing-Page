const themeBtn = document.getElementById("theme-btn");
const mobileMenu = document.getElementById("mobile-menu");
const hamburgerBtn = document.getElementById("hamburger-btn");
const html = document.documentElement;

if(localStorage.getItem("theme")==="dark"){
    html.classList.add("dark");
}

themeBtn.addEventListener("click", ()=> {
    html.classList.toggle("dark");

if(html.classList.contains("dark")){
    localStorage.setItem("theme", "dark");
}
else{
    localStorage.setItem("theme", "light");
}
});

//Hamburger Menu
hamburgerBtn.addEventListener("click", () =>{
    mobileMenu.classList.toggle("hidden");
});