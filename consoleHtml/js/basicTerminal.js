//Console log object
var consoleLog = document.getElementById("consoleLog");
//Console input Object
var consoleInput = document.getElementById("mainConsoleInput");
//CommandLine Object
var commandLine = document.getElementById("commandLine");



//Clears complete CommandBlock
function clearCommandLog(){
  consoleLog.textContent = "";
}

//Logs Command in Command log
function logCommand(commandToLog){
 var newCommandToLog = document.createTextNode("> " + commandToLog);
 var newLineObject = document.createElement("br");

 consoleLog.append(newCommandToLog);
 consoleLog.append(newLineObject);
}

//Logs ServerResponse in Command Log
//@param responseToLog:Array with each line
function logServerResponse(responseToLog){
  var newDiv = document.createElement("div");
  newDiv.classList.add("serverResponse");

for(var i = 0; i < responseToLog.length; i++){
  var newResponse = document.createTextNode(responseToLog[i]);
  newDiv.append(newResponse);

  if(!i < responseToLog.length - 1){
    var newLineObject = document.createElement("br");
    newDiv.append(newLineObject);
  }
}

  consoleLog.append(newDiv);
}

//Hides InputCommandLine
function disableCommandInput(){
 commandLine.style.display = "none";
}

//Shows InputCommandLine
function enableCommandInput(){
  commandLine.removeAttribute("style");
}

//Adds spacing for Command input
function addCommandLineInputSpacing(){
  var newLineObject = document.createElement("br");
  consoleLog.append(newLineObject);
}

//Executed whenever Enter is pressed and Input is active
function onCommandInput(){
   var inputCommand = consoleInput.value;

   //Only do some when Command is inputted at all
   if(inputCommand.length != 0){
     //Disable CommandInput while processing
     disableCommandInput();
     //Put Command in Log
     logCommand(inputCommand);
     //process Command

     //Print out Answer to Command

     //Add space for new Command input
     addCommandLineInputSpacing();
     //Re-enable Input and clear input
     consoleInput.value = "";
     enableCommandInput();
   }
}

//Handles press of Enter Key
function onEnterPress(){
   //only execute if CommandInput has Focus
   if(document.activeElement === consoleInput){
     onCommandInput();
   }
}

//Handles Keyboard events
function onKeyPress(e){
    switch(e.keyCode){
      case 13: //If Enter is pressed
      onEnterPress();
      break;
    }
}

//Add Eventlistener for KeyboardInput
document.addEventListener("keydown", onKeyPress);

//Add Blur Eventlistener on Input to never have it lose focus
consoleInput.addEventListener("blur", function () { setTimeout(function () {consoleInput.focus();}, 100); });
