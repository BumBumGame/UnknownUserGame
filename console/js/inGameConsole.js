//TODO Change username with php dynamicly later!!!!
//Temporary constant
const playerUsername = "BBG";
const consoleInputChar = "$";
//-------------------------------

/**
* Class that can be attached to a console to give it functionality
**/
class InGameConsole{
//Console log Object
#consoleLog;
//Console input Object
#consoleInput;
//CommandLine Object
#commandLine;
//commandsTillDeactivation Counter
#commandsTillDeactivation;
//autoCompleteAutoExec Setting (Boolean)
//Default: False
#autoCompleteAutoExec;
//commandDefinition Object
#commandDefinition;
//currentpath
#currentPath;
//Boolean if path has changed from shown
//Default: False
#pathChanged;
//input status (if active or not)
//Default: True
#inputActive;
//array with programs (last index is latest)
#programs;
//Holds the reference to the private method autoExec combined with the bind function
#autoExecutionFunctionReference;
//Stores a bool whether manual execution is enabled or not
//Default: True
#manualExecutionEnabled;

//Static Variable which holds the currently focused Console
static currentConsoleInFocus = null;

/**
* constructor for initialization of class
* @param {htmlObject} consoleLogObject Object that holds a reference to the Element where the console Commands shall be locked
* @param {htmlObject} consoleInputObject Html input=text element that the commands are being put in
* @param {htmlObject} commandLineObject htmlelement that surrounds the consoleInput and the PathDisplay next to it
* @param {CommandDefinition} commandDefinition CommandDefinition object that holds the information about all the commands available in this console
* @param {Boolean} [addDefaultCommands=true] This Parameter sets wheter all the Default Commands will be added to this console on creation
* @param {htmlObject} [consoleContainer=null] - consoleContainer Reference to Dom element of the container around the console (Default: Uses the next parent element of console input as container)
* @param {String} [currentPath="~"] - Path that the console will be initialized with (Default: ~)
**/
constructor(consoleLogObject, consoleInputObject, commandLineObject, commandDefinition, addDefaultCommands = true, consoleContainer = null, currentPath = "~"){
  //Set console Log Object
  this.#consoleLog = consoleLogObject;
  //Set Console Input Object
  this.#consoleInput = consoleInputObject;
  //Set Commandline Object (Outer border around input)
  this.#commandLine = commandLineObject;
  //Set default for Deactivation Counter
  this.#commandsTillDeactivation = -1;
  //Set defeault for autoCompleteAutoExec Setting
  this.#autoCompleteAutoExec = false;
  //Set commandDefinition Object
  this.#commandDefinition = commandDefinition;
  //init isInputActive
  this.#inputActive = true;
  //init manualExecutionEnabled
  this.#manualExecutionEnabled = true;
  //init Program array
  this.#programs = [];

  //set currentpath to initialized
  this.#currentPath = currentPath;

  //Check if consoleContainer needs to be set automaticly
  if(consoleContainer === null){
    consoleContainer = commandLineObject.parentElement;
  }

  //Add default Commands to Execution Reference if Parameter is set to true
  if(addDefaultCommands){
    //load DefaultCommands
    let defaultCommands = DefaultCommands.defaultCommandList;
    //Add Default Commands to commandDefinition
    for(let i = 0; i < defaultCommands.length; i++){
      this.#commandDefinition.addCommandObject(defaultCommands[i]);
    }
  }

  //Set Path to init
  this.setNewPath(currentPath);

  //Update path visibility
  this.updateVisiblePath();

  //Adjust consoleInput width to console size and set eventListener
  this.#adjustInputCommandWidth();
  window.addEventListener("resize", this.#adjustInputCommandWidth.bind(this));

  //Rewrite function refernces with bind so whe can refernce them over add EventListener
  this.onKeyPress = this.onKeyPress.bind(this);
  this.#autoExecutionFunctionReference = this.#autoExecution.bind(this);

  //Set newly created Console to be active
  InGameConsole.setFocusOnConsole(this);
  //Add focus set EventListener
  this.#setFocusClickEventListener(consoleContainer);
}

/**
* @return {Dom-Object} Returns reference to the Dom Element for the consoleLog
**/
get consoleLogObject(){
  return this.#consoleLog;
}

/**
* @return {Dom-Object} Returns reference to the Dom Element for the consoleLog
**/
get consoleInput(){
  return this.#consoleInput;
}

/**
* Clears complete CommandBlock of Console
**/
clearCommandLog(){
  this.#consoleLog.textContent = "";
}

/**
* Logs Command in Command log of Console
* @param {String} commandToLog Logs current command to this console
* @private
**/
#logCommand(commandToLog){
  //Create Textnode with command
 let newCommandToLog = document.createTextNode(commandToLog);
  //Get waterver is currently written in front of the input and add it to new front of textNode
 this.#consoleLog.insertAdjacentHTML("beforeend", this.#commandLine.firstElementChild.innerHTML + " ");

 let newLineObject = document.createElement("br");

 this.#consoleLog.append(newCommandToLog);
 this.#consoleLog.append(newLineObject);
}

/**
* Prints normal Text to the console
* @param {String} output of what is outputted
* @param {int} optionalPreID (optional) String of an ID that gets assigned to the pre-Element
**/
printOnConsole(output, optionalPreID = ""){
   let textToPrint = document.createTextNode(output);
   let rawOutputObject = document.createElement("pre");

   //if PreClass is given
   if(optionalPreID.length > 0){
     rawOutputObject.setAttribute("id", optionalPreID);
   }

   rawOutputObject.append(textToPrint);
   this.#consoleLog.append(rawOutputObject);
}

/**
* Method that prompts the user to confirm a Statement
* @param {String} statement The Statement which will be prompted vor
* @return {Promise} A Promise which whill be fullfilled with either true or false if the user has answered the prompt
**/
requestConfirm(statement){
  //print Confirm Message on Console
  this.printOnConsole(statement);
  //Print a break
  this.printOnConsole("\n");
  //print (Y/N) to clarify input
  this.printOnConsole("(Y/N)");
  //print input spacing
  this.#addCommandLineInputSpacing();
  //Set Console to autoExecution
  this.setInputToAutoExecution();
  //Disable manual execution with enter
  this.disableInputManualExecution();

  //Save old CommandExecutionReference
  let oldCommandExecutionReference = this.currentActiveCommandDefinition;

  //Define Reset after Confirm Method
  let resetAfterConfirm = function () {
    //Disable autoexecution
    this.disableInputAutoExecution();
    //Reenable Manual execution
    this.enableInputManualExecution();
    //Rewrite previously saved oldExecutionReferenz
    this.#overwriteCurrentActiveExecutionReference(oldCommandExecutionReference);
  }.bind(this);

  //replace Execution reference temporary with a reference that contains the yes and no answer
  let newTempCommandDefinition = new CommandDefinition();

  let outputPromise = new Promise(function (resolve, reject) {
      //Add yes answer to new definition
      newTempCommandDefinition.addCommand("Y", "", function() {
        resetAfterConfirm();
        resolve(true);
      });
      //Add no answer to new Definition
      let onNoFunction = function () {
        resetAfterConfirm();
        resolve(false);
      };

      newTempCommandDefinition.addCommand("N", "", onNoFunction);

      //Overwrite existing Definition with new Definition
      this.#overwriteCurrentActiveExecutionReference(newTempCommandDefinition);
  }.bind(this));

  return outputPromise;
}

/**
* Logs ServerResponse in Command Log
* @param {String:Array|String} responseToLog with each line
* @param {String} additionalClass Adds an aditional class to the div object
**/
logServerResponse(responseToLog, additionalClass = ""){
  //if Response log is not an array save it as one whith one line
  if(!Array.isArray(responseToLog)){
    responseToLog = [responseToLog];
  }

  let newDiv = document.createElement("div");
  newDiv.classList.add("serverResponse");

   if(additionalClass.length > 0){
      newDiv.classList.add(additionalClass);
   }

  //Start spacing from CommandLog
  let newLineObject = document.createElement("br");
  newDiv.append(newLineObject);

for(let i = 0; i < responseToLog.length; i++){
  let newPreformTextElement = document.createElement("pre");
  let newResponse = document.createTextNode(responseToLog[i]);
  newPreformTextElement.append(newResponse);
  newDiv.append(newPreformTextElement);
}

  this.#consoleLog.append(newDiv);
}

/**
* Clears all text in command input
**/
clearCommandInput(){
  this.#consoleInput.value = "";
}

/**
* Hides InputCommandLine
**/
disableCommandInput(){
 this.clearCommandInput();
 this.#commandLine.style.display = "none";
 this.#removeActiveEventListenerForConsole();
 this.#consoleInput.disabled = true;
}

/**
* Shows input CommandLine of console
**/
enableCommandInput(){
  this.clearCommandInput();
  this.#commandLine.removeAttribute("style");
  this.#consoleInput.removeAttribute("disabled");
  this.#addActiveEventListenerForConsole();
  this.#consoleInput.focus();
}

/**
* Sets overwrites the current active execution reference
* @private
* @param {CommandDefinition} newExecutionReference Referernce to the new Eecutionreferenz
**/
#overwriteCurrentActiveExecutionReference(newExecutionReference){
  if(this.#programs.length == 0){
    //Overwrite current console ExecutionReference
    this.#commandDefinition = newExecutionReference;
    return;
  }

  //Overwrite currentProgram command definition
  this.#programs[this.#programs.length - 1].overwriteCurrentCommandExecutionReferenceForProgram(newExecutionReference);
}

/**
* Adds spacing before Input
* @private
**/
#addCommandLineInputSpacing(){
  let newLineObject = document.createElement("br");
  this.#consoleLog.append(newLineObject);
}
/**
* Set count of allowed commands until input gets automaticly disabled
* @param {int} commandCount sets the count
**/
setCommandsTillInputDeactivation(commandCount){
  if(commandCount > 0){
    this.#commandsTillDeactivation = commandCount;
  }
}

/**
* Reset Count of allowed commands to Infinity
**/
clearCommandsTillInputDeactivation(){
  this.#commandsTillDeactivation = -1;
}

/**
* Function that executes whatever is inside the input field
* @private
**/
#onCommandInput(){
   let inputCommand = this.#consoleInput.value;

   //Only do some when Command is inputted at all
   if(inputCommand.length != 0){
     //Execute the command
     this.executeCommand(inputCommand);
     //Clear CommandInput
     this.clearCommandInput();
   }
 }

/**
* Executes an Command
* @async
* @param {String} command Commandstring that shall be executed
* @return {Promise} Returns a Promise which is fullfilled once the command has been executed
**/
async executeCommand(command){
  //Disable CommandInput while processing
  this.disableCommandInput();
  //Put Command in Log
  this.#logCommand(command);

  //Get currently active commandDefiniton
  let currentActiveCommandDefinition = this.currentActiveCommandDefinition;

  //get CommandIndex
  let commandIndex = currentActiveCommandDefinition.getCommandIndex(command);
  //Check if command exists
  if(commandIndex != -1){

  //Check if Command is a program
  if(currentActiveCommandDefinition.getCommandIsProgram(commandIndex)){
    //start the program
    this.#startProgram(commandIndex);

  }else{
  //process Command
  //Check if program Defintion or normal console Defintion needs to be used
  let commandProcessing = new CommandProcessor(command, this.currentActiveCommandDefinition, this);

  //Wait for command Execution
  await commandProcessing.processCommand();
  //Print out Answer to Command if exists
    if(commandProcessing.commandResponse != null){
    this.logServerResponse(commandProcessing.commandResponse);
    }

  }

}
  //Add space for new Command input
  this.#addCommandLineInputSpacing();

 //Check if input needs to be disabled after this command
  if(this.#commandsTillDeactivation == 1){
    this.#commandsTillDeactivation = -1;
  }else{
    this.enableCommandInput();
    //Update path view
    this.updateVisiblePath();
  }

  if(this.#commandsTillDeactivation > 0){
   this.#commandsTillDeactivation--;
  }
  //scroll Intoview
  this.#commandLine.scrollIntoView();
}

/**
* Handles press of Enter Key
* @private
**/
#onEnterPress(){
  //only execute if CommandInput has Focus and manual Execution is not disabled
  if(document.activeElement === this.#consoleInput && this.#manualExecutionEnabled){
      this.#onCommandInput();
   }
  }

/**
* Method that sets new console path (updateVisiblePath() needs to be called for this to be shown!)
* @param {String} pathName New path that will be written in front of the console
**/
setNewPath(pathName){
this.#currentPath = pathName;
//Set path to changed
this.#pathChanged = true;
}

/**
* Method that prints the current path or programname in front of the input
**/
updateVisiblePath(){
 //Check if path needs to be updated
 if(!this.#pathChanged){
   return;
 }

 //Check if console is in program mode
 if(this.#programs.length > 0){

   //Check if running program has a custom path
   if(this.#programs[this.#programs.length - 1].hasCustomProgramPath){
     //Set custom path
     this.#commandLine.firstElementChild.innerHTML = "<u>" + this.#programs[this.#programs.length - 1].customProgramPath + "</u> >";
   }else{
  //Set relative program path

   let programStructureAlias = "";

   //create programStructureAlias
   //Add all previos programs
   for(let i = 0; i < this.#programs.length - 1; i++){
     programStructureAlias += this.#programs[i].commandStartAlias + "/";
   }
   //Add last program underlined
   programStructureAlias += "<u>" + this.#programs[this.#programs.length - 1].commandStartAlias + "</u> >";

   this.#commandLine.firstElementChild.innerHTML = programStructureAlias;
    }
  }else{
 //If not print normal path
  this.#commandLine.firstElementChild.innerHTML = playerUsername + ":" + this.#currentPath + consoleInputChar;
}

 //recalculate size of input
 this.#adjustInputCommandWidth();
 //Set path changed to false
 this.#pathChanged = false;
}

/**
* Method that returns the current Path
**/
get getCurrentPath(){
  return this.#currentPath;
}

/**
* Method which returns the current active commandDefinition
* @return {CommandDefinition} Reference to currently active commandDefinition on this console
**/
get currentActiveCommandDefinition(){
  if(this.#programs.length > 0){
    return this.#programs[this.#programs.length - 1].commandExecutionReference;
  }

    return this.#commandDefinition;
}

/**
* Method that starts a program
* @param {Number} commandIndex The Index inside the commandDefinition currently used by this console
* @private
**/
#startProgram(commandIndex){
  //Get currently used commandDefinition
  let activeCommandDefinition = this.currentActiveCommandDefinition;

  //Check if command is acutally a program
  if(!activeCommandDefinition.getCommandIsProgram(commandIndex)){
    throw new TypeError("Given Command is not a Program!");
    return;
  }

  //Get commandObject and add it to program Array
  this.#programs.push(activeCommandDefinition.getCommandObject(commandIndex));
  //Set path to changed
  this.#pathChanged = true;
}

/**
* Starts and injects a custom Program into the console (will be started over currentrunning program)
* @param {String} programName Alias of the Program
* @param {CommandDefinition} programCommandDefinition Command Definiton for the Program
* @param {String} [customProgramPath = null] OptionalParameter for adding a customProgramPath to a program (null = no CustomPath)
* @param {boolean} [exitable = true] OptionalParameter which controls if the program will be exitable
**/
startCustomProgram(programName, programCommandDefinition, customProgramPath = null, programExitable = true){
//Push a new Program into ProgramStack of the Console
this.#programs.push(new Command(programName, "", true, programCommandDefinition, customProgramPath, programExitable));

//Set path changed to true to let the console now that a new program is running
this.#pathChanged = true;
//Update Visible Path of the Console
this.updateVisiblePath();
}

/**
* Method that closes the currently active program (doesnt do anything if no program is active)
**/
closeCurrentProgram(){
  //if there is a program to close - close it
  if(this.#programs.length > 0){
     //if there are more than one program in que
     if(this.#programs.length > 1){
       this.#programs.splice(this.#programs.length - 1, 1);
     }else{
        //if its the last program in cue
        //clear program array
        this.#programs = [];
     }

     //set path change to true
     this.#pathChanged = true;

  }

}

/**
* Method to set autocomplete to Auto exec
**/
setAutoCompleteToAutoExec(){
    this.#autoCompleteAutoExec = true;
}

/**
* Method to set autocomplete to Manual exec
**/
setAutoCompleteToManualExec(){
   this.#autoCompleteAutoExec = false;
}

/**
* Method that handles the autocomplete Feature
**/
autoComplete(){
  //If Console input is active
  if(document.activeElement === this.#consoleInput && this.#consoleInput.value.length != 0 ){
    let fittingCommands = this.currentActiveCommandDefinition.getCommandsStartingWith(this.#consoleInput.value.trim().toLowerCase());

    if(fittingCommands.length != 0){

         if(fittingCommands.length == 1){
            this.#consoleInput.value = fittingCommands[0];
            //Execute Command if in Auto Exec Mode
            if(this.#autoCompleteAutoExec){
               this.#onCommandInput();
            }
         }else{
            let autoCompleteString = "";

            for(let i = 0; i < fittingCommands.length; i++){
              autoCompleteString += fittingCommands[i] + " ";
            }

            this.#logCommand(this.#consoleInput.value);
            this.printOnConsole(autoCompleteString.trim());
            this.printOnConsole(""); //Print an empty line
         }
       }
     }
   }

/**
* Method that sets input of console to Auto execution
**/
setInputToAutoExecution(){
  //Set eventListener on input change
  this.#consoleInput.addEventListener("input", this.#autoExecutionFunctionReference);
}

/**
* Methods that disables Auto Execution for consoleInput
**/
disableInputAutoExecution(){
  this.#consoleInput.removeEventListener("input", this.#autoExecutionFunctionReference);
}

/**
* Method which disables normal command sending by using Enter
**/
disableInputManualExecution(){
  this.#manualExecutionEnabled = false;
}

/**
* Method which enables normal command sending by using Enter
**/
enableInputManualExecution(){
  this.#manualExecutionEnabled = true;
}

/**
* Method for autoExecution
* @private
**/
#autoExecution(){
  let fittingCommands = this.currentActiveCommandDefinition.getCommandsStartingWith(this.#consoleInput.value.trim().toLowerCase());

  //Only if there is one clear option for a command
  if(fittingCommands.length == 1){
    //Check if command is fully put in
    if(this.#consoleInput.value.trim().length == fittingCommands[0].length){
      this.#onCommandInput();
    }

  }

}

/**
* Method that adjust the Width of the input command line according to how big the current path is
* @private
**/
#adjustInputCommandWidth(){
  let totalWidth = parseFloat(window.getComputedStyle(this.#commandLine).width);
  let pathWidth = parseFloat(window.getComputedStyle(this.#commandLine.firstElementChild).width);
  this.#consoleInput.style.width = totalWidth - pathWidth - totalWidth*0.03 + "px";
}

/**
* Handles Keyboard events
* @param {event} e The Fired keyboard event
* @private
**/
onKeyPress(e){
    switch(e.keyCode){
      case 13: //If Enter is pressed
      this.#onEnterPress();
      break;
      case 9: //If Tab is pressed
      e.preventDefault();
      this.autoComplete();
      this.#commandLine.scrollIntoView();
      break;
      default:

    if(document.activeElement != this.#consoleInput){
      if(e.key.match(".*") && e.key.length == 1){
        e.preventDefault();
        this.#consoleInput.value += e.key;
        this.#consoleInput.focus();
        this.#commandLine.scrollIntoView();
        //Fire input event
        this.#consoleInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      break;
    }
   }

}

/**
* Adds eventlistener for automatic focusing of input on any keypress
* @private
**/
#addActiveEventListenerForConsole(){
  //Add Eventlistener for KeyboardInput
  document.addEventListener("keydown", this.onKeyPress);
}

/**
* Removes eventlistener for automatic focusing of input on any keypress
* @private
**/
#removeActiveEventListenerForConsole(){
  document.removeEventListener("keydown", this.onKeyPress);
}

/**
* Adds a click eventListener to the consoles Body to set autofocus on click
* @param {InGameConsole} consoleContainer Rereference to the consoleContainer of the Console
**/
#setFocusClickEventListener(consoleContainer){
  consoleContainer.addEventListener("click", this.#setFocusOnThisConsole.bind(this));
}

/**
* Sets the class Focus on this console
**/
#setFocusOnThisConsole(){
  InGameConsole.setFocusOnConsole(this);
}

/**
* Sets all Event listeners for an active Console and deactivates all listeners on last focused Console
* @param {InGameConsole|null} console Reference to the new console Object that shall be put to focus or null if no console shall be put to focus
**/
static setFocusOnConsole(console){
  //Disable all EventListeners on old Console if possible
  if(this.currentConsoleInFocus != null){
    this.currentConsoleInFocus.#removeActiveEventListenerForConsole();
  }

  //Enable event listeners on new console if possible
  if(console != null){
  console.#addActiveEventListenerForConsole();
  }
  //Set datafield to current active Console
  this.currentConsoleInFocus = console;
}

}
