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
var currentParserMessagePosition = 0; //Index of the current Message inside the branch

//Message Type Constants
const MESSAGERSTATEMENT = 0;
const QUESTION = 1;
const MESSAGE = 2;

/**
* This Function request the latest Message in a specific Chat or the offlineXml Chat
* @async
* @param {String} chatName The Name of the chat (a.e filename) - If an offlineXml is loaded this Parameter does not have any effect
* @return {String} Next newest unread message or the last read one if no new ones are available
**/
export function getLatestMessage(chatName){

  //Check if offline xml is loaded
  if(isInOfflineMode()){
    //Choose First Branch if none has been chosen
    if(currentParserBranchPosition.length == 0){

    }

    //load latest Message from offline XML

  }else{
    //request latest message from Server for chatName
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
  currentParserMessagePosition = 0;

  //Save xml in variable
  xmlFile = loadedXmlFile;

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
  currentParserMessagePosition = 0;
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

return currentMessage.querySelectorAll(':scope > messageContent')[0].textContent;
}

/**
* Method which returns the message type of the current parser
* @return {Number|null} Number which represents the type of the message or null if in Online Mode
**/
function getCurrentParserMessageType(){
  //if in online Mode return null
  if(!isInOfflineMode()){
    return null;
  }

  //get current Branch
  let currentBranch = getCurrentOfflineBranch();

  //get Message
  let message = currentBranch.querySelectorAll(':scope > communicatorChatMessage')[currentParserMessagePosition];

  let type = message.getAttribute("type");

  switch(type != null ? type.toLowerCase().trim() : 0){
      case "question":
          return QUESTION;
        break;

      case "messagerstatement":
          return MESSAGERSTATEMENT;
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
  if(currentParserBranchPosition.length == 0 || !isInOfflineMode()) {
    return null;
  }

  //Find and return branch
  //init currentBranchContext with xmlFile
  let currentBranchContext = xmlFile.querySelectorAll(':scope > branch')[currentParserBranchPosition[0]];
  for(let i = 1; i < currentParserBranchPosition.length; i++){
    currentBranchContext = currentBranchContext.querySelectorAll(':scope > branch')[currentParserBranchPosition[i]];
    //If branch cannot be found return null
    if(currentBranchContext == null){return null;}
   }

  //return branch
  return currentBranchContext;
}

/**
* Function returns the first new available branch of which all conditions have been fullfilled (or null if none was found)
* @return {Dom-Element|null} Dom-Element of the fitting Branch or null if none are available or found
**/
function getCurrentFirstConditionMatchingBranch(){
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
        return currentOfflineBranchOptions[i];
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
