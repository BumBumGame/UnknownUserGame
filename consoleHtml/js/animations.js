class animationQueue{

}


class animation{
animationPlayTime;
animationStepTime;
animationRunning;

  constructor(animationPlayTime, animationStepTime){
     this.animationPlayTime = animationPlayTime;
     this.animationStepTime = animationStepTime;
     this.animationRunning = false;
  }

}

//Displays Text loading animation in Console according to parameters
//@param playtime Time after the animation stops (gets paused) (playtime = 0 --> indefinite)
//@param maxDotCount Anzahl der max anzuhängenden Punkte (def:3)
//@param steptime Zeit zwischen jedem Schritt (=Geschwindigkeit)
class textLoadingAnimation extends animation{
maxDotCount;
animationObject;
animationText;
currentAnimationDotCount;
animationIDString;

    constructor(playtime, steptime, maxDotCount, animationText){
       super(playtime, steptime);
       this.maxDotCount = maxDotCount;
       this.animationText = animationText;
       this.currentAnimationDotCount = 0;
       this.animationObject = null;
       //Generate Random Id String
       this.animationIDString = "textLoadAnimation" + ((Math.random().toFixed(3)) * 1000);
         }

animationStep(){
  //Check if Dots are above maximum
  if(this.currentAnimationDotCount >= this.maxDotCount){
    this.animationObject.textContent = this.animationText;
    this.currentAnimationDotCount = 0;
  }

  this.animationObject.textContent += ".";
  this.currentAnimationDotCount++;

  if(this.animationRunning == true){
     setTimeout(this.animationStep.bind(this), this.animationStepTime);
  }
}

start(){
  if(this.animationRunning == false){
    //Create New Element if not exists
    if(this.animationObject == null){
     printOnConsole(this.animationText, this.animationIDString);
     this.animationObject = document.getElementById(this.animationIDString);
   }
     this.animationRunning = true;

     //Call Steo to enable loop
     this.animationStep();

     //Setup Stop Timer if animation is timed
     if(this.animationPlayTime > 0){
       setTimeout(this.stop(), this.animationPlayTime);
     }

  }
}

stop(){
  if(this.animationRunning == true){
    this.animationRunning = false;
  }
}

}
