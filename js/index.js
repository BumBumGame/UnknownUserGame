//important Vars
var optionsSection = document.getElementById("optionsSection");
var mainPageButtons = document.getElementById("firstButtons");
var loginForm = document.getElementById("gameLoginForm");
var newGameLoadingPage = document.getElementById("newLoadingPage");
var forgotPasswordForm = document.getElementById("forgotPasswordForm");

//Button vars
var goToLoginButton = document.getElementById("goToLoginButton");
var goBackFromLoginButton = document.getElementById("goToMainPageFromLoginButton");
var goToNewGameButton = document.getElementById("goToNewGameButton");
var goBackFromNewGameButton = document.getElementById("goToMainPageFromNewGameButton");
var goToPasswordForgotButton = document.getElementById("goToPasswordForgotButton");
var goBackFromForgotButton = document.getElementById("goBackToLoginFromForgotButton");

var closeTabButton = document.getElementById("closeTabButton");

var animationTiming = 900; //in ms (transition time + 100ms)

//Switches From Main Page To Loginpage with an Animation
function transitionFromMainPageToGameLogin(){
	transitionFromTo(mainPageButtons, loginForm);
}

//Switches from LoginPage to MainPage with an animation
function transitionFromGameLoginToMainPage(){
	transitionFromTo(loginForm, mainPageButtons);
}

function transitionFromMainPageToNewGamePage(){
	transitionFromTo(mainPageButtons, newGameLoadingPage);
}

function transitionFromNewGamePageToMainPage(){
	transitionFromTo(newGameLoadingPage, mainPageButtons);
}

function transitionFromGameLoginToPasswordForgot(){
	transitionFromTo(loginForm, forgotPasswordForm);
}

function transitionFromPasswordForgotToGameLogin(){
	transitionFromTo(forgotPasswordForm, loginForm);
}

function closeTab(){
	if(confirm("Wollen sie diesen Tab wirklich schließen?")){
		window.close();
	}
}

function transitionFromTo(startPage,	 endPage){
	optionsSection.style.marginLeft = "100%";
	
	setTimeout(function () {
	startPage.style.display = "none";
    endPage.style.display = "block";
	optionsSection.removeAttribute("style");	
	}, animationTiming);
}

goToLoginButton.addEventListener("click", transitionFromMainPageToGameLogin);
goBackFromLoginButton.addEventListener("click", transitionFromGameLoginToMainPage);
goToNewGameButton.addEventListener("click", transitionFromMainPageToNewGamePage);
goBackFromNewGameButton.addEventListener("click", transitionFromNewGamePageToMainPage);
goToPasswordForgotButton.addEventListener("click", transitionFromGameLoginToPasswordForgot);
goBackFromForgotButton.addEventListener("click", transitionFromPasswordForgotToGameLogin);
closeTabButton.addEventListener("click", closeTab);