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

//Prints normal Text to the console
function printOnConsole(output){
   var textToPrint = document.createTextNode(output);
   var rawOutputObject = document.createElement("pre");

   rawOutputObject.append(textToPrint);
   consoleLog.append(rawOutputObject)
}

//Logs ServerResponse in Command Log
//@param responseToLog:Array with each line
function logServerResponse(responseToLog){
  var newDiv = document.createElement("div");
  newDiv.classList.add("serverResponse");

  //Start spacoing from CommandLog
  var newLineObject = document.createElement("br");
  newDiv.append(newLineObject);

for(var i = 0; i < responseToLog.length; i++){
  var newPreformTextElement = document.createElement("pre");
  var newResponse = document.createTextNode(responseToLog[i]);
  newPreformTextElement.append(newResponse);
  newDiv.append(newPreformTextElement);
}

  consoleLog.append(newDiv);
}

//Hides InputCommandLine
function disableCommandInput(){
 commandLine.style.display = "none";
 consoleInput.disabled = true;
}

//Shows InputCommandLine
function enableCommandInput(){
  commandLine.removeAttribute("style");
  consoleInput.removeAttribute("disabled");
  consoleInput.focus();
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
     var commandProcessing = new commandProcessor(inputCommand);
     commandProcessing.processCommand();
     //Print out Answer to Command if exists
     if(commandProcessing.commandResponse != null){
       logServerResponse(commandProcessing.commandResponse);
     }
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

function autoComplete(){
  //If Console input is active
  if(document.activeElement == consoleInput){
    var fittingCommands = localCommands.getCommandsStartingWith(consoleInput.value.trim().toLowerCase());

    if(fittingCommands.length != 0){

         if(fittingCommands.length == 1){
            consoleInput.value = fittingCommands[0];
         }else{
            var autoCompleteString = "";

            for(var i = 0; i < fittingCommands.length; i++){
              autoCompleteString += fittingCommands[i] + " ";
            }

            logCommand(consoleInput.value);
            printOnConsole(autoCompleteString.trim());
         }

    }

  }

}

//Handles Keyboard events
function onKeyPress(e){
    switch(e.keyCode){
      case 13: //If Enter is pressed
      onEnterPress();
      break;
      case 9: //If Tab is pressed
      e.preventDefault();
      autoComplete();
      break;
      default:

    if(document.activeElement != consoleInput){
      if(e.key.match(".*")){
        e.preventDefault();
        consoleInput.value += e.key;
        consoleInput.focus();
      }
      break;
    }
   }

}

//Add Eventlistener for KeyboardInput
document.addEventListener("keydown", onKeyPress);
