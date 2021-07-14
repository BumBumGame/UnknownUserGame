function startNewGame(){
   disableCommandInput()
   consoleLoadingAnimation();
}
var loadingAnimationQue = new AnimationQueue();
//loading Animation Method
function consoleLoadingAnimation(){
  var typingAnimationSpeed = 100;
  //Define ques and animations
  //var loadingAnimationQue = new AnimationQueue();
  var failSafeStartAnimation = new ConsoleTextLoadingAnimationTyping(4000, 230, "Starting Failsafe", 4, true, typingAnimationSpeed);
  //Completion Text animation
  var partiallyCompleteFailsafeText = "Failsafe started.";
  var failSafePartiallyCompleteAnimation = new ConsoleTextTypingAnimation(typingAnimationSpeed, partiallyCompleteFailsafeText);
  //Found BackupFile Animation
  var foundBackupFileText = "Found 1 Backupfile";
  var foundBackupFileAnimation = new ConsoleTextTypingAnimation(typingAnimationSpeed, foundBackupFileText);
  //Checking file signature Animation
  var checkingSignatureAnimation = new ConsoleTextLoadingAnimationTyping(4000, 230, "Checking File signature", 4, true, typingAnimationSpeed);
  //File signature invalid Error Animation
  var signatureInvalidText = "File signaure invalid! It is not recommended to run this file!";
  var signatureInvalidAnimation = new ConsoleTextTypingAnimation(typingAnimationSpeed, signatureInvalidText);

  //Add Animations to que
  loadingAnimationQue.addAnimation(failSafeStartAnimation, 2000);
  loadingAnimationQue.addAnimation(failSafePartiallyCompleteAnimation);
  loadingAnimationQue.addAnimation(foundBackupFileAnimation, 500);
  loadingAnimationQue.addAnimation(checkingSignatureAnimation, 150);
  loadingAnimationQue.addAnimation(signatureInvalidAnimation);
  //Start animationQue
  loadingAnimationQue.start();
}

function printConsoleCopyright(){
  printOnConsole("\u00A9 2015 BumBumGame Corp.");
  printOnConsole("Alle Rechte vorbehalten");
  printOnConsole(""); //EmptyLine
  printOnConsole("Für eine Liste an Befehlen schreiben sie [help]");
  printOnConsole(""); //EmptyLine
}

startNewGame();
