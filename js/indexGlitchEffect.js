//Glitch Elements
var mainSectionElements;

function initGlitch(elementCount){
     //Reset glitch elemets
     mainSectionElements = [];
     //Create mainSectionElements and append then
     for(var i = 0; i < elementCount; i++){
       mainSectionElements[i] = document.createElement("div");
       //Set class Name
       mainSectionElements[i].className = "MainSectionGlitch";
       //Append to login window
       mainScreenWindow.append(mainSectionElements[i]);
     }

}
