function startNewGame(){
   disableCommandInput()
   var loadingQue = consoleLoadingAnimation();

   var cueCheckInterval = setInterval(function () {
      if(!loadingQue.queCurrentlyRunning){
       //Init Console Input

       //Print a few break
       consoleLog.append(document.createElement("br"));
       //-----

       initConsoleConfirmInput();
       clearInterval(cueCheckInterval);
      }
   }, 50);
}

//loading Animation Method
function consoleLoadingAnimation(){
  var typingAnimationSpeed = 100;
  //Define ques and animations
  var loadingAnimationQue = new AnimationQueue();
  //var loadingAnimationQue = new AnimationQueue();
  var failSafeStartAnimation = new ConsoleTextLoadingAnimationTyping(4000, 230, "Starting Failsafe", 4, true, typingAnimationSpeed);
  //Completion Text animation
  var partiallyCompleteFailsafeText = "Failsafe started.";
  var failSafePartiallyCompleteAnimation = new ConsoleTextTypingAnimation(typingAnimationSpeed, partiallyCompleteFailsafeText);
  //Create Emoty line
  var emptyLineAnimation = new ConsoleLinePrint(0, [""]);
  //Found BackupFile Animation
  var foundBackupFileText = "Found 1 Backupfile.";
  var foundBackupFileAnimation = new ConsoleTextTypingAnimation(typingAnimationSpeed, foundBackupFileText);
  //Checking file signature Animation
  var checkingSignatureAnimation = new ConsoleTextLoadingAnimationTyping(4000, 230, "Checking File signature", 4, true, typingAnimationSpeed);
  //Second Empty lien animaiton
  var secondEmptyLine = new ConsoleLinePrint(0, [""]);
  //File signature invalid Error Animation
  var signatureInvalidText = "Warning: File signaure invalid! It is not recommended to run this file!";
  var signatureInvalidAnimation = new ConsoleTextTypingAnimation(typingAnimationSpeed, signatureInvalidText);
  //Third EmptyLine
  var thirdEmptyLine = new ConsoleLinePrint(0, [""]);
  //Load this file? Question
  var loadFileQuestionText = "Do you want to load this file anyway? (Y/N)";
  var loadFileQuestionAnimation = new ConsoleTextTypingAnimation(typingAnimationSpeed, loadFileQuestionText);

  //Add Animations to que
  loadingAnimationQue.addAnimation(failSafeStartAnimation, 2000);
  loadingAnimationQue.addAnimation(failSafePartiallyCompleteAnimation);
  loadingAnimationQue.addAnimation(emptyLineAnimation);
  loadingAnimationQue.addAnimation(foundBackupFileAnimation, 500);
  loadingAnimationQue.addAnimation(checkingSignatureAnimation, 150);
  loadingAnimationQue.addAnimation(secondEmptyLine);
  loadingAnimationQue.addAnimation(signatureInvalidAnimation, 150);
  loadingAnimationQue.addAnimation(thirdEmptyLine);
  loadingAnimationQue.addAnimation(loadFileQuestionAnimation, 150);
  //Start animationQue
  loadingAnimationQue.start();
  //Return loadingQue
  return loadingAnimationQue;
}

function printConsoleCopyright(){
  printOnConsole("\u00A9 2015 BumBumGame Corp.");
  printOnConsole("Alle Rechte vorbehalten");
  printOnConsole(""); //EmptyLine
  printOnConsole("Für eine Liste an Befehlen schreiben sie [help]");
  printOnConsole(""); //EmptyLine
}

function initConsoleConfirmInput(){
  localCommands.addCommand("Y", "Confirm the Question", confirmFirst);
  localCommands.addCommand("N", "Decline the Question", declineConfirm);

  setInputToAutoExecution();
  setCommandsTillInputDeactivation(1);
  enableCommandInput();
}

function confirmFirst(command){
  //start resseting console animation
  var resetingAnimation = new ConsoleTextLoadingAnimationTyping(1100, 200, "Rebooting", 3, true, 100);

  //Start reseting Animation
  resetingAnimation.start();

 //Wait till animation is finished
  var rebootingAnimationInterval = setInterval(
    function() {
      if(!resetingAnimation.animationRunningStatus){
          clearInterval(rebootingAnimationInterval);
          //clear console
          clearCommandLog();
      }

    }, 10);
}

function declineConfirm(command){
  //starting canceling animation and returning back to Main menu
  var cancelingAnimation = new ConsoleTextLoadingAnimationTyping(1100, 200, "Canceling Request", 3, true, 100);

  //Start cancelling Animation
  cancelingAnimation.start();

  //Wait till animation is finished
  var cancelingInterval = setInterval(
    function () {

        if(!cancelingAnimation.animationRunningStatus){
          clearInterval(cancelingInterval);
          //clear Console
          clearCommandLog();
          //Go back to start page with slight timeout
          setTimeout(function () {
            location.href = "../index.html?startPage=MainPage";
          }, 1000);
        }

    }, 10);

}

startNewGame();
