/**
* A async Interface to communicate with the Server
* @module asyncLoader
**/

/**
* Method that loads (via ajax-GET) and returns a promise for the xmlFile on the setted Path
* @async
* @param {String} pathToFile String that contains the relative or absolute path to a the xmlFile
* @return {Promise} A Promise for the requested File
**/
export async function loadFileFromServerAsXml(pathToFile){

//create and Return a promise for the entire method
return new Promise(function (resolve, reject) {

//Create xmlRequest
let xmlRequest = new XMLHttpRequest();
//Specifie resoonseType
xmlRequest.responseType = "document";
//Force respone parsing
xmlRequest.overrideMimeType("text/xml");

//Add stateChange eventListener to request
xmlRequest.addEventListener("readystatechange", function () {
  //Check if request is fullfilled
  if(xmlRequest.readyState == 4){
    //Check http result Code
    if(xmlRequest.status == 200){
      //if Request was successfull
      //resolve promise woth responseXML
      resolve(xmlRequest.responseXML);
    }else{
      //if Request is not ok then reject promise
      reject(new Error("File '"+ pathToFile +"' could not be loaded!"));
    }

  }

//readystatechange event function End
});

//Open the request
xmlRequest.open("GET", pathToFile, true);

//Send the request
xmlRequest.send();

//Promise function end--
});
}
