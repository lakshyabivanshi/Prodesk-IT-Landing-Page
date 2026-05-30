const hamburger = document.querySelector(".hamburger");

const navbarLinks = document.querySelector(".navbar-links");

const modebtn = document.getElementById("mode-btn");

const modeicon = document.getElementById("mode-icon");


hamburger.addEventListener("click", ()=>{
    navbarLinks.classList.toggle("show");
});


//Check saved mode when page loads

if(localStorage.getItem("theme")==="dark"){
    document.body.classList.add("dark");
    modeicon.src = "assets/sun.svg";
}
else{
    modeicon.src = "assets/moon.svg";
}
modebtn.addEventListener("click", ()=>{
    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        modeicon.src = "assets/sun.svg";
        localStorage.setItem("theme", "dark");
    }
    else{
        modeicon.src = "assets/moon.svg";
        localStorage.setItem("theme", "light");

    }
});