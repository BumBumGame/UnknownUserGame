var glitchTimer = [];
const disableGlitchTimerDebug = false;

function startGlitchTimer(){
  if(!disableGlitchTimerDebug){
  glitchTimer.push(setTimeout(startGlitching, 8000));
 }
}

function abortGlitch(){
 if(!disableGlitchTimerDebug){
  disableGlitchEffect();

  for(var i = 0; i < glitchTimer.length; i++){
    clearTimeout(glitchTimer[i]);
  }

  }
}

function startGlitching(){
  enableGlitchEffect();
  //Set timeout for disablen The option to go back
  glitchTimer.push(setTimeout(disableGoingBackButtons, 5000));
  //Set timeout for displayDisable Animation
  glitchTimer.push(setTimeout(disableDisplayAnimation, 12000));
}

function disableDisplayAnimation(){
  var classNameAddOn = "gameLoginEndGlitch";

  if(mainScreenWindow.className.length == 0){
      classNameAddOn = " " + classNameAddOn;
  }

  mainScreenWindow.className += classNameAddOn;

  //Add event listener for Animation end
  mainScreenWindow.addEventListener("animationend", () => {
    mainScreenWindow.style.display = "none";

    //run after displayDisabled code
    afterDisplayDisabled();
   }
  )
}

function afterDisplayDisabled(){
    //load starting Animation console after short delay
    setTimeout(function () {
      location.href = "console/basicSystemConsole.html"; //Go to console with right get parameter
    }, 400);
}

function addErrorTextToPage(textCount, intervalTime){
   var currentIntervalTime = intervalTime;

   for(var i = 0; i < textCount; i++){
      setTimeout(function () {
        var domTable = document.getElementById("loadingTextTable");

        var newLine = document.createElement("tr");

        var firstNewTd = document.createElement("td");
        var secondNewId = document.createElement("td");

        newLine.className = "errorLine";

        secondNewId.textContent = "Error";

        newLine.append(firstNewTd);
        newLine.append(secondNewId);

        domTable.append(newLine);

      }, currentIntervalTime);

      currentIntervalTime += intervalTime;
   }

}

function disableGoingBackButtons(){
  goBackFromNewGameButton.removeEventListener("click", abortGlitch);
  goBackFromNewGameButton.removeEventListener("click", transitionFromNewGamePageToMainPage);
  window.removeEventListener("popstate", onUrlChange);

  //Start Error Animation
  addErrorTextToPage(3, 2000);
}

goToNewGameButton.addEventListener("click", startGlitchTimer);
goBackFromNewGameButton.addEventListener("click", abortGlitch);
