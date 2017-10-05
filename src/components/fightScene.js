import React from 'react'
var Shake = require('shake.js')

export default class FightScene extends React.Component {
  constructor(){
    super()
    this.state = {

    }
  }

  componentDidMount(){
        //create a new instance of shake.js.
        var myShakeEvent = new Shake({
          threshold: 15
      });
      // start listening to device motion
      myShakeEvent.start();
      // register a shake event
      window.addEventListener('shake', shakeEventDidOccur, false);
      //shake event callback
      function shakeEventDidOccur () {
          //put your own code here etc.
          alert('Shake!');
      }
  }

  render(){
    console.log("fight scene")
    return(
      <div>
        <div className = "space">
        <h1> FIGHT SCENE </h1>
        <h3> Tap to Win </h3>
        </div>
      </div>

    )
  }

}
