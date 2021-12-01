/**
* Type that can hold either a commandDefinition- or a function reference
* @typedef {(function|CommandDefinition)} commandExecutionType
**/

/**
* Class that represents an Command
**/
class Command{
//bool if command is a program that needs to be started
isProgram;
//start alias of the command
commandStartAlias;
//Description of the Command
commandDescritption;
//Object of type commandExecutionType that holds either an commandDefinition or an Reference to a function
commandExecutionReference;

/**
* constructor of Command class
* @param {String} commandStartAlias First Word/Alias that the command Starts with
* @param {String} commandDescritption The description of the Command
* @param {Boolean} isProgram Boolean that sets if the Command starts a new Program or executes a simple function
* @param {commandExecutionType} commandExecutionReference Reference to the CommandDefinition or the function that shall be used to execute the Command/Programm
**/
constructor(commandStartAlias, commandDescritption, isProgram, commandExecutionReference){

  //Check and save commandExececutionReference
  if(typeof commandExececutionReference === "object"){

     if(!isProgram){
       throw new TypeError("For isProgram = false, commandExecutionReference needs to be of type function!");
      }

     if(!commandExecutionReference instanceof CommandDefinition){
       throw new TypeError("commandExececutionReference for isProgram = true, needs to be an instace of CommandDefinition!");
     }

  }

  if(typeof commandExecutionReference === "function" && isProgram){
      throw new TypeError("commandExececutionReference for isProgram = true, needs to be an instace of CommandDefinition!");
  }

  this.commandExecutionReference = commandExecutionReference;
  //Save startAlias
  this.commandStartAlias = commandStartAlias.trim().toLowerCase();
  //Save description
  this.commandDescritption = commandDescritption.trim();
  //Save isProgram
  this.isProgram = isProgram;
}

/**
* Returns the current commandStartAlias
* @return {String} The commandStartAlias of the Command
**/
get commandStartAlias(){
  return this.commandStartAlias;
}

/**
* Returns the description of the command
* @return {String} Description of the Command
**/
get commandDescritption(){
  return this.commandDescritption;
}

/**
* Return if the command is a program or not
* @return {Boolean} if command is a Program or not
**/
get isProgram(){
   return this.isProgram;
}

/**
* Return the Reference to the executionInformation
* @return {commandExecutionType} reference to function or Command Defintion for execution
**/
get commandExecutionReference(){
   return this.commandExecutionReference;
}

}

/**
* Class that holds all Command defintitions for a console
**/
class CommandDefinition{
//Array Collection of commands
commandArray;

/**
* constructor
**/
constructor(){
  //init Arrays
   this.commandArray = [];
}
/**
*Adds Command to Local Command definition
* @param {String} commandStartAlias Alias that the command will be started with in the console input
* @param {String} commandDescritption A Description of the command (newline marked with /n)
* @param {commandExecutionType} commandExecutionReference A reference to the function or ProgramCommandDefinition that will be executed with this command
**/
addCommand(commandStartAlias, commandDescritption, commandExecutionReference){
  //Create a new command and add it to array
  var newCommand = new Command(commandStartAlias, commandDescritption, false, commandExecutionReference);
  //Add new command to list
  this.commandArray.push(newCommand);
}

/**
* Adds Command Object to command List
* @param {Objekt:Command} commandObject The command Object to be added
**/
addCommandObject(commandObject){
 this.commandArray.push(commandObject);
}

/**
* Clears all of the Commands out of the Command definition
**/
clearAllCommands(){
  this.commandArray = [];
}

/**
*Removes a Command (Throws error if not found)
* @param {Number} commandIndex Index of the command that shall be removed
**/
removeCommand(commandIndex){
  //Remove Element if found
  var extractedElement = this.commandArray.splice(1, commandIndex);

  if(extractedElement.length == 0){
    throw "Error: Command not found in Defintition!";
  }

}

/**
*Function that returns the Index of a Specific Command based on its Alias. Returns -1 of no Command is found
* @param {String} command The comand of which index shall be searched for
* @return {int} Index of the Command, if not found -1
**/
getCommandIndex(command){
 var currentCommandStartAlias = command.split(" ")[0].trim().toLowerCase();

 //Search all commands
 for(var i = 0; i < this.commandArray.length; i++){

    if(this.commandArray[i].commandStartAlias == currentCommandStartAlias){
      return i;
    }

 }

 return -1;
}

/**
* Function that returns the current count of local Commands
* @return Count of all Commands in this Defintion
**/
get length(){
  return this.commandArray.length;
}

/**
* Functions returns Command Allias as String
* @param {int} commandIndex Index of the command which Alias shall be returned;
* @return {String} Alias to the requested Index or null if index doesnt exist
**/
getCommandAlias(commandIndex){
  if(commandIndex >= 0 && commandIndex < this.length){
      return this.commandArray[commandIndex].commandStartAlias;
  }
      //else
    	return null;
}

/**
* Returns the execution reference of an command
* @param {int} commandIndex Index of the command
* @return {commandExecutionType} ExecutionRefernce to the requested Index or null if index doesnt exist
**/
getCommandExecutionReference(commandIndex){
  if(commandIndex >= 0 && commandIndex < this.length){
    return this.commandArray[commandIndex].commandExecutionReference;
  }
  //else
    return null;
}

/**
* Function returns commandDescritption as an Array to @param Index of Command
* @param {Number} commandIndex Index of the command
* @return {String[]} Array of Strings that holds each line of an description seperately, null if index doest exist
**/
getCommandDescription(commandIndex){
  if(commandIndex >= 0 && commandIndex < this.length){
    var descriptionArray = this.commandArray[commandIndex].commandDescritption.split("\n");

    return descriptionArray;
  }

  //else
  return null;
}

/**
* Function returns the First Line of a commandDescritption as String
* @param {int} commandIndex Index of the command
* @return {String} First line of the commandDescritption or null if index doesnt exist
**/
getFirstLineOfCommandDescription(commandIndex){
  if(commandIndex >= 0 && commandIndex < this.length){
      return this.commandArray[commandIndex].commandDescritption.split("\n")[0];
  }

  //else
  return null;
}

/**
* Function that returns all Commands that start with param
* @param {String} commandStart String with shall be searched for fitting commands to
* @return {String[]} An Array with alle The fitting Command Aliases
}
**/
getCommandsStartingWith(commandStart){
  var fittingCommandArray = [];
  commandStart = commandStart.toLowerCase().trim();

  //Check Start of each Alias and add any Matching to Array
  for(var i = 0; i < this.length; i++){

    if(this.commandArray[i].commandStartAlias.startsWith(commandStart)){
      fittingCommandArray.push(this.commandArray[i].commandStartAlias);
    }

  }

  //Return array of found Commands
  return fittingCommandArray;
}

/**
* Function that returns if the command is a program or a simple Command
* @param {Number} commandIndex Index of the command
* @return {Boolean} Boolean whether the command is a program or not
**/
getCommandIsProgram(commandIndex){
  return this.commandArray[commandIndex].isProgram;
}

/**
*Function that executes the a Command Based on their Alias.
* @param {String} command Command for the Command which function should be executed
* @return {String[]} Answer Array which each line as seperate, NULL if not successfull
**/
executeCommandFunction(command, executingConsole){
var commandIndex = this.getCommandIndex(command);
//If Command not found then return null
if(commandIndex == -1){
 return null;
}

var commandResponse = this.commandArray[commandIndex].commandExecutionReference(command, executingConsole);

if(commandResponse == null){
 //Return empty response Array
 var emptyResponseArray = [];
 return emptyResponseArray;
}

//Return response Array
return commandResponse;
}

}

//-------------------------------------------------
//Create Global Command Definition Object
const localCommands = new CommandDefinition();
//-------------------------------------------------

/**
* Class that is used to process Commands-------------------------------------------------------------------------------------------
*/
class CommandProcessor{
//Current command Answer variable
currentCommandAnswer;
//current Command
currentCommand;
//Current CommandDefinition
commandDefinition;
//executingConsole
executingConsole;

/**
* Constructor of class
* @param {String} command Command that shall be processed
* @param {CommandDefinition:Object} CommandDefinition that the command should be searched for in
* @param {InGameConsole} executingConsole Reference to the Console which is executing the command
**/
constructor(command, commandDefinition, executingConsole){
  //Save Command to Datafield
 this.currentCommand = command.toLowerCase().trim();
 //Standard init CommandAnswer
 this.currentCommandAnswer = null;
 //Set commandDefinition Reference
 this.commandDefinition = commandDefinition;
 //Save executing console reference
 this.executingConsole = executingConsole;
}

/**
* Processes Current saved command through searching it in commandDefinition
**/
processCommand(){
  var currentCommandResponse = this.commandDefinition.executeCommandFunction(this.currentCommand, this.executingConsole);
  //Check if Command exists local
  if(currentCommandResponse != null) {
    //If he does exist
     //Check if Command send Response
     if(currentCommandResponse.length != 0){
       this.currentCommandAnswer = currentCommandResponse;
     }

  }else{
    //Send Command to Server
  }

}
/**
* Get Method for CommandAnswer
* @return Answer to command if processed, null if not available
*/
get commandResponse(){
    return this.currentCommandAnswer;
}

}
