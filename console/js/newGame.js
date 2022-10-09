//create console

//Console log object
const consoleLog = document.getElementById("consoleLog");
//Console input Object
const consoleInput = document.getElementById("mainConsoleInput");
//CommandLine Object
const commandLine = document.getElementById("commandLine");

//Attach functionality Object to console-----------------------------------------
const mainConsoleObject = new InGameConsole(consoleLog, consoleInput, commandLine, localCommands);
//-------------------------------------------------------------------------------


function startNewGame(){
   mainConsoleObject.disableCommandInput()
   let loadingQue = consoleLoadingAnimation();

   let cueCheckInterval = setInterval(function () {
      if(!loadingQue.queCurrentlyRunning){
       //Init Console Input

       //Print a break
       mainConsoleObject.consoleLogObject.append(document.createElement("br"));
       //-----

       initConsoleConfirmInput();
       clearInterval(cueCheckInterval);
      }
   }, 50);
}

//loading Animation Method
function consoleLoadingAnimation(){
  let typingAnimationSpeed = 100;
  //Define ques and animations
  let loadingAnimationQue = new ConsoleAnimationQueue();
  //var loadingAnimationQue = new AnimationQueue();
  let failSafeStartAnimation = new ConsoleTextLoadingAnimationTyping(4000, 230, "Starting Failsafe", 4, true, typingAnimationSpeed, mainConsoleObject);
  //Completion Text animation
  let partiallyCompleteFailsafeText = "Failsafe started.";
  let failSafePartiallyCompleteAnimation = new ConsoleTextTypingAnimation(typingAnimationSpeed, partiallyCompleteFailsafeText, mainConsoleObject);
  //Create Emoty line
  let emptyLineAnimation = new ConsoleLinePrint(0, [""], mainConsoleObject);
  //Found BackupFile Animation
  let foundBackupFileText = "Found 1 Backupfile.";
  let foundBackupFileAnimation = new ConsoleTextTypingAnimation(typingAnimationSpeed, foundBackupFileText, mainConsoleObject);
  //Checking file signature Animation
  let checkingSignatureAnimation = new ConsoleTextLoadingAnimationTyping(4000, 230, "Checking File signature", 4, true, typingAnimationSpeed, mainConsoleObject);
  //Second Empty lien animaiton
  let secondEmptyLine = new ConsoleLinePrint(0, [""], mainConsoleObject);
  //File signature invalid Error Animation
  let signatureInvalidText = "Warning: File signaure invalid! It is not recommended to run this file!";
  let signatureInvalidAnimation = new ConsoleTextTypingAnimation(typingAnimationSpeed, signatureInvalidText, mainConsoleObject);
  //Third EmptyLine
  let thirdEmptyLine = new ConsoleLinePrint(0, [""], mainConsoleObject);
  //Load this file? Question
  let loadFileQuestionText = "Do you want to load this file anyway? (Y/N)";
  let loadFileQuestionAnimation = new ConsoleTextTypingAnimation(typingAnimationSpeed, loadFileQuestionText, mainConsoleObject);

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
  localCommands.addCommand("N", "Decline the Question", declineConfirmFirst);

  mainConsoleObject.setInputToAutoExecution();
  mainConsoleObject.setCommandsTillInputDeactivation(1);
  mainConsoleObject.enableCommandInput();
}

//Function to reset ConfirmInput
function resetConfirmInput(){
  //Reset input to manual
  mainConsoleObject.disableInputAutoExecution();
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
          //Start loadingFile Animation (with 1 sec delay)
          setTimeout(loadFileAnimation, 5);
      }

    }, 10);
}

function declineConfirmFirst(command){
  //Reset input
  resetConfirmInput();
  //starting canceling animation and returning back to Main menu
  let cancelingAnimation = new ConsoleTextLoadingAnimationTyping(1100, 200, "Canceling Request", 3, true, 100, mainConsoleObject);

  //Start cancelling Animation
  cancelingAnimation.start();

  //Wait till animation is finished
  let cancelingInterval = setInterval(
    function () {

        if(!cancelingAnimation.animationRunningStatus){
          clearInterval(cancelingInterval);
          //clear Console
          mainConsoleObject.clearCommandLog();
          //Go back to start page with slight timeout
          setTimeout(function () {
            location.href = "../index.html?startPage=MainPage";
          }, 800);
        }

    }, 10);

}

function createLoadFileAnimationQue(){
  //init que
  let typingAnimationSpeed = 100;
  //Define ques and animations
  let loadingAnimationQue = new ConsoleAnimationQueue();
  //create animations

  let loadingFileTextAnimation;
  let loadingImageFileAnimation;

  //Loading file instruction
  {
  let loadingFileText = "Loading File:";
  loadingFileTextAnimation = new ConsoleTextTypingAnimation(typingAnimationSpeed, loadingFileText, mainConsoleObject);
  }

  //Create Emoty line
  let emptyLineAnimation = new ConsoleLinePrint(1, [""], mainConsoleObject);

  //File loadBar
  {
  let filename = "MT4.img";
  loadingImageFileAnimation = new ProgressBarLoadingAnimation(4000, 0, 100, 50, '=', ' ', true, "Successfull", "", 1, filename, mainConsoleObject)
  }

  //add Animation to Que
  loadingAnimationQue.addAnimation(loadingFileTextAnimation, 2000);
  loadingAnimationQue.addAnimation(emptyLineAnimation);
  loadingAnimationQue.addAnimation(loadingImageFileAnimation, 500);

  {
  //Introtext (as Array)
  let introTextArray = [" ", //Empty line has to have at least one character
                        "[Server Log]",
                        " ",
                        "Verbindung zum Servernetzwerk verloren.",
                        "Noch Funktionsfähige Verbindungsstationen: 3",
                        "Code 451 aktiv.",
                        "Alle physikalischen Zugänge wurden versiegelt.",
                        "Projekt S.T.A.N Status: Inaktiv",
                        "Notfall Reset Codes gesendet.",
                        " ",
                        "Drücken sie irgendeine Taste, um fortzufahren..."];

  //transform intro textArray into animations
   for(let i = 0; i < introTextArray.length; i++){
     if(i == 0){
      loadingAnimationQue.addAnimation(new ConsoleTextTypingAnimation(introTextArray[i].length * 22, introTextArray[i], mainConsoleObject), 500);
    }else{
      loadingAnimationQue.addAnimation(new ConsoleTextTypingAnimation(introTextArray[i].length * 22, introTextArray[i], mainConsoleObject), introTextArray[i-1].length * 26);
    }
   }

  }

  //Return animation que
  return loadingAnimationQue;
}

function loadFileAnimation(){
    //Create animation Que
    let loadFileAnimationQue = createLoadFileAnimationQue();
    loadFileAnimationQue.start();

    let cueCheckInterval = setInterval(function () {
       if(!loadFileAnimationQue.queCurrentlyRunning){

        //Set an Eventlistener for any button
        window.addEventListener("keydown", anyKeyPressedForThirdStage);

        clearInterval(cueCheckInterval);
       }
     }, 50);

}

function anyKeyPressedForThirdStage(){
  //Remove Event Listener
  window.removeEventListener("keydown", anyKeyPressedForThirdStage);
  //Clear console
  mainConsoleObject.clearCommandLog();
//TODO WRITE next step here
//TODO Next step: Write messagerClient
}

window.addEventListener("load", startNewGame);

//mainConsoleObject.disableCommandInput();
//window.addEventListener("load", loadFileAnimation);
