//important Vars
var optionsSection = document.getElementById("optionsSection");
var mainPageButtons = document.getElementById("firstButtons");
var loginForm = document.getElementById("gameLoginForm");
var newGameLoadingPage = document.getElementById("newLoadingPage");

//Button vars
var goToLoginButton = document.getElementById("goToLoginButton");
var goBackFromLoginButton = document.getElementById("goToMainPageFromLoginButton");
var goToNewGameButton = document.getElementById("goToNewGameButton");
var goBackFromNewGameButton = document.getElementById("goToMainPageFromNewGameButton");

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
function transitionFromGameLoginToMainPage(){
	optionsSection.style.marginLeft = "100%";
	
	setTimeout(function () {
	loginForm.style.display = "none";
	mainPageButtons.style.display = "block";
	optionsSection.removeAttribute("style");	
	}, animationTiming);
	
}

function transitionFromMainPageToNewGamePage(){
	optionsSection.style.marginLeft = "100%";
	
	setTimeout(function () {
	mainPageButtons.style.display = "none";
	newGameLoadingPage.style.display = "block";
	optionsSection.removeAttribute("style");	
	}, animationTiming);
}

function transitionFromNewGamePageToNewGamePage(){
	optionsSection.style.marginLeft = "100%";
	
	setTimeout(function () {
	newGameLoadingPage.style.display = "none";
	mainPageButtons.style.display = "block";
	optionsSection.removeAttribute("style");	
	}, animationTiming);
}

goToLoginButton.addEventListener("click", transitionFromMainPageToGameLogin);
goBackFromLoginButton.addEventListener("click", transitionFromGameLoginToMainPage);
goToNewGameButton.addEventListener("click", transitionFromMainPageToNewGamePage);
goBackFromNewGameButton.addEventListener("click", transitionFromNewGamePageToNewGamePage);