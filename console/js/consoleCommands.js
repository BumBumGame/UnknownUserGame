/**
* Functions for CommandExecution (Return null if no out to the console is needed) (Return Array of Strings for Answer: Each element = one line)
* Each Method will automatically get 2 Parameters assgined to it: command(Contains the complete inputted Command as String), executingConsole(contains a reference to the consoleObject of the console eecuting the function)
* Example: functionName(command, executingConsole){}
**/
//-----Communicator Program-------

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

 //Create variable for reference to the interval which checks for new messages in a chat
 //(will be stopped as soon as Chat is closed)
 let newMessageCheckInterval;

 //Start new programm on the executing Console with the Chatname as title
 executingConsole.startCustomProgram("Chat: " + chatName, openChatProgramCommands, null, true, {checkInterval: newMessageCheckInterval});

 //Create synced temp function for Message check
 let checkForNewMessage = function () {
   //Create temp async function to be waited for
   communicatorModule.isNewMessageAvailable(chatName).then(function (result) {
     //TEMP: Log
     console.log("check");
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

 //Start Interval for check funtion
 newMessageCheckInterval = setInterval(checkForNewMessage, 1000);

 /**--Old Intveral Version----
 //Start Message check Interval
 newMessageCheckInterval = setInterval(async function () {
    //Check if new Message is available
    if(await communicatorModule.isNewMessageAvailable(chatName)){
      //TRUE: Print latest Message
      //get latest Message and Type:
      let latestMessage = await communicatorModule.getLatestMessage(chatName);
      let latestMessageType = await communicatorModule.getCurrentMessageType(chatName);
      //Print Message
      executingConsole.printOnConsole(latestMessage, communicatorModule.getClassNameToMessageType(latestMessageType));
    }//FALSE: Do nothing

 }, 1000);
 **/

}

communicatorCommandDefinition.addCommand("openChat", "Opens chosen chat. \n \n"
                                          + "Syntax: \n"
                                          + "openChat [chatName] \n"
                                          + "\n"
                                          + "Prints the complete Chatlog in the Console and predicts the answers that you might want to give, to ensure that you can hold an informative and professional Conversation!",
                                          openChat);


//-----------------------------------------------------------

//Create Communicator Program
var communicatorProgram = new Command("Communicator", "Ein Programm, dass die Kommunikation über das System möglich macht.", true, communicatorCommandDefinition);
}
//--------------------------------
