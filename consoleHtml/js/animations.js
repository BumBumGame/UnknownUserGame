class AnimationQueue{
animationObjectArray;
animationDelayArray;
currentRunningAnimationIndex;
queCurrentlyRunning;

constructor(){
  this.animationObjectArray = [];
  this.animationDelayArray = [];
  this.currentRunningAnimationIndex = 0;
  this.queCurrentlyRunning = false;
}

addAnimation(animation, startDelay){
  this.animationObjectArray.push(animation);
  this.animationDelayArray.push(startDelay);
}

//Starts first animation in cue
start(){
  //Start first Animation
  this.animationObjectArray[this.currentRunningAnimationIndex].start();
  this.queCurrentlyRunning = true;

  var prevThis = this;

  if(this.animationObjectArray[this.currentRunningAnimationIndex].animationPlayTime > 0){
    setTimeout(function () { prevThis.next();}, this.animationObjectArray[this.currentRunningAnimationIndex].animationPlayTime);
  }

  }

stop(){
 this.queCurrentlyRunning = false;
 this.animationObjectArray[this.currentRunningAnimationIndex].stop();
}

next(){
  //Stop running animation
  this.animationObjectArray[this.currentRunningAnimationIndex].stop();
  //if delay is not 0 then wait
  var prevThis = this;

  setTimeout(function () {
     //Add +1 to currentAnimationindex
     prevThis.currentRunningAnimationIndex++;
     if(prevThis.length <= prevThis.currentRunningAnimationIndex){
       this.queCurrentlyRunning = false;
       return;
     }

     //Start next Animation
     prevThis.animationObjectArray[prevThis.currentRunningAnimationIndex].start();

     //Set next animation Start if animationPlaytime is limited
     if(prevThis.animationObjectArray[prevThis.currentRunningAnimationIndex].animationPlayTime > 0 && prevThis.queCurrentlyRunning){
       setTimeout(function () { prevThis.next();}, prevThis.animationObjectArray[prevThis.currentRunningAnimationIndex].animationPlayTime);
     }

  }, this.animationDelayArray[this.currentRunningAnimationIndex]);

}

resetAnimations(){
  //Stop current Run
  this.stop();

  //Call Reseters of every single Animation Object
  for(var i = 0; i < this.length; i++){
     this.animationObjectArray[i].reset();
  }

  //Reset queAnimationIndex
  this.currentRunningAnimationIndex = 0;

}

deleteAnimationsDomElements(){
 //Call all delete Functions of Elements in Array
 for(var i = 0; i < this.length; i++){
   this.animationObjectArray[i].deleteDomElement();
 }

}

get length(){
  return this.animationObjectArray.length;
}

}


//-----------------------------------
//Animation Base class which has to be inherited from
class Animation{
animationPlayTime;
animationStepTime;
animationRunning;

  constructor(animationPlayTime, animationStepTime){
     //This class is not allowed to be initialized alone
     if (this.constructor === Animation) {
            throw new TypeError('Abstract class "Widget" cannot be instantiated directly.');
        }
     //Check if all nedded Methods are implemented
     if(this.start === undefined){
            throw new TypeError("Method start() needs to be implemented!");
     }else if(this.stop === undefined){
            throw new TypeError("Method stop() needs to be implemented!");
     }else if(this.reset === undefined){
            throw new TypeError("Method reset() needs to be implemented!");
     }else if(this.animationStep === undefined){
            throw new TypeError("Method animaitonStep() needs to be implemented!");
     }else if(this.deleteDomElement === undefined){
            throw new TypeError("Method deleteDomElement() needs to be implemented!");
     }
     //Set playtime
     this.animationPlayTime = animationPlayTime;
     //Set StepTime
     this.animationStepTime = animationStepTime;
     //Init Animation as not running
     this.animationRunning = false;
  }

}

/*------------------------------------------Define Animation Classes
    - Every Animation Class must have following Methods: start(), animationStep(), stop(), reset(), deleteDomElement()
    - Every Animation Class must extend Animation Base class
*/

//Displays Text loading animation in Console according to parameters
//@param playtime (Integer in ms) Time after the animation stops (gets paused) (playtime = 0 --> indefinite)
//@param maxDotCount (Integer) Number of dots that will be displayed (def:3)
//@param steptime (Integer in ms) Time between each step (=speed)
//@param animationText (String) Text that is displayed by the Animation
class ConsoleTextLoadingAnimation extends Animation{
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
       this.animationIDString = "ConsoleTextLoadAnimation" + ((Math.random().toFixed(4)) * 10000);
         }

animationStep(){
  //Check if Dots are above maximum
  if(this.currentAnimationDotCount >= this.maxDotCount){
    this.reset();
  }else{

  this.animationObject.textContent += ".";
  this.currentAnimationDotCount++;
}

  var prevThis = this;

  if(this.animationRunning == true){
    setTimeout(function () { prevThis.animationStep();}, this.animationStepTime);
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

     //Call Step to enable loop with stepDelay
     var prevThis = this;

     setTimeout(function () { prevThis.animationStep(); }, this.animationStepTime);

     //Setup Stop Timer if animation is timed
     if(this.animationPlayTime > 0){
       setTimeout(function () { prevThis.stop();}, this.animationPlayTime);
     }

  }
}

stop(){
  if(this.animationRunning == true){
    this.animationRunning = false;
  }
}

reset(){
  this.animationObject.textContent = this.animationText;
  this.currentAnimationDotCount = 0;
}

deleteDomElement(){
  //Reset Animation
  this.reset();

  this.animationObject.remove();
  this.animationObject = null;
}

}

//Displays Text loading animation in Console according to parameters
//@param playtime (Integer in ms) Time after the animation stops (gets paused) (playtime = 0 --> indefinite)
//@param animationText (String) Text to be printed
class ConsoleTextTypingAnimation extends Animation{
animationText;
currentAnimationCharIndex;
animationObject;
animationIDString;

constructor(playtime, animationText){
      //Calculate Animation step Time
      var animationStepTime = playtime/animationText.length;
     //Call Animation Constructor
     super(playtime, animationStepTime);
     //Animations text stellen
     this.animationText = animationText;
     //Set startIndex to 0
     this.currentAnimationCharIndex = 0;
     //Generate id String
     this.animationIDString = "ConsoleTextTypingAnimation" + ((Math.random().toFixed(4)) * 10000);
}

start(){
  //If Animation is not running
 if(this.animationRunning == false){

  //Create Animation Object if it doesnt exist yet
   if(this.animationObject == null){
    printOnConsole("", this.animationIDString);
    this.animationObject = document.getElementById(this.animationIDString);
  }

  //Set running Status
  this.animationRunning = true;

  //Start first step
  this.animationStep();

 }

}

animationStep(){
    //Add Letter to AnimationObject
    this.animationObject.textContent += this.animationText.charAt(this.currentAnimationCharIndex);
    //Count up AnimationCharIndex
    this.currentAnimationCharIndex++;
    //Check if Animation is done or Animation got stopped
    if(this.currentAnimationCharIndex > this.animationText.length || !this.animationRunning){
      //Stop animation
      this.stop();
    }else{
      var prevThis = this;
      //Set Timout for next Execution
      setTimeout(function () { prevThis.animationStep(); }, this.animationStepTime);
    }

}

stop(){
  //If Animation is running
  if(this.animationRunning == true){
    this.animationRunning = false;
  }

}

reset(){
  this.animationObject.textContent = "";
  this.currentAnimationCharIndex = 0;
  this.animationRunning = false;
}

deleteDomElement(){
  //Reset Animation
  this.reset();

  this.animationObject.remove();
  this.animationObject = null;
}

get currentAnimationObject(){
  return this.animationObject;
}

}


//Displays Text loading animation with Typing animation
//@param playtime (Integer in ms) Time after the animation stops (gets paused) (playtime = 0 --> indefinite)
//@param steptime (Integer in ms) Time between each step (=speed)
//@param animationText (String) Text to be printed
//@param onlyDotsAfterStart (Boolean) Set if onlyDots will be animated after first text print or Text will be printed new everytime as well
//@param typingTextPlayTime Time of the typing Animation on start
class ConsoleTextLoadingAnimationTyping extends Animation{
animationObject;
animationText;
maxDotCount;
currentAnimationDotCount;
typingAnimationObject;
onlyConstantDotAnimation;

constructor(playtime, steptime, animationText, maxDotCount, onlyDotsAfterStart, typingTextPlayTime){
      //Call Animation Constructor
      super(playtime, steptime);
      //Save animationtext
      this.animationText = animationText;
      //Set maxDotCount
      this.maxDotCount = maxDotCount;
      //Save onlyDotsAfterStart (Boolean)
      this.onlyConstantDotAnimation = onlyDotsAfterStart;
      //Create typingAnimation
      this.typingAnimationObject = new ConsoleTextTypingAnimation(typingTextPlayTime, animationText);
      //Set animationObject to null
      this.animationObject = null;
      //Set Start dot COunt to 0
      this.currentAnimationDotCount = 0;
}

start(){
      //Check if Animation is not running
      if(this.animationRunning == false){
         //Check if Animation Object Exists and create One if nessecary
         if(this.animationObject == null){
            //Start Typing animmation to create Animation object
            this.typingAnimationObject.start();
            //Get AnimationObject
            this.animationObject = this.typingAnimationObject.currentAnimationObject;
           //Check if animation is stopped at typing
         }else if(this.animationObject.textContent.length > 0 && this.typingAnimationObject.animationText.length >= this.typingAnimationObject.currentAnimationCharIndex) {
            this.typingAnimationObject.start();
         }

         //Set animation on running;
         this.animationRunning = true;

        //Start next step after Typing animation is finished
        var prevThis = this;

        setTimeout(function () { prevThis.animationStep(); }, this.animationStepTime);
        //If playtime is set then set timout on stop
        if(this.animationPlayTime > 0){
        setTimeout(function () { prevThis.stop(); }, this.animationPlayTime);
       }
  }
}

stop(){
     //Check if Animation is running
     if(this.animationRunning == true){
        this.animationRunning = false;
        //Stop Typing animation;
        this.typingAnimationObject.stop();
     }
}

animationStep(){
  //Check if animation is running and step can be performed
  if(this.animationRunning == true){
      //Check if Object does still exists
      if(this.animationObject == null){
         //leave function
         return;
      }

     //Start Typing animation if no text is in Element
     if(this.animationObject.textContent.length  == 0){
        //Start Typing function
        this.typingAnimationObject.start();
     }

     //Only Start normal loading animation if typing is done
     if(this.typingAnimationObject.animationRunning == false){
       //Check if animation needs to be reset after hitting the limit
       if(this.currentAnimationDotCount >= this.maxDotCount){
           this.reset();
       }else{
       //Add point to Animation and add  to counter
        this.currentAnimationDotCount++;
        this.animationObject.textContent += ".";
      }

     }

     //Start next step if no stopped
     var prevThis = this;

         setTimeout(function () {prevThis.animationStep(); }, this.animationStepTime);
    }

}

reset(){
    //Check if Text needs to be reset
    if(this.onlyConstantDotAnimation == false){
      //Reset typing Animation
      this.typingAnimationObject.reset();
    }else{
      //Only reset Dots
      this.animationObject.textContent = this.animationText;
    }
    //Reset Dot counter
    this.currentAnimationDotCount = 0;
}

deleteDomElement(){
  //Stop Animation
  this.stop();
  //Reset Animation
  this.reset();
  //Call Delete of Typing animation
  this.typingAnimationObject.deleteDomElement();
  this.animationObject = null;
}


}

//Testing
var testAnimation = new ConsoleTextLoadingAnimation(5000, 350, 4, "loading");
var testAnimation2 = new ConsoleTextLoadingAnimation(5000, 350, 4, "loading2");
var testAnimation3 = new ConsoleTextTypingAnimation(200, "loading3");
var combinedAnimation = new ConsoleTextLoadingAnimationTyping(0, 350, "CombinedLoading", 5, false, 2000);
var que = new AnimationQueue();

que.addAnimation(testAnimation);
que.addAnimation(testAnimation2);
