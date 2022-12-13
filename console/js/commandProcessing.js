/**
* Type that can hold either a commandDefinition- or a function reference
* @typedef {(function|CommandDefinition)} executionType
**/

//---Manage Default Command Methods---------------------------------
/**
* Static class which contains all Default Commands
* @class
**/
class DefaultCommands{
  //Private Variable containing all Default Commands
  static #defaultCommands = [];

  /**
  * Adds a command to the default Command list
  * @static
  * @throws {TypeError}
  * @param {Command} commandObject Reference to the commandObject of the Command that is going to be added
  **/
  static addCommandToDefaults(commandObject){
    //Check if Object is a Command Object by trying
    try {
      Command.isCommand(commandObject, true);
      //If Object is valid: Add it to defaultCommands
      this.#defaultCommands.push(commandObject);
    }catch(e){
      throw e;
    }

  }

  /**
  * Removes a command from the default Command list
  * @static
  * @param {Number} commandObject Reference to the commandObject of the Command that is going to be removed
  **/
  static removeCommandFromDefaults(commandIndex){
    this.#defaultCommands.splice(commandIndex, 1);
  }

  /**
  * Clears all default Commands
  * @static
  **/
  static clearCommandDefaults(){
    this.#defaultCommands = [];
  }

  /**
  * Returns the current List of default Commands
  * @static
  * @return {Command[]} Array which contains all Commands in the List
  **/
  static get defaultCommandList(){
    return this.#defaultCommands;
  }

}
//---------------------------------------------------

/**
* Class that represents an Command
* @class
**/
class Command{
//start alias of the command
#commandStartAlias;
//Description of the Command
#commandDescritption;
//Object of type executionType that holds either an commandDefinition or an Reference to a function
#executionReference;

/**
* constructor of Command class
* @throws {TypeError}
* @param {String} commandStartAlias First Word/Alias that the command Starts with
* @param {String} commandDescritption The description of the Command
* @param {executionType} executionReference Reference to the CommandDefinition or the function that shall be used to execute the Command/Programm
**/
constructor(commandStartAlias, commandDescritption, executionReference){

  //Check if conditions of a command are met
  //(Only if this class is instantietet directly!!!)
  if(typeof executionReference !== "function" && this.constructor === Command){
      throw new TypeError("commandExececutionReference for a Command, needs to be an function!");
  }

  //Save Command execution reference
  this.#executionReference = executionReference;
  //Save startAlias
  this.#commandStartAlias = commandStartAlias.trim();
  //Save description
  this.#commandDescritption = commandDescritption.trim();
}

/**
* Checks if object is a command
* @static
* @param {Object} object Object to be checked
* @param {Boolean} [errorThrow=false] Determines whether an automatic error is thrown
* @return {Boolean} Returns true or false (if errorThrow = true: Exeption thrown insted of fall)
* @throws {TypeError} Throws type error if errorThrow = true
**/
static isCommand(object, errorThrow = false){
  if(!(object instanceof Command)){

    if(errorThrow){
    throw new TypeError("Object needs to be of Type Command!");
    }

    return false;
  }

  return true;
}

/**
* Returns the current commandStartAlias
* @return {String} The commandStartAlias of the Command
**/
get startAlias(){
  return this.#commandStartAlias;
}

/**
* Returns the description of the command
* @return {String} Description of the Command
**/
get description(){
  return this.#commandDescritption;
}

/**
* Returns if the Object is a program or not
* @return {Boolean} if Object is a Program or not
**/
get isProgram(){
  if(this instanceof Program){
    return true;
  }
  //else (if Program)
   return false;
}

/**
* Return the Reference to the executionInformation
* @return {executionType} reference to function or Command Defintion for execution
**/
get executionReference(){
   return this.#executionReference;
}

}

/**
* Class represents a Program
* @class
* @augments Command
**/
class Program extends Command{
  //Custom path that will be used for the program
  #customProgramPath;
  //Custom Program Parameters
  #customProgramParameters;
  //Object which holds a overwrite Value for the execution reference
  #executionReferenceOverwrite;
  //Stores reference for the Init function
  #initFunctionReference;
  //Stores reference for the preExit function
  #preExitFunctionReference;

  /**
  * constructor of Program class
  * @throws {TypeError}
  * @param {String} programStartAlias First Word/Alias which starts the program
  * @param {String} programDescription The description of the Program
  * @param {CommandDefinition} programCommandDefinition Reference to the CommandDefinition
  * @param {String} [customProgramPath = null] OptionalParameter for adding a customProgramPath to a program (null = no CustomPath)
  * @param {boolean} [exitable = true] OptionalParameter which controls if the program will be exitable
  * @param {Object} [customProgramParameters = {}] Object which contains custom Program Parameters (Default: Emtpy Object)
  **/
  constructor(programStartAlias, programDescription, programCommandDefinition, customProgramPath = null, exitable = true, customProgramParameters = {}){
    //Call command class constructor to save basic data
    super(programStartAlias, programDescription, programCommandDefinition);

    //Set default for overwriteCommandDefinition
    this.#executionReferenceOverwrite = null;

    //Check and save commandExececutionReference
    if(typeof programCommandDefinition !== "object" || !programCommandDefinition instanceof CommandDefinition){
         throw new TypeError("commandExececutionReference for a Program, needs to be an instace of CommandDefinition!");
    }
         //IF command is a program

         //Save custom path
         this.#customProgramPath = customProgramPath;

         //Add exit function to executionreference if program is exitable
         if(exitable){
           programCommandDefinition.addCommand("exit", "Exits the current Program", Program.#exitProgram);
         }
          //Get default Commands
          let defaultCommands = DefaultCommands.defaultCommandList;
          //Add all default Commands
          for(let i = 0; i < defaultCommands.length; i++){
         //Add All loaded Commands
         programCommandDefinition.addCommandObject(defaultCommands[i]);
       }


    //Save Custom Program Parameters
    this.#customProgramParameters = customProgramParameters;
    //Init init function
    this.#initFunctionReference = function() {};
    //Inti prexExitFunction
    this.#preExitFunctionReference = function() {};
  }

  /**
  *Checks if object is a program
  * @static
  * @param {Object} object Object to be checked
  * @param {Boolean} [errorThrow=false] Determines whether an automatic error is thrown
  * @return {Boolean} Returns true or false (if errorThrow = true: Exeption thrown insted of fall)
  * @throws {TypeError} Throws type error if errorThrow = true

  **/
  static isProgram(object, errorThrow = false){
    if(!(object instanceof Command)){
     if(errorThrow){
     throw new TypeError("Object needs to be of Type Command!");
     }

     //Check if programObject is a program
     if(!object.isProgram){
      if(errorThrow){
      throw new TypeError("Object needs to be a program!");
      }

      return false
     }

     return false;
    }

    return true;
  }

  /**
  * Sets a custom Parameter for the specified key and Value (existing Key values will be overidden!)
  * @param {String} key The Key for the custom Parameter
  * @param {*} value The Value of the optional Parameter (Can be of any type)
  **/
  setCustomParameter(key, value){
    this.#customProgramParameters[key] = value;
  }

  /**
  * Overwrites the current Command executionreference (only works if this command is a program)
  * @throws {TypeError}
  * @param {CommandDefinition} newProgramExecutionReference Reference to the new CommandDefintion which overwrites the old one
  **/
  overwriteCurrentexecutionReferenceForProgram(newProgramExecutionReference){
    if(!newProgramExecutionReference instanceof CommandDefinition){
      throw new TypeError("newProgramExecutionReference needs to be an instance of CommandDefinition!");
    }

    this.#executionReferenceOverwrite = newProgramExecutionReference;
  }

  /**
  * Resets the executionReference to its original State when the Program was created
  **/
  resetCurrentexecutionReferenceForProgram(){
    this.#executionReferenceOverwrite = null;
  }

    /**
     * Sets an Initialisation function, which will be called when the program is started
     * Function will be called with optional parameter containing the executing Console and optionalProgramParameters: function (executingConsole,optionalProgramParameters)!
     * @param {'function' | null} initFunctionReference reference to the function or null to set no init
     * @throws {TypeError}
     */
  addInitFunction(initFunctionReference){
      if(initFunctionReference == null){
        this.#initFunctionReference = function () {};
        return;
      }
      //Check if parameter is valid
    if(typeof initFunctionReference !== 'function'){
        throw new TypeError("Error: initFunctionReference needs to be of type 'function' or null!");
    }
    //If valid: store reference
    this.#initFunctionReference = initFunctionReference;
  }

    /**
     * Sets an Exit function to the program which will be executed along the exit command
     * Function will be called with optional parameter containing the executing Console and optionalProgramParameters: function (executingConsole,optionalProgramParameters)!
     * @param {'function' | null} preExitFunctionReference reference to the function or null to set no exit
     * @throws{TypeError}
     */
  addPreExitFunction(preExitFunctionReference){
      if(preExitFunctionReference === null){
        this.#preExitFunctionReference = function () {};
        return;
      }
      //Check if parameter is valid
      if(typeof preExitFunctionReference !== 'function'){
          throw new TypeError("Error: initFunctionReference needs to be of type 'function' or null!");
      }
      //If valid: store reference
      this.#preExitFunctionReference = preExitFunctionReference;
  }

  /** Function for exiting inside a program
   * @param {String} command command which has been put in the console
   * @param {InGameConsole} executingConsole console Object which the command has been executed on
   * @private
   * @static
   * @async
   **/
  static async #exitProgram(command, executingConsole){
    //Call close function of executing Console
    await executingConsole.closeCurrentProgram();
    return null;
  }

  /**
   * Returns a reference to the init function of the program
   * @return {'function'} reference to initFunction
   */
  get initFunction(){
    return this.#initFunctionReference;
  }

  /**
   * Returns a reference to the preExit function of the program
   * @return {'function'} reference to preExitFunction
   */
  get preExitFunction(){
    return this.#preExitFunctionReference;
  }

  /**
  * Return CommandCustom path as String or null if no one has been set
  * @return {String} CustomPath as String
  **/
  get customProgramPath(){
    //Return Program Path
    return this.#customProgramPath;
  }

  /**
  * Return if the command has a customProgramPath
  * @return {Boolean} if command has a customProgramPath or not
  **/
  get hasCustomProgramPath(){
    return this.#customProgramPath !== null;
  }

  /**
  * Returns the Optional Program parameter object
  * @return {Object} Optionalparameter-Object
  **/
  get optionalParameters(){
    //Return Optional Parameters
    return this.#customProgramParameters;
  }

  /**
  * Return the Reference to the executionInformation
  * @return {executionType} reference to function or Command Defintion for execution
  **/
  get executionReference(){
    //Return standard execution Reference if no overwrite is found
    if(this.#executionReferenceOverwrite == null){
      //Get execution reference from Command class
     return super.executionReference;
    }
    //Return overwrite Reference if one is set
    return this.#executionReferenceOverwrite;
  }
}

/**
* Class that holds all Command defintitions for a console
* @class
**/
class CommandDefinition{
//Array Collection of commands
#commandArray;

/**
* constructor
**/
constructor(){
  //init Arrays
   this.#commandArray = [];
}
/**
* Adds Command to Local Command definition or overides exising one
* @param {String} commandStartAlias Alias that the command will be started with in the console input
* @param {String} commandDescription A Description of the command (newline marked with /n)
* @param {executionType} executionReference A reference to the function or ProgramCommandDefinition that will be executed with this command
**/
addCommand(commandStartAlias, commandDescription, executionReference){
  //get existing alias commandIndex (or -1 if not exists)
  let existingCommandIndex = this.getCommandIndex(commandStartAlias);

  //Create a new command and add it to array
  var newCommand = new Command(commandStartAlias, commandDescription, executionReference);

  //Add or overide program if alias exists
  if(existingCommandIndex == -1){
    //add program to list
    this.#commandArray.push(newCommand);
  }else{
    //override program
    this.#commandArray[existingCommandIndex] = newCommand;
  }

}

/**
* Adds Command to Local Command definition or overwrites exising one
* @param {String} programStartAlias Alias that the command will be started with in the console input
* @param {String} programDescription A Description of the command (newline marked with /n)
* @param {executionType} programExecutionReference A reference to the function or ProgramCommandDefinition that will be executed with this command
* @param {String} [customProgramPath = null] OptionalParameter for adding a customProgramPath to a program (null = no CustomPath)
* @param {boolean} [exitable = true] OptionalParameter which controls if the program will be exitable
**/
addProgram(programStartAlias, programDescription, programExecutionReference, customProgramPath = null, exitable = true){
  //get existing alias commandIndex (or -1 if not exists)
  let existingCommandIndex = this.getCommandIndex(programStartAlias);

  //Create new program
  let newProgram = new Program(programStartAlias, programDescription, programExecutionReference, customProgramPath, exitable);

  //Add or overide program if alias exists
  if(existingCommandIndex == -1){
    //add program to list
    this.#commandArray.push(newProgram);
  }else{
    //override program
    this.#commandArray[existingCommandIndex] = newProgram;
  }

}

/**
* Adds Program Object to command list or overides existing one
* @param {Objekt:Command} programObject The command Object to be added
* @param {boolean} [exitable = true] OptionalParameter which controls if the program will be exitable
* @throws{TypeError}
**/
addProgramObject(programObject, exitable = true){
  //Check if programObject is program
  try{
  Program.isProgram(programObject, true);
  }catch(error){
  throw error;
  return;
  }
  //get existing alias commandIndex (or -1 if not exists)
  let existingCommandIndex = this.getCommandIndex(programObject.startAlias);

  //Add or overide program if alias exists
  if(existingCommandIndex == -1){
    //add program to list
    this.#commandArray.push(programObject);
  }else{
    //override program
    this.#commandArray[existingCommandIndex] = programObject;
  }
}

/**
* Adds Command Object to command List or overides existing one
* @param {Objekt:Command} commandObject The command Object to be added
* @throws {TypeError}
**/
addCommandObject(commandObject){
  //Check if programObject is program
  try{
  Command.isCommand(commandObject, true);
  }catch(error){
  throw error;
  return;
  }
  //get existing alias commandIndex (or -1 if not exists)
  let existingCommandIndex = this.getCommandIndex(commandObject.startAlias);

  //Add or overide program if alias exists
  if(existingCommandIndex == -1){
    //add program to list
    this.#commandArray.push(commandObject);
  }else{
    //override program
    this.#commandArray[existingCommandIndex] = commandObject;
  }

}

/**
* Clears all of the Commands out of the Command definition
**/
clearAllCommands(){
  this.#commandArray = [];
}

/**
*Removes a Command (Throws error if not found)
* @param {Number} commandIndex Index of the command that shall be removed
**/
removeCommand(commandIndex){
  //Remove Element if found
  var extractedElement = this.#commandArray.splice(1, commandIndex);

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
 let currentCommandStartAlias = command.split(" ")[0].trim().toLowerCase();

 //Search all commands
 for(var i = 0; i < this.#commandArray.length; i++){

    if(this.#commandArray[i].startAlias.toLowerCase() == currentCommandStartAlias){
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
  return this.#commandArray.length;
}

/**
* Functions returns Command Allias as String
* @param {int} commandIndex Index of the command which Alias shall be returned;
* @return {String} Alias to the requested Index or null if index doesnt exist
**/
getCommandAlias(commandIndex){
  if(commandIndex >= 0 && commandIndex < this.length){
      return this.#commandArray[commandIndex].startAlias;
  }
      //else
    	return null;
}

/**
* Functions returns Command or Program Object at index
* @param {int} commandIndex Index of the command which Alias shall be returned;
* @return {Command|Program} Command Object
**/
getCommandObject(commandIndex){
    if(commandIndex >= 0 && commandIndex < this.length){
      return this.#commandArray[commandIndex];
  }

    //else
    return null;
}

/**
* Returns the execution reference of an command
* @param {int} commandIndex Index of the command
* @return {executionType} ExecutionRefernce to the requested Index or null if index doesnt exist
**/
getexecutionReference(commandIndex){
  if(commandIndex >= 0 && commandIndex < this.length){
    return this.#commandArray[commandIndex].executionReference;
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
    var descriptionArray = this.#commandArray[commandIndex].description.split("\n");

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
      return this.#commandArray[commandIndex].description.split("\n")[0];
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

    if(this.#commandArray[i].startAlias.toLowerCase().startsWith(commandStart)){
      fittingCommandArray.push(this.#commandArray[i].startAlias);
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
  return this.#commandArray[commandIndex].isProgram;
}

/**
* Function that executes the a Command Based on their Alias.
* @async
* @param {String} command Command for the Command which function should be executed
* @param {InGameConsole} executingConsole The Console which the Command is being executed
* @param {Object} optionalProgramParameters Object which holds all OptionalParameters of the current programm
* @return {Promise(String[])} Answer Array which each line as seperate, NULL if not successfull inside of a Promise
**/
async executeCommandFunction(command, executingConsole, optionalProgramParameters){
let commandIndex = this.getCommandIndex(command);
//If Command not found then return null
if(commandIndex == -1){
 return null;
}

//Execute Execution Reference and parse Promise if neccessary
let commandResponse = await this.#commandArray[commandIndex].executionReference(command, executingConsole);

if(commandResponse == null){
 //Return empty response Array
 let emptyResponseArray = [];
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
* @class
*/
class CommandProcessor{
//Current command Answer variable
#currentCommandAnswer;
//current Command
#currentCommand;
//Current CommandDefinition
#commandDefinition;
//executingConsole
#executingConsole;
//Variable with optional ProgramParameterData
#optionalProgramParameters;

/**
* Constructor of class
* @param {String} command Command that shall be processed
* @param {InGameConsole} executingConsole Reference to the Console which is executing the command
**/
constructor(command, executingConsole){
  //Save Command to Datafield
 this.#currentCommand = command.toLowerCase().trim();
 //Standard init CommandAnswer
 this.#currentCommandAnswer = null;
 //Set commandDefinition Reference
 this.#commandDefinition = executingConsole.currentActiveCommandDefinition;
 //Save executing console reference
 this.#executingConsole = executingConsole;
 //Save optional Program Parameters if exist
 if(executingConsole.currentActiveProgram != null){
 this.#optionalProgramParameters = executingConsole.currentActiveProgram.optionalParameters;
  }
 //Else: Save empty Paramters
 this.#optionalProgramParameters = {};
}

/**
* Processes Current saved command through searching it in commandDefinition
* @async
* @return {Promises} A Promise which is completed once the function finishes running
**/
async processCommand(){
  //Wait for fullfill of promise
  let currentCommandResponse = await this.#commandDefinition.executeCommandFunction(this.#currentCommand, this.#executingConsole, this.#optionalProgramParameters);
      //Check if Command exists local
      if(currentCommandResponse != null) {
        //If he does exist
         //Check if Command send Response
         if(currentCommandResponse.length != 0){
           this.#currentCommandAnswer = currentCommandResponse;
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
    return this.#currentCommandAnswer;
}

}
