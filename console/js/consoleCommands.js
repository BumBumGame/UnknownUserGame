/**
* Stores all the available programs which can be added to consoles
* All programes can be accessed through their start alias as key for the array
* @class
 * @static
**/
class ProgramCollection{
    //Assoziative Array which contains all program Objects
    static #programList = [];
    //saves size
    static #collectionSize = 0;

  /**
  * Adds a new program to the Collection
  @param {Program} programObject the Object of the new program
  **/
  static addProgramToCollection(programObject){
    //Check if new program is a program
    try {
      Program.isProgram(programObject, true);

      //add program to collection
      this.#programList[programObject.startAlias] = programObject;
      //count up size
        this.#collectionSize++;
    } catch (e) {
      console.log(e);
    }

  }

  /**
  * Returns the program corresponding to the Alias or null if not found
  * @param {String} programAlias Alias of the program
  * @return {Program|null} Programobject or null if not found
  **/
  static getProgram(programAlias){
      //Check if program exists
    if(!this.programExists(programAlias)){
        return null;
    }

    //If exists: return program
      return this.#programList[programAlias];
  }

  /**
  * Removes program with corresponding programAlias from Collection (if existing)
  * @param {String} programAlias Alias of the program to be removed
  **/
  static removeProgram(programAlias){
      if(this.programExists(programAlias)){
          //delete from main list
         delete this.#programList[programAlias];
         //cout down size
          this.#collectionSize--;
      }
  }

  /**
  * Returns the complete program list
  * @return {Object} Programs in assioative array with their alias as key
  **/
  static get wholeProgramCollection(){
    return this.#programList;
  }

    /**
     * Returns the complete program list as an interative array
     * @return {Array} Programs in normal array
     **/
    static get wholeProgramCollectionAsArray(){
        let tmpArray = [];
        for(let key in this.#programList){
            tmpArray.push(this.#programList[key]);
        }
        return tmpArray;
    }

  /**
  * Returns the length of the Collection
   * @return {Number} size of the Collection
  **/
  static get length(){
    return this.#collectionSize;
  }

    /**
     * Checks whether a program exists inside of the Collection
     * @param {String} programAlias Alias of the program
     * @return {Boolean} True: Program Exists, False: it doesnt
     */
  static programExists(programAlias){
      return typeof this.#programList[programAlias] !== undefined;
  }

}


/**
* Functions for CommandExecution (Return null if no out to the console is needed) (Return Array of Strings for Answer: Each element = one line)
* Each Method will automatically get 2 Parameters assgined to it: command(Contains the complete inputted Command as String), executingConsole(contains a reference to the consoleObject of the console eecuting the function)
* Example: functionName(command, executingConsole){}
**/
//-----Communicator Program-----------------------------

{
let communicatorCommandDefinition = new CommandDefinition();

//----------
//Report new messages Command
//---------
async function reportNewMessages(command, executingConsole){
  //load communicator Module
  let communicatorModule = await import("./modules/communicatorProgram.js");

  //Get all active ChatNames
  let activeChatNames = communicatorModule.getActiveChatNames();

  //Define Output String Array
  let output = [];

  //Check if a new message is availalbe in any active Chat
  for(let i = 0; i < activeChatNames.length; i++){

  if(await communicatorModule.isNewMessageAvailable(activeChatNames[i])){
    output.push("Neue Nachrichten in Chat '" + activeChatNames[i] + "' !");
  }

  }

  //Return output Array or No new Messages found if empty
  return output.length == 0 ? "Keine neuen Nachrichten verfügbar!" : output;
}

//Add check newMessage Method as a command
communicatorCommandDefinition.addCommand("Check", "Dieser Befehl überprüft, ob neue Nachrichten verfügbar sind. \n"
                                        + "Neue Chats mit Nachrichten werden mit ihrem Namen aufgelistet.", reportNewMessages);
//------------

//------------------------------------------------------------
//Subprograms

//Chat program-----------------------------------------------
let openChatProgramCommands = new CommandDefinition();

//---------Open ChatsubProgram Command
async function openChat(command, executingConsole){
 //Split incoming Command into Section differented by a whitespace
 let splittedCommand = command.split(" ");
 //Check if a chatName is given
 if(splittedCommand.length < 2){
   return "Error: Got no Chatname!";
 }
 //read first parameter (second whitespace) if given
 let chatName = splittedCommand[1].trim();
 //load Communicator Module
 let communicatorModule = await import("./modules/communicatorProgram.js");
 //Check whether ChatName is active
 if(!communicatorModule.chatNameIsActive(chatName)){
   return "Error: Chat not found!";
 }

 //If chatname exists:
 //Load Chatlog
 let chatLog = await communicatorModule.getChatLog(chatName);

 //print Chatlog onto Console
 for(let i = 0; i < chatLog.length; i++){
   executingConsole.printOnConsole(chatLog[i][0], communicatorModule.getClassNameToMessageType(chatLog[i][1]));
 }

 //Start new programm on the executing Console with the Chatname as title
  let newProgram = new Program("Chat:" + chatName, "", openChatProgramCommands);
 executingConsole.startCustomProgramWithObject(newProgram);
 //Add a PreExit Function to kill check interval after ending
 executingConsole.currentActiveProgram.addPreExitFunction(function(consoleObject, optionalParameters) {
     clearInterval(optionalParameters["checkIntervalReference"]);
 });

 //Create synced temp function for Message check
 let checkForNewMessage = function () {
   //Create temp async function to be waited for
   communicatorModule.isNewMessageAvailable(chatName).then(function (result) {
     //Set store variables
     let latestMessage;
     let latestMessageType;
     //if available load new Message
     if(result) {
       //Load new Message
       communicatorModule.getLatestMessage(chatName).then(function (result) {
         latestMessage = result;
         //After Message:
         //Load Message Type:
         communicatorModule.getCurrentMessageType(chatName).then(function (result) {
           latestMessageType = result;
           //Print Message on Console
           executingConsole.printOnConsole(latestMessage, communicatorModule.getClassNameToMessageType(latestMessageType));
         });
       });
     }
   });
 }

 //Start Interval for check funtion and add the reference to the program
 newProgram.setCustomParameter("checkIntervalReference", setInterval(checkForNewMessage, 1000));

}

communicatorCommandDefinition.addCommand("openChat", "Opens chosen chat. \n \n"
                                          + "Syntax: \n"
                                          + "openChat [chatName] \n"
                                          + "\n"
                                          + "Prints the complete Chatlog in the Console and predicts the answers that you might want to give, to ensure that you can hold an informative and professional Conversation!",
                                          openChat);


//-----------------------------------------------------------

//Create Communicator Program and add it to Program Collection
ProgramCollection.addProgramToCollection(new Program("Communicator", "Ein Programm, dass die Kommunikation über das System möglich macht.", communicatorCommandDefinition));
}
//---------------------------------------------------
