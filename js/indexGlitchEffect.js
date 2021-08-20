function disableGlitchEffect(){
   //Object Array
   var glitchObjectArray = getGlitchObjects();

   //Disable all Objects
   for(var i = 0; i < glitchObjectArray.length; i++){
     glitchObjectArray[i].className += " disableGlitch";
   }
}

function enableGlitchEffect(){
  //Object Array
  var glitchObjectArray = getGlitchObjects();

  for(var i = 0; i < glitchObjectArray.length; i++){
    var currentElementClassName = glitchObjectArray[i].className;

    glitchObjectArray[i].className = currentElementClassName.replace("disableGlitch", "");
  }
}


function getGlitchObjects(){
  var glitchObjectArray = [];

  glitchObjectArray.push(document.getElementById("gameLogin")); //Main Login

  return glitchObjectArray
}
