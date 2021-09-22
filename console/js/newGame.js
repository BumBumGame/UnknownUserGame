function startNewGame(){
   mainConsoleObject.disableCommandInput()
   var loadingQue = consoleLoadingAnimation();

   var cueCheckInterval = setInterval(function () {
      if(!loadingQue.queCurrentlyRunning){
       //Init Console Input

       //Print a few break
       mainConsoleObject.consoleLogObject.append(document.createElement("br"));
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
  var failSafeStartAnimation = new ConsoleTextLoadingAnimationTyping(4000, 230, "Starting Failsafe", 4, true, typingAnimationSpeed, mainConsoleObject);
  //Completion Text animation
  var partiallyCompleteFailsafeText = "Failsafe started.";
  var failSafePartiallyCompleteAnimation = new ConsoleTextTypingAnimation(typingAnimationSpeed, partiallyCompleteFailsafeText, mainConsoleObject);
  //Create Emoty line
  var emptyLineAnimation = new ConsoleLinePrint(0, [""], mainConsoleObject);
  //Found BackupFile Animation
  var foundBackupFileText = "Found 1 Backupfile.";
  var foundBackupFileAnimation = new ConsoleTextTypingAnimation(typingAnimationSpeed, foundBackupFileText, mainConsoleObject);
  //Checking file signature Animation
  var checkingSignatureAnimation = new ConsoleTextLoadingAnimationTyping(4000, 230, "Checking File signature", 4, true, typingAnimationSpeed, mainConsoleObject);
  //Second Empty lien animaiton
  var secondEmptyLine = new ConsoleLinePrint(0, [""], mainConsoleObject);
  //File signature invalid Error Animation
  var signatureInvalidText = "Warning: File signaure invalid! It is not recommended to run this file!";
  var signatureInvalidAnimation = new ConsoleTextTypingAnimation(typingAnimationSpeed, signatureInvalidText, mainConsoleObject);
  //Third EmptyLine
  var thirdEmptyLine = new ConsoleLinePrint(0, [""], mainConsoleObject);
  //Load this file? Question
  var loadFileQuestionText = "Do you want to load this file anyway? (Y/N)";
  var loadFileQuestionAnimation = new ConsoleTextTypingAnimation(typingAnimationSpeed, loadFileQuestionText, mainConsoleObject);

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

function getLoadingFileAnimationQue(){
   var standardTypingAnimaitonSpeed = 100;
   //AnimationQue
   var loadingFileAnimationQue = new AnimationQueue();
   //Loading Animation

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

  mainConsoleObject.setInputToAutoExecution();
  mainConsoleObject.setCommandsTillInputDeactivation(1);
  mainConsoleObject.enableCommandInput();
}

//Function to reset ConfirmInput
function resetConfirmInput(){
  //Reset input to manual
  mainConsoleObject.disableInputAutoExectution();
  //Clear added Commands
  localCommands.clearAllCommands();
}

function confirmFirst(command){
  //Reset input
  resetConfirmInput();
  //start resseting console animation
  var resetingAnimation = new ConsoleTextLoadingAnimationTyping(1100, 200, "Rebooting", 3, true, 100, mainConsoleObject);

  //Start reseting Animation
  resetingAnimation.start();

 //Wait till animation is finished
  var rebootingAnimationInterval = setInterval(
    function() {
      if(!resetingAnimation.animationRunningStatus){
          clearInterval(rebootingAnimationInterval);
          //clear console
          mainConsoleObject.clearCommandLog();
      }

    }, 10);
}

function declineConfirm(command){
  //Reset input
  resetConfirmInput();
  //starting canceling animation and returning back to Main menu
  var cancelingAnimation = new ConsoleTextLoadingAnimationTyping(1100, 200, "Canceling Request", 3, true, 100, mainConsoleObject);

  //Start cancelling Animation
  cancelingAnimation.start();

  //Wait till animation is finished
  var cancelingInterval = setInterval(
    function () {

        if(!cancelingAnimation.animationRunningStatus){
          clearInterval(cancelingInterval);
          //clear Console
          mainConsoleObject.clearCommandLog();
          //Go back to start page with slight timeout
          setTimeout(function () {
            location.href = "../index.html?startPage=MainPage";
          }, 1000);
        }

    }, 10);

}

startNewGame();
