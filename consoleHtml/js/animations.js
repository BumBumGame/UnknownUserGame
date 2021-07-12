class AnimationQueue{
animationObjectArray; //Array of Animation Objects
animationDelayArray; // Array with delays for when each animation should start playing
currentRunningAnimationIndex; //Current run index
queCurrentlyRunning; //Boolean if Cue is currently running --> False means paused
queTotalRuntime; //Array of total automated runtimes with each index is one after one pause
queUnlimetedRuntimeAnimations; //Array that holds the animationObjectArrayIndex of Elemetns with unlimeted animation time;

constructor(){
  this.animationObjectArray = [];
  this.animationDelayArray = [];
  this.queTotalRuntime = [0];
  this.queUnlimetedRuntimeAnimations = [];
  this.currentRunningAnimationIndex = 0;
  this.queCurrentlyRunning = false;
}

addAnimation(animation, startDelay = 0){
  //Check if parent class of animation is Animation
  if(Object.getPrototypeOf(animation.constructor) !== Animation){
      throw new TypeError("The AnimationObject needs to inherit from class Animation!");
  }
  //Check if object structure is given because its needed by the Que
  animation.checkSubClassStructure();

  //Check if animation time is limited
  if(animation.animationPlayTime > 0){
    //Add animationPLaytime and startDelay to total runtime
    this.queTotalRuntime[this.queTotalRuntime.length - 1] += animation.animationPlayTime;
    this.queTotalRuntime[this.queTotalRuntime.length - 1] += startDelay;
  }else{
    //If animation runs unlimeted set new array index
    this.queTotalRuntime.push(0);
    //Add startDelay
    this.queTotalRuntime[this.queTotalRuntime.length - 1] += startDelay;
    //Save Element in special Array
    this.queUnlimetedRuntimeAnimations.push(this.animationObjectArray.length);
  }
  //Add properties to local Arrays
  this.animationObjectArray.push(animation);
  this.animationDelayArray.push(startDelay);
}

removeAnimmation(animationQueueIndex){
  var unlimetedRuntimeIndex = 0;
  //stop Queue if running
  this.stop();
  //Check if animation is an indefinite Animation
  if(this.animationObjectArray[animationQueueIndex].animationPlayTime == 0){
     //get Index in queUnlimetedRuntime
     unlimetedRuntimeIndex = this.queUnlimetedRuntimeAnimations.indexOf(animationQueueIndex);
     //Decreade every Index after this
     for(var i = unlimetedRuntimeIndex; i < this.queUnlimetedRuntimeAnimations.length; i++){
       this.queUnlimetedRuntimeAnimations[i]--;
     }
     //Add totaltime After Pause to previos
     this.queTotalRuntime[unlimetedRuntimeIndex] += this.queTotalRuntime[unlimetedRuntimeIndex + 1];
     //Delete Total Que time
     this.queTotalRuntime.splice(unlimetedRuntimeIndex + 1, 1);
     //Delete UnLimitedRuntime From Array
     this.queUnlimetedRuntimeAnimations.splice(unlimetedRuntimeIndex, 1);
  }else{
    //Get Animationplaytime
    var animationPlayTime = this.animationObjectArray[animationQueueIndex].animationPlayTime;
    //Get unlimeteRuntimeIndex from witch everything has to shiftet by one
    for(var i = 0; i < this.queUnlimetedRuntimeAnimations.length; i++){
       //Check when index is smaller than in queUnlimetedRuntimeAnimations
       if(this.queUnlimetedRuntimeAnimations[i] > animationQueueIndex){
          //Save index
          unlimetedRuntimeIndex = i;
          break;
       }

     //If it its after the last element
     if(i == this.queUnlimetedRuntimeAnimations.length - 1){
        unlimetedRuntimeIndex = this.queUnlimetedRuntimeAnimations.length;
     }

    }
    //Shift unlimeteRuntimeIndex
    for(var i = unlimetedRuntimeIndex; i < this.queUnlimetedRuntimeAnimations.length; i++){
      this.queUnlimetedRuntimeAnimations[i]--;
    }


  }
  //Substract time from Totaltime
  this.queTotalRuntime[unlimetedRuntimeIndex] -= this.animationObjectArray[animationQueueIndex].animationPlayTime;
  this.queTotalRuntime[unlimetedRuntimeIndex] -= this.animationDelayArray[animationQueueIndex];
  //Remove Element from animationArray
  this.animationObjectArray.splice(animationQueueIndex, 1);
  //Remove Element from delay Array:
  this.animationDelayArray.splice(animationQueueIndex, 1);

}

//Starts first animation in cue
start(){
  var prevThis = this;
   //Start only when there are Elements in the Cue
   if(this.length > 0){
  //Start first Animation with delay
  setTimeout(function () {
  prevThis.animationObjectArray[prevThis.currentRunningAnimationIndex].start();
  prevThis.queCurrentlyRunning = true;

  if(prevThis.animationObjectArray[prevThis.currentRunningAnimationIndex].animationPlayTime > 0){
    setTimeout(function () { prevThis.next();}, 100);
  }

  }, this.animationDelayArray[this.currentRunningAnimationIndex]);

}
  }

stop(){
 this.queCurrentlyRunning = false;
 this.animationObjectArray[this.currentRunningAnimationIndex].stop();
}

next(){
    var prevThis = this;
  //Check if Current Running Animation is done
  if(prevThis.animationObjectArray[prevThis.currentRunningAnimationIndex].animationRunning == false){
    //Start next animation
      //Wait the delay before Starting

      setTimeout(function () {
        //Count up Animatimation Index
        prevThis.currentRunningAnimationIndex++;
        //Check if Que is done
        if(prevThis.length <= prevThis.currentRunningAnimationIndex){
          //Disable Que
          prevThis.queCurrentlyRunning = false;
          return;
        }
        //Start next Animation
        prevThis.animationObjectArray[prevThis.currentRunningAnimationIndex].start();

        //Set next AnimationStart Check
        if(!(prevThis.animationObjectArray[prevThis.currentRunningAnimationIndex].animationPlayTime > 0 && prevThis.queCurrentlyRunning)){
          //Time next execution
          setTimeout(function () { prevThis.next(); }, 100);
        }else{
          //Pause cue
          prevThis.queCurrentlyRunning = false;
        }

        }, prevThis.animationDelayArray[prevThis.currentRunningAnimationIndex + 1]);
  }else{
    setTimeout(function () { prevThis.next(); }, 100);
  }

}

reset(){
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
  //Reset Qeue
  this.reset();
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
            throw new TypeError('Abstract class "Animation" cannot be instantiated directly.');
        }
     //Check class Structure
     this.checkSubClassStructure();
     //Set playtime
     this.animationPlayTime = animationPlayTime;
     //Set StepTime
     this.animationStepTime = animationStepTime;
     //Init Animation as not running
     this.animationRunning = false;
  }

checkSubClassStructure(){
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
animationMilliseconds;

totalStepCount;
currentStep;

    constructor(playtime, steptime, maxDotCount, animationText){
       super(playtime, steptime);
       //Calculate Total Step count
       this.totalStepCount = Math.floor(playtime/steptime);
       //Set currentStep to 0
       this.currentStep = 0;
       this.maxDotCount = maxDotCount;
       this.animationText = animationText;
       this.currentAnimationDotCount = 0;
       this.animationObject = null;
       //Generate Random Id String
       this.animationIDString = "ConsoleTextLoadAnimation" + ((Math.random().toFixed(4)) * 10000);
         }

animationStep(){
  var millisSinceLastExecution = Date.now() - this.animationMilliseconds;

  //Check if next Step can be Executed
  if(millisSinceLastExecution >= this.animationStepTime){

    //If animaiton has performed all steps: exit
    if(this.currentStep >= this.totalStepCount){
      this.stop();
      return;
    }else{
      this.currentStep++;
    }

  //Check if Dots are above maximum
  if(this.currentAnimationDotCount >= this.maxDotCount){
     this.animationObject.textContent = this.animationText;
     this.currentAnimationDotCount = 0;
  }else{

  this.animationObject.textContent += ".";
  this.currentAnimationDotCount++;
  }

   this.animationMilliseconds = Date.now();

}

  var prevThis = this;

  if(this.animationRunning == true){
    //Set async restart of function
    setTimeout(function () { prevThis.animationStep();}, 0);
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

     //Set current time
     this.animationMilliseconds = Date.now();
     setTimeout(function () { prevThis.animationStep(); }, 0);

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
  this.currentStep = 0;
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
      var animationStepTime = Math.floor((playtime/animationText.length));
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
    if(this.currentAnimationCharIndex >= this.animationText.length || !this.animationRunning){
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
