class InGameConsole{
//Console log Object
consoleLog;
//Console input Object
consoleInput;
//CommandLine Object
commandLine;
//commandsTillDeactivation Counter
commandsTillDeactivation;
//autoCompleteAutoExec Setting (Boolean)
autoCompleteAutoExec;
//commandDefinition Object
commandDefinition;

constructor(consoleLogObject, consoleInputObject, commandLineObject, commandDefinition){
  //Set console Log Object
  this.consoleLog = consoleLogObject;
  //Set Console Input Object
  this.consoleInput = consoleInputObject;
  //Set Commandline Object (Outer border around input)
  this.commandLine = commandLineObject;
  //Set default for Deactivation Counter
  this.commandsTillDeactivation = -1;
  //Set defeault for autoCompleteAutoExec Setting
  this.autoCompleteAutoExec = false;
  //Set commandDefinition Object
  this.commandDefinition = commandDefinition;

  //Set event listener
  //Add Eventlistener for KeyboardInput
  this.addActiveEventListenerForConsole();
}

//Getter for Objects
get consoleLogObject(){
  return this.consoleLog;
}

get consoleInput(){
  return this.consoleInput;
}

//Clears complete CommandBlock of Console
clearCommandLog(){
  this.consoleLog.textContent = "";
}

//Logs Command in Command log of Console
//@param String commandToLog - Logs current command to this console
logCommand(commandToLog){
 var newCommandToLog = document.createTextNode("> " + commandToLog);
 var newLineObject = document.createElement("br");

 this.consoleLog.append(newCommandToLog);
 this.consoleLog.append(newLineObject);
}

//Prints normal Text to the console
//@param output String of what is outputted
//@param optionalPreID (optional) String of an ID that gets assigned to the pre-Element
printOnConsole(output, optionalPreID = ""){
   var textToPrint = document.createTextNode(output);
   var rawOutputObject = document.createElement("pre");

   //if PreClass is given
   if(optionalPreID.length > 0){
     rawOutputObject.setAttribute("id", optionalPreID);
   }

   rawOutputObject.append(textToPrint);
   this.consoleLog.append(rawOutputObject);
}

//Logs ServerResponse in Command Log
//@param responseToLog:Array with each line
//@param additionalClass:String Adds an aditional class to the div object
logServerResponse(responseToLog, addionalClass = ""){
  var newDiv = document.createElement("div");
  newDiv.classList.add("serverResponse");

   if(additionalClass.length > 0){
      newDiv.classList.add(additionalClass);
   }

  //Start spacing from CommandLog
  var newLineObject = document.createElement("br");
  newDiv.append(newLineObject);

for(var i = 0; i < responseToLog.length; i++){
  var newPreformTextElement = document.createElement("pre");
  var newResponse = document.createTextNode(responseToLog[i]);
  newPreformTextElement.append(newResponse);
  newDiv.append(newPreformTextElement);
}

  this.consoleLog.append(newDiv);
}

//Hides InputCommandLine
disableCommandInput(){
 this.commandLine.style.display = "none";
 this.consoleInput.disabled = true;
}

//Shows InputCommandLine of Console
enableCommandInput(){
  this.commandLine.removeAttribute("style");
  this.consoleInput.removeAttribute("disabled");
  this.consoleInput.focus();
}

//Adds spacing for Command input
addCommandLineInputSpacing(){
  var newLineObject = document.createElement("br");
  this.consoleLog.append(newLineObject);
}

//Set count of allowed commands until input gets automaticly disabled
//@param commandCount Int sets the count
setCommandsTillInputDeactivation(commandCount){
  if(commandCount > 0){
    this.commandsTillDeactivation = commandCount;
  }
}

//Reset Count of allowed commands to Infinity
clearCommandsTillInputDeactivation(){
  this.commandsTillDeactivation = -1;
}

//Function that executes whatever is inside the input field
onCommandInput(){
   var inputCommand = this.consoleInput.value;

   //Only do some when Command is inputted at all
   if(inputCommand.length != 0){
     //Disable CommandInput while processing
     this.disableCommandInput();
     //Put Command in Log
     this.logCommand(inputCommand);
     //process Command
     var commandProcessing = new CommandProcessor(inputCommand, this.commandDefinition);
     commandProcessing.processCommand();
     //Print out Answer to Command if exists
     if(commandProcessing.commandResponse != null){
       this.logServerResponse(commandProcessing.commandResponse);
     }
     //Add space for new Command input
     this.addCommandLineInputSpacing();
     //Re-enable Input and clear input
     this.consoleInput.value = "";

     if(this.commandsTillDeactivation == 1){
       this.commandsTillDeactivation = -1;
     }else{
       this.enableCommandInput();
     }

     if(this.commandsTillDeactivation > 0){
      this.commandsTillDeactivation--;
     }
     //scroll Intoview
     this.commandLine.scrollIntoView();
   }
 }

//Handles press of Enter Key
onEnterPress(){
  //only execute if CommandInput has Focus
  if(document.activeElement === this.consoleInput){
      this.onCommandInput();
   }
  }

//Method to set autocomplete to Auto exec
setAutoCompleteToAutoExec(){
    this.autoCompleteAutoExec = true;
}

//Method to set autocomplete to Manual exec
setAutoCompleteToManualExec(){
   this.autoCompleteAutoExec = false;
}

//Method that handles the autocomplete Feature
autoComplete(){
  //If Console input is active
  if(document.activeElement === this.consoleInput && this.consoleInput.value.length != 0 ){
    var fittingCommands = this.commandDefinition.getCommandsStartingWith(this.consoleInput.value.trim().toLowerCase());

    if(fittingCommands.length != 0){

         if(fittingCommands.length == 1){
            this.consoleInput.value = fittingCommands[0];
            //Execute Command if in Auto Exec Mode
            if(this.autoCompleteAutoExec){
               this.onCommandInput();
            }
         }else{
            var autoCompleteString = "";

            for(var i = 0; i < fittingCommands.length; i++){
              autoCompleteString += fittingCommands[i] + " ";
            }

            this.logCommand(this.consoleInput.value);
            this.printOnConsole(autoCompleteString.trim());
            this.printOnConsole(""); //Print an empty line
         }
       }
     }
   }

//Method that sets input of console to Auto execution
setInputToAutoExecution(){
  //Set eventListener on input change
  this.consoleInput.addEventListener("input", this.autoExecution.bind(this));
}

//Methids that disables Auto Execution for consoleInput
disableInputAutoExectution(){
  this.consoleInput.removeEventListener("input", this.autoExecution.bind(this));
}

//Method for autoExecution
autoExecution(){
  var fittingCommands = this.commandDefinition.getCommandsStartingWith(consoleInput.value.trim().toLowerCase());

  //Only if there is one clear option for a command
  if(fittingCommands.length == 1){
    //Check if command is fully put in
    if(this.consoleInput.value.trim().length == fittingCommands[0].length){
      this.onCommandInput();
    }

  }

}

//Handles Keyboard events
onKeyPress(e){
    switch(e.keyCode){
      case 13: //If Enter is pressed
      this.onEnterPress();
      break;
      case 9: //If Tab is pressed
      e.preventDefault();
      this.autoComplete();
      this.commandLine.scrollIntoView();
      break;
      default:

    if(document.activeElement != this.consoleInput){
      if(e.key.match(".*")){
        e.preventDefault();
        this.consoleInput.value += e.key;
        this.consoleInput.focus();
        this.commandLine.scrollIntoView();
        //Fire input event
        this.consoleInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      break;
    }
   }

}

addActiveEventListenerForConsole(){
  //Add Eventlistener for KeyboardInput
  document.addEventListener("keydown", this.onKeyPress.bind(this));
}

removeActiveEventListenerForConsole(){
  document.removeEventListener("keydown", this.onKeyPress.bind(this));
}

}
