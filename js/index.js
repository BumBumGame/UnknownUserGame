//important Vars
var optionsSection = document.getElementById("optionsSection");
var mainPageButtons = document.getElementById("firstButtons");
var loginForm = document.getElementById("gameLoginForm");

//Button vars
var goToLoginButton = document.getElementById("goToLoginButton");
var goBackFromLoginButton = document.getElementById("goToMainPageFromLoginButton");

var animationTiming = 900; //in ms (transition time + 100ms)

//Switches From Main Page To Loginpage with an Animation
function transitionFromMainPageToGameLogin(){
	optionsSection.style.marginLeft = "100%"; 
	
	setTimeout(function () {
	mainPageButtons.style.display = "none";
	loginForm.style.display = "block";
	optionsSection.removeAttribute("style");	
	}, animationTiming);
}

//Switches from LoginPage to MainPage with an animation
function transitionFromGameToLoginMainPage(){
	optionsSection.style.marginLeft = "100%";
	
	setTimeout(function () {
	loginForm.style.display = "none";
	mainPageButtons.style.display = "block";
	optionsSection.removeAttribute("style");	
	}, animationTiming);
	
}

goToLoginButton.addEventListener("click", transitionFromMainPageToGameLogin);
goBackFromLoginButton.addEventListener("click", transitionFromGameToLoginMainPage);