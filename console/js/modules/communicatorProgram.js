/**
* Communicator module (uses server Connection as default, can be set to use a local xml file)
* Used to parse the content of a chat xmlFile
* @module Communicator
**/

//Load asnyLoaderModule
import * as asyncLoader from "./asyncLoader.js";

//Global Variable which stores all the active chatNames
var activeChatNames = [];

//Global Module variable for xmlFile (null if on online mode)
var xmlFile = null;

//Global Variable for saving OfflineXML Conditions
var offlineXMLConditions = [];
const multipleConditionDivider = ','

//Global Variables which hold the current xmlParser Position
var currentParserBranchPosition = []; //Holds the indexes of which branches were taken as an Array (each level is a new index)
var currentParserMessagePosition = -1; //Index of the current Message inside the branch

var awaitingQuestionReply = false; //Variable holds the Satus after a question has been read

var offlineChatReachedEnd = false; //Varialbe holds the Status if a Conversation has reached its end

var latestMassageType = null;

//Variable witch contains the information about what answers have been chosen
var offlineResponseTracker = [];
//Message Type Constants---------
/**
* Defines a Statement send out by the communicatorProgram
* @constant
* @type{Number}
* @default 0
**/
export const MESSAGER_STATEMENT = 0;
/**
* Defines a Warning Message send by the communicatorProgram
* @constant
* @type{Number}
* @default 3
**/
export const MESSAGER_WARNING = 3;
/**
* Defines a Question from the Chat-Contact which needs to be answered by the user
* @constant
* @type{Number}
* @default 1
**/
export const QUESTION = 1;
/**
* Defines a Message send from the Chat-Contact
* @constant
* @type{Number}
* @default 2
**/
export const MESSAGE = 2;
/**
* Defines a response given by the User
* @constant
* @type{Number}
* @default 4
**/
export const RESPONSE = 4;
//------------------------------

/**
* This Function request the latest Message in a specific Chat or the offlineXml Chat and automatically goes to next one if available
* Note: This is supposed to be the main function for getting new Messages. It handles all conditions and chooses the first matching options automatically
* @param {String} chatName The Name of the chat (a.e filename) - If an offlineXml is loaded this Parameter does not have any effect
* @return {String|null} Next newest unread message or the last read one if no new ones are available (or null if no message can be read)
**/
export async function getLatestMessage(chatName){

  //Check if offline xml is loaded
  if(isInOfflineMode()){

    //load latest Message from offline XML
    //Check if new message is available
    if (!isNewMessageAvailable(chatName)) {
      //Repeat old Message (if exist)
        if(currentParserBranchPosition.length == 0 && currentParserMessagePosition == -1){
        return null;
      }

    //check if end of branch has been reached and there are no more branches
      if(endOfCurrentOfflineBranchReached()){
        let branchOptions = getCurrentOfflineBranchOptions();
        if(branchOptions.length == 0){
          offlineChatReachedEnd = true;
        }

      }

      //Repeat current Message
      return getCurrentParserOfflineXMLMessageContent();
    }

    //else:

    currentParserMessagePosition++;
    //Get Next message
    let nextMessage = getCurrentParserOfflineXMLMessage();
    //Get Content from Message to improve performance
    let nextMessageXMLContent = nextMessage.querySelectorAll(':scope > messageContent')[0].textContent.trim();

    //Save latest message Type
    latestMassageType = getCurrentOfflineParserMessageType();

    //Check if current message is a question
    if(latestMassageType == QUESTION){
      	//set to awaiting question answer mode
        awaitingQuestionReply = true;
    }

    //Check if a new condition has to be set
    offlineXMLParseElementsSetAttributes(nextMessage);


    //Check if end of current branch has been reached
    if(endOfCurrentOfflineBranchReached()){
      //Switch to next Branch if possible
      let currentOfflineBranchOption = getCurrentFirstConditionMatchingBranchIndex();

      if(currentOfflineBranchOption != null){
        addNextBranchToParser(currentOfflineBranchOption);
      }
    }

    //return next message
    return nextMessageXMLContent;

  }else{
    //request latest message from Server for chatName
  }

}

/**
* Request the type of the last message that has been request through getLatestMessage()
* @param {String} chatName The Name of the chat (a.e filename) - If an offlineXml is loaded this Parameter does not have any effect
* @return {Number|null} Returns Message Type id as referenced by constant or null if no message can be referenced
**/
export async function getCurrentMessageType(chatName){
   return latestMassageType;
}

/**
* Checks wether there is a new method available to read on the current Path
* @param {String} chatName The Name of the chat (a.e filename) - If an offlineXml is loaded this Parameter does not have any effect
* @return {Boolean} Returns true or false whether a new Message is available on the given Chat
**/
export async function isNewMessageAvailable(chatName){
  //Check if Module is awaiting a question Answer
  if(awaitingQuestionReply){
    return false;
  }

  //Check if offline xml is loaded
  if(isInOfflineMode()){
    //Check if end of branch is reached
    if(endOfCurrentOfflineBranchReached()){
      return false;
    }

    //Check Offline XML
    let currentBranch = getCurrentOfflineBranch();
    let currentMessages = currentBranch.querySelectorAll(':scope > communicatorChatMessage');

    //else Check if condition for next message is met and return status
    return offlineXMLelementsConditionsMatched(currentMessages[currentParserMessagePosition + 1]);
  }else{
    //Check on Server
  }

}

/**
* Gets all answer Options for current Question
* @param {String} chatName The Name of the chat (a.e filename) - If an offlineXml is loaded this Parameter does not have any effect
* @return {String[][]|null} 2dim String Array with each entry containing the answer id as the first index and the answer TextContent as the second
**/
export async function getCurrentAnswerOptionsAsString(chatName){
  //Return null if not awaiting Question Replay
  if(!awaitingQuestionReply){
    return null;
  }

if(isInOfflineMode()){
  //Get Answer Options from offline Parser and return them
  return getCurrentOfflineAnswerOptionsAsString();

}else{
  //Get Answer from Server
}

}

/**
* send answer to current Question (Doesnt have any effect if no question is active)
* @param {String} chatName The Name of the chat (a.e filename) - If an offlineXml is loaded this Parameter does not have any effect
* @param {Number} answerIndex Index of the chosen Answer (Same index as in output array)
**/
export function sendCurrentQuestionAnswer(chatName, answerIndex){

//Check for offline or Online Mode
if(isInOfflineMode()){

//Only do stuff if awaiting a reply
if(!awaitingQuestionReply){
  return;
}

//Get Current answer possiblitys
let currentAnswerOptions = getCurrentOfflineAnswerOptions();

//Check if answer index is valid
if(typeof currentAnswerOptions[answerIndex] === "undefined"){
  throw new Error("Error: Answer Index doe not exist!");
}

//Parse the chosen Answer
let chosenAnswer = currentAnswerOptions[answerIndex];

//Check if all conditions for the chosen Answer are Matched (if not leave function)
if(!offlineXMLelementsConditionsMatched(chosenAnswer)){
      throw new Error("Error: Not all condition for chosen Answer are Matched!");
}

//Parse set instructions of chosen Answer
offlineXMLParseElementsSetAttributes(chosenAnswer);

//Save chosen Answer in Tracker
offlineResponseTracker.push(answerIndex);

//Set Question status to answered
awaitingQuestionReply = false;

//Parse a possible jumpToBranch Attribute
let jumpToBranchAttribute = chosenAnswer.getAttribute("jumpToBranch");
let jumpToBranchNameAttribute = chosenAnswer.getAttribute("jumpToBranchName");

//get currentBranch Options to check index and find BranchName
let branchOptions = getCurrentOfflineBranchOptions();

//Try branchId Jump first
if(jumpToBranchAttribute != null){
  //parse parserIndex
  let newBranchIndex = parseInt(jumpToBranchAttribute);

  //Check if index is valid (else throw error)
  if(newBranchIndex < 0 || newBranchIndex >= branchOptions.length){
    throw new Error("Branch to jump to does not exist!");
  }

  //Set Parser to new branch Position
  addNextBranchToParser(newBranchIndex);
  //leave
  return;
}

//Try branchName
if (jumpToBranchNameAttribute != null) {
  //Check available Branches for name
  for(let i = 0; i < branchOptions.length; i++){
    let branchNameAttribute = branchOptions[i].getAttribute("name");

    //Continue if attribute doesnt exist on branch
    if(branchNameAttribute == null){
      continue;
    }

    //else check if Branchname is equal
    if(branchNameAttribute.trim() == jumpToBranchNameAttribute.trim()){
      //Set Parser to branch and break
      addNextBranchToParser(i);
      break;
    }

  }
}

}else{
  //send Request to Server
}

}

/**
* Returns the complete Chatlog messages with their corresponding types
* @async
* @param {String} chatName The Name of the chat (a.e filename) - If an offlineXml is loaded this Parameter does not have any effect
* @return {String[][]} Array witch contains each message as an Index: String[][0] = Message; String[][1] = MessageType (Integer)
**/
export async function getChatLog(chatname){
  if(isInOfflineMode()){
    //create empty ouput array
    let output = [];
    //Save old parser
    let oldParserData = currentParserBranchPosition;
    //Overwrite current parser and simulate a new go through by using the saved answers
    currentParserBranchPosition = [];
    //Start simulation
    //create counter
    let i = 0;
    //create counter for questions
    let questionCounter = 0;
    //Loop until no new messages are found
    while(isNewMessageAvailable()){
      //Add current Message to output array
      output[i] = [getLatestMessage(), getCurrentMessageType()];

      //Check whether questions answer needs to be send
      if(output[i][1] == QUESTION){
        //Send saved Answer from Buffer
        sendCurrentQuestionAnswer("", offlineResponseTracker[questionCounter]);
        //Save Response as next Element of output
        i++;
        output[i] = [offlineResponseTracker[questionCounter], RESPONSE];
        //add to questionCounter
        questionCounter++;
      }
      //Add to counter
      i++;
    }

    //reset actual parser
    currentParserBranchPosition = oldParserData;
    //Return answers
    return output;
    }else{
      //Request data from Server
  }
}

/**
* Generates css classnames for each Message type
* @param {Number} msgType Type of the Message which the className shall be returned to
* @return {String} className to the msgType or null if messageType invalid
**/
export function getClassNameToMessageType(msgType){
  let classNamePrefix = "Communicator_";

  switch(msgType){
    case 0:
      return classNamePrefix + "Messager_Statement";
    case 1:
      return classNamePrefix + "Question";
    case 2:
      return classNamePrefix + "Message";
    case 3:
      return classNamePrefix + "Messager_Warning";
    case 4:
      return classNamePrefix + "Response";
    default:
      return null;
  }
}

/**
* Downloads the xml on the path and sets the module into offline mode with downloaded xml
* @async
* @param {String} pathToXML Path to the xml File to be used
* @return {Boolean} true if load was successfull | false if it failed
**/
export async function setOfflineXML(pathToXML){
  //reserver Variable
  let loadedXmlFile;

  //Try to load xml File
  try{
   loadedXmlFile = await asyncLoader.loadFileFromServerAsXml(pathToXML);
}catch(error){
  //If file cannot be loaded then print error and leave function
  console.log(error.message);
  //return false
  return false;
}
  //If File was loaded successfully:

  //Reset values of last xml
  offlineXMLConditions = [];
  currentParserBranchPosition = [];
  currentParserMessagePosition = -1;

  //Save xml in variable
  xmlFile = loadedXmlFile;

  //Set first brach
  if(currentParserBranchPosition.length == 0){
    let newBranchIndex = getCurrentFirstConditionMatchingBranchIndex();
    //If not possible:
    if(newBranchIndex == null){
     throw new Error("No First Branch found!")
    }
    //else
    addNextBranchToParser(newBranchIndex);
  }

  //return true
  return true;
}

/**
* Function that returns the offlineXml File or null if Communicator is in online Mode
* @return {XMLDocument|null} Current active offlineXml or null if in online Mode
**/
export function getOfflineXML(){
  return xmlFile;
}

/**
* Sets communicator back into online Mode. Clears all offlineXML Data!
**/
export function setToOnlineMode(){
  xmlFile = null;
  offlineXMLConditions = [];
  currentParserBranchPosition = [];
  currentParserMessagePosition = -1;
}

/**
* Checks if Communicator is in offline Mode or not
* @return {boolean} Communicator is in OfflineMode or not
**/
export function isInOfflineMode(){
   return xmlFile == null ? false : true;
}

/**
* Returns all Current active Chatnames
* @return {String[]} String array with all current Chatnames
**/
export function getActiveChatNames(){
  //If in Offline Mode only return current loaded chatname
  if(isInOfflineMode()){
    return [getCurrentOfflineXMLChatName()];
  }
  //else
  return activeChatNames;
}

/**
* Checks if a current chatName is active
* @param {String} chatName The Name of the chat
* @return {boolean} True or false whether the ChatName is active or not
**/
export function chatNameIsActive(chatName){
return activeChatNames.includes(chatName);
}


//---------------------------------------------------
//Parser
//---------------------------------------------------

//---Offline-----
/**
* Returns the chatname of the currently loaded xml File
* @return {String|null} Chatname of current xmlFile or null if not in Offline Mode
**/
function getCurrentOfflineXMLChatName(){
  if(!isInOfflineMode()){
    return null;
  }

  return xmlFile.getElementsByTagName("communicatorChat")[0].getAttribute("chatName");
}

/**
* Checks if the end of the current Offline Branch has been reached
* @return {Boolean|null} Returns null if in Online Mode and true or false wheter endOffCurrentofflineBRanch is reached
**/
function endOfCurrentOfflineBranchReached(){
  if(!isInOfflineMode()){
    return null;
  }

  let currentBranch = getCurrentOfflineBranch();

  if(currentBranch.querySelectorAll(':scope > communicatorChatMessage')[currentParserMessagePosition + 1] !== undefined){
    return false;
  }

  //else
    return true;
}

/**
* Gets all answer Options for current Question
* @return {DOM-Element[]|null} String Array with each index being one answer or null if no question is currently active
**/
function getCurrentOfflineAnswerOptions(){
  if(!awaitingQuestionReply){
    return null;
  }

if(isInOfflineMode()){
  //Get Answer Options from offline Parser
  let currentMessage = getCurrentParserOfflineXMLMessage();

  return currentMessage.querySelectorAll(':scope > Answer');
}

return null;
}

/**
* Gets all answer Options for current Question
* @return {String[][]|null} 2dim String Array first Index of each entry holds the index of the answer, second entry the text Value of the Answer
**/
function getCurrentOfflineAnswerOptionsAsString(){
  let answerTags = getCurrentOfflineAnswerOptions();
  let stringAnswers = [];

  for(let i = 0; i < answerTags.length; i++){
    //Add Answer to output if all conditions are matched or else add null
    if(offlineXMLelementsConditionsMatched(answerTags[i])){
    stringAnswers.push(answerTags[i].textContent.trim());
    }else{
    stringAnswers.push(null);
    }
  }

  //Parse data into 2dim Array
  let outputArray = [];

  for(let i = 0; i < stringAnswers.length; i++){
    if(stringAnswers[i] != null){
      outputArray.push([i, stringAnswers[i]]);
    }

  }

  return outputArray;
}

/**
* Returns Neweset Message of the offline XML
* @return {DOM-Element|null} Returns the newest Message as Dom-Element or null if in online Mode
**/
function getCurrentParserOfflineXMLMessage(){
  //if in online Mode return null
  if(!isInOfflineMode()){
    return null;
  }

  //Parse to latest Message

  //Get Current branch
  let currentBranch = getCurrentOfflineBranch();
  //PROBLEM WITH MESSAGEPOSITION -1 : NEEDS TO BE SOLVED
  //Check if current branch has message
  if(currentParserMessagePosition > -1 && currentParserBranchPosition.length > 0){
  //Get latest Message of that branch and return it
  return currentBranch.querySelectorAll(':scope > communicatorChatMessage')[currentParserMessagePosition];
}else{
  //Get the last message of previous branch
  let currentTempBranchParser = currentParserBranchPosition.slice();
  //Remove last element from tempParser
  currentTempBranchParser.pop();
  let previousBranch = getOfflineBranch(currentTempBranchParser);
  let previousMessages = previousBranch.querySelectorAll(':scope > communicatorChatMessage');
  return previousMessages[previousMessages.length - 1];
}

}

/**
* Sets parser to the next branch Index (Warning: It will not be checked if the Index exists!)
* @param {Number} branchIndex Index of the new branch to go to
**/
function addNextBranchToParser(branchIndex){
  //Set Parser to new branch Position
  currentParserBranchPosition.push(branchIndex);
  //Set Message Parser to -1 (start of branch)
  currentParserMessagePosition = -1;
}

/**
* Returns Neweset Message Content of the offline XML
* @return {String|null} Returns the newest Message as String or null if in online Mode
**/
function getCurrentParserOfflineXMLMessageContent(){
//Get current Message element
let currentMessage = getCurrentParserOfflineXMLMessage();
//if null return null
if(currentMessage == null){
  return null;
}

//Parse Message Content and return it
return currentMessage.querySelectorAll(':scope > messageContent')[0].textContent.trim();
}

/**
* Method which returns the message type of the current offline Parser
* @return {Number|null} Number which represents the type of the message or null if in Online Mode
**/
function getCurrentOfflineParserMessageType(){
  //if in online Mode return null
  if(!isInOfflineMode()){
    return null;
  }

  //get current Branch
  let currentBranch = getCurrentOfflineBranch();
  //Return null if branch doesnt exist
  if(currentBranch == null){return null;}

  //get Message
  let message = currentBranch.querySelectorAll(':scope > communicatorChatMessage')[currentParserMessagePosition];
  //return null if massage doesnt exist
  if(message == null){return null;}

  let type = message.getAttribute("type");

  switch(type != null ? type.toLowerCase().trim() : 0){
      case "question":
          return QUESTION;
        break;

      case "messagerstatement":
          return MESSAGER_STATEMENT;
        break;

      case "messagerwarning":
          return MESSAGER_WARNING;
      break;

      case "message":
          return MESSAGE;
        break;

      default:
          return MESSAGE;
        break;
  }
}


/**
* Returns all new branch options of the current offline branch as a NodeList (or null if none exist)
* @return {NodeList|null} Returns branchoptions as Nodelist or null if in onlineMode
**/
function getCurrentOfflineBranchOptions(){
//if in online Mode return null
if(!isInOfflineMode()){
  return null;
}

//get Current Branch value
let currentBranch = getCurrentOfflineBranch();
let branchOptions;

//get all options of the xmlFile if no branch is active
if(currentBranch == null){
  branchOptions = xmlFile.querySelectorAll(':scope > branch');
}else{
//get all branch ELements in the Scope of the current branch
  branchOptions = currentBranch.querySelectorAll(':scope > branch');
}

//Return branch options or null if no are found
if(branchOptions == null){
  return [];
}

//else
return branchOptions;

}

/**
* Returns the branch the parser is currently in or null if no branch has been chosen at the beginning of the chat
* @return {DOM-Element|null} Null if there is no active branch, onlineModeActive,branch is not found or the xmlElement of the branch
**/
function getCurrentOfflineBranch(){
  //return branch
  return getOfflineBranch(currentParserBranchPosition);
}

/**
* Returns the branch at the chosen parser and returns it or null if branch doesnt exist
* @param {Number[]} branchParserPosition The Parser-PositionArray at which the branch is
* @return {DOM-Element|null} Null if there is no active branch, onlineModeActive,branch is not found or the xmlElement of the branch
**/
function getOfflineBranch(branchParserPosition){
  if(branchParserPosition.length == 0 || !isInOfflineMode()) {
    return null;
  }

  let currentBranchContext = xmlFile.querySelectorAll(':scope > branch')[branchParserPosition[0]];
  for(let i = 1; i < branchParserPosition.length; i++){
    currentBranchContext = currentBranchContext.querySelectorAll(':scope > branch')[branchParserPosition[i]];
    //If branch cannot be found return null
    if(currentBranchContext == null){return null;}
   }

  //return branch
  return currentBranchContext;
}

/**
* Function returns the first new available branch of which all conditions have been fullfilled (or null if none was found)
* @return {Number|null} Index of the fitting Branch inside the current active Branch or null if none are available or found
**/
function getCurrentFirstConditionMatchingBranchIndex(){
  //if in online Mode return null
  if(!isInOfflineMode()){
    return null;
  }

  //get and temporaly store all optional subBranches if new options are available
  if(newBranchesAvailable()){
  let currentOfflineBranchOptions = getCurrentOfflineBranchOptions();

  //Check conditions for each Branch and return the first branch which matches
  for(let i = 0; i < currentOfflineBranchOptions.length; i++){

      if(offlineXMLelementsConditionsMatched(currentOfflineBranchOptions[i])){
        return i;
      }

  }

  //If here: No Branches had matching conditions --> Return null
  return null;

}else{
  //else: Return null
  return null;
}


}

/**
* Returns the State of the condition. Returns false if the condition is not found
* @param {String} conditionName Name of the condition
* @return {Boolean} value of the Condition. False if none found
**/
function getOfflineConditionState(conditionName){
  //Check if condition exits
  if(typeof offlineXMLConditions[conditionName] === "undefined"){
    //default return false
    return false;
  }

  //return condition Value
  return offlineXMLConditions[conditionName];
}

/**
* Method checks a Dom-Elements condition attributes and returns if all conditions are matched or not
* @param {Dom-Element} domElement Dom-Element which Condition Attributes shall be checked
* @return {Boolean} True or false whether all Conditions are met or not
**/
function offlineXMLelementsConditionsMatched(domElement){
  //get currentBranch checkConditions
  let currentCheckCondition = domElement.getAttribute("checkCondition");
  //get currentBranch checkNotConditions
  let currentCheckNotCondition = domElement.getAttribute("checkNotCondition");

  //Check if any condition were found
  if(currentCheckCondition == null && currentCheckNotCondition == null){
    return true;
  }

    //Check true Conditions (if neccessary)
      if(currentCheckCondition != null){
        let currentCheckConditionArray = currentCheckCondition.trim().split(multipleConditionDivider);

    for(let a = 0; a < currentCheckConditionArray.length; a++){
      if(!getOfflineConditionState(currentCheckConditionArray[a])){
        //If one not matching Condition found return false
        return false;
      }
    }
  }

      //Check false Conditions (if neccessary)
        if(currentCheckNotCondition != null){
          let currentCheckNotConditionArray = currentCheckNotCondition.trim().split(multipleConditionDivider);

      for(let a = 0; a < currentCheckNotConditionArray.length; a++){
        if(getOfflineConditionState(currentCheckNotConditionArray[a])){
          //If one not matching Condition found return false
          return false;
        }
      }
    }

    //If element fits all conditions return true
    return true;
}

/**
* Method parses all setCondition Attributes of the Element and save them offline
* @param {Dom-Element} domElement Dom-Element of which the set-Attributes shall be processed
**/
function offlineXMLParseElementsSetAttributes(domElement){
  //Check if a new condition has to be set
  let setConditionAttribute = domElement.getAttribute("setCondition");
  let setNotConditionAttribute = domElement.getAttribute("setNotCondition");

  if(setConditionAttribute != null){
    //set true conditions and parse them
    let setConditionArray = setConditionAttribute.trim().split(multipleConditionDivider);
    for(let i = 0; i < setConditionArray.length; i++){
        setOfflineConditionState(setConditionArray[i].trim(), true);
    }
  }

  if(setNotConditionAttribute != null){
    let setNotConditionArray = setNotConditionAttribute.trim().split(multipleConditionDivider);
    for(let i = 0; i < setNotConditionArray.length; i++){
        setOfflineConditionState(setNotConditionArray[i].trim(),false);
    }
  }
}

/**
* Adds a offlineConditionState or sets the value of an existing one
* @param {String} conditionName the referecne Name of the condition to be set
* @param {Boolean} conditionValue The value(true|false) which the condition will be set to
**/
function setOfflineConditionState(conditionName, conditionValue){
    //set condition
    offlineXMLConditions[conditionName] = conditionValue;
}

/**
* Returns bool if new branches inside of the current Branch are available or if we have reached the end of the chat
* @return {Boolean} True if newBranches are available
**/
function newBranchesAvailable(){
  let currentOptions = getCurrentOfflineBranchOptions();

  if(currentOptions == null || currentOptions.length == 0){
    return false;
  }

  //else
  return true;
}

//-----Online-----
