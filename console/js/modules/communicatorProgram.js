/**
* Communicator module (uses server Connection as default, can be set to use a local xml file)
* @module Communicator
**/

//Load asnyLoaderModule
import * as asyncLoader from "./asyncLoader.js";

//Global Module variable for xmlFile (null if on online mode)
var xmlFile = null;

//Global Variable for saving OfflineXML Conditions
var offlineXMLConditions = [];

//Global Variables which hold the current xmlParser Position
var currentParserBranchPosition = []; //Holds the indexes of which branches were taken as an Array (each level is a new index)
var currentParserMessagePosition = -1; //Index of the current Message inside the branch

var awaitingQuestionReply = false; //Variable holds the Satus after a question has been read

var offlineChatReachedEnd = false; //Varialbe holds the Status if a Conversation has reached its end

var latestMassageType = null;
//Message Type Constants---------
/**
* Message type identifier
* @constant
* @type{Number}
* @default 0
**/
export const MESSAGER_STATEMENT = 0;
/**
* Message type identifier
* @constant
* @type{Number}
* @default 3
**/
export const MESSAGER_WARNING = 3;
/**
* Message type identifier
* @constant
* @type{Number}
* @default 1
**/
export const QUESTION = 1;
/**
* Message type identifier
* @constant
* @type{Number}
* @default 2
**/
export const MESSAGE = 2;
//------------------------------

/**
* This Function request the latest Message in a specific Chat or the offlineXml Chat and automatically goes to next one if available
* Note: This is supposed to be the main function for getting new Messages. It handles all conditions and chooses the first matching options automatically
* @param {String} chatName The Name of the chat (a.e filename) - If an offlineXml is loaded this Parameter does not have any effect
* @return {String|null} Next newest unread message or the last read one if no new ones are available (or null if no message can be read)
**/
export function getLatestMessage(chatName){

  //Check if offline xml is loaded
  if(isInOfflineMode()){

    //load latest Message from offline XML
    //Check if new message is available
    if (!isNewMessageAvailable(chatName)) {
      //Repeat old Message (if exist)
      if(currentParserMessagePosition == -1){
        if(currentParserBranchPosition.length == 0){
        return null;
      }else{
        //Get the last message of previous branch
        let currentTempBranchParser = currentParserBranchPosition;
        //Remove last element from tempParser
        currentTempBranchParser.pop();
        let previousBranch = getOfflineBranch(currentTempBranchParser);
        let previousMessages = previousBranch.querySelectorAll(':scope > communicatorChatMessage');
        return previousMessages[previousMessages.length - 1].querySelectorAll(':scope > messageContent')[0].textContent.trim();
      }

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
    let nextMessageXMLContent = getCurrentParserOfflineXMLMessageContent();

    //Save latest message Type
    latestMassageType = getCurrentOfflineParserMessageType();

    //Check if current message is a question
    if(latestMassageType == QUESTION){
      	//set to awaiting question answer mode
        awaitingQuestionReply = true;
    }


    //Check if end of current branch has been reached
    if(endOfCurrentOfflineBranchReached()){
      //Switch to next Branch if possible
      let currentOfflineBranchOption = getCurrentFirstConditionMatchingBranchIndex();

      if(currentOfflineBranchOption != null){
        currentParserBranchPosition.push(currentOfflineBranchOption);
        currentParserMessagePosition = -1;
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
export function getCurrentMessageType(chatName){
   return latestMassageType;
}

/**
* Checks wether there is a new method available to read on the current Path
* @param {String} chatName The Name of the chat (a.e filename) - If an offlineXml is loaded this Parameter does not have any effect
* @return {Boolean} Returns true or false whether a new Message is available on the given Chat
**/
export function isNewMessageAvailable(chatName){
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

    //else Check if condition for next message is met
     //get next message condition
    let messageCheckCondition = currentMessages[currentParserMessagePosition + 1].getAttribute("checkCondition");
    let messageCheckNotCondition = currentMessages[currentParserMessagePosition + 1].getAttribute("checkNotCondition");

    //Check if condition were found
    if(messageCheckCondition == null && messageCheckNotCondition == null){
      return true;
    }

    //Check conditions
    if(messageCheckCondition != null){
      if(!getOfflineConditionState(messageCheckCondition.trim())){
        return false;
      }
    }

    if(messageCheckNotCondition != null){
      if(getOfflineConditionState(messageCheckNotCondition.trim())){
        return false;
      }
    }

    //If all conditions are matched: Return true
    return true;

  }else{
    //Check on Server
  }

}

/**
* Gets all answer Options for current Question
* @return {String[]|null} String Array with each index being one answer or null if no question is currently active
**/
export function getAnswerOptions(){

}

/**
* send answer to current Question (Doesnt have any effect if no question is active)
* @param {Number} answerIndex Index of the chosen Answer (Same index as in output array)
**/
export function sendCurrentQuestionAnswer(answerIndex){
  
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
    currentParserBranchPosition.push(newBranchIndex);
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

//---------------------------------------------------
//Parser
//---------------------------------------------------

//---Offline-----
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
* Returns Neweset Message of the offline XML
* @return {String|null} Returns the newest Message as String or null if in online Mode
**/
function getCurrentParserOfflineXMLMessageContent(){
//if in online Mode return null
if(!isInOfflineMode()){
  return null;
}

//Parse to latest Message

//Get Current branch
let currentBranch = getCurrentOfflineBranch();

//Get latest Message of that branch
let currentMessage = currentBranch.querySelectorAll(':scope > communicatorChatMessage')[currentParserMessagePosition];

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
    //get currentBranch checkConditions
    let currentCheckCondition = currentOfflineBranchOptions[i].getAttribute("checkCondition");
    //get currentBranch checkNotConditions
    let currentCheckNotCondition = currentOfflineBranchOptions[i].getAttribute("checkNotCondition");

    //Change conditions to empty string if none were found and if there are: trim
    currentCheckCondition = currentCheckCondition == null ? "" : currentCheckCondition.trim();
    currentCheckNotCondition = currentCheckNotCondition == null ? "" : currentCheckNotCondition.trim();

    //split Strings into condition names in an array if any are available
    currentCheckCondition = currentCheckCondition.length == 0 ? [] : currentCheckCondition.split(' ');
    currentCheckNotCondition = currentCheckNotCondition.length == 0 ? [] : currentCheckNotCondition.split(' ');

    //Check each condition
    let falseConditionFound = false;
      //Check true Conditions
      for(let a = 0; a < currentCheckCondition.length; a++){
        if(!getOfflineConditionState(currentCheckCondition[a])){
          //If found then set the variable and leave loop
          falseConditionFound = true;
          break;
        }
      }

      //Check false conditions if neccessary
      if(!falseConditionFound){
        //Check false Conditions
        for(let a = 0; a < currentCheckNotCondition.length; a++){
          if(getOfflineConditionState(currentCheckNotCondition[a])){
            //If found then set the variable and leave loop
            falseConditionFound = true;
            break;
          }
        }
      }

      //If branch fits all conditions return it
      if(!falseConditionFound){
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
  if(typeof offlineXMLConditions[conditionName] === undefined){
    //default return false
    return false;
  }

  //return condition Value
  return offlineXMLConditions[conditionName];
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
