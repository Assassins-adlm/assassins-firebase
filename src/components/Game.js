import React from 'react'
import Time from './time'

var ball, w, h
export default class GameLogic extends React.Component {
  constructor(){
    super()
    this.state= {

    }
    this.init = this.init.bind(this)
    this.startGryo = this.startGryo.bind(this)
    this.update = this.update.bind(this)
  }

  init()
  {
      ball = document.getElementById("ball");
       w = window.innerWidth;
        h = window.innerHeight;

    ball.style.left = (w/2)-50+"px";
    ball.style.top = (h/2)-50+"px";
    ball.velocity = {x:0,y:0}
    ball.position = {x:0,y:0}

      if (window.DeviceOrientationEvent) {

      window.addEventListener("deviceorientation", function(event)
      {
        ball.velocity.y = Math.round(event.beta);
        ball.velocity.x = Math.round(event.gamma);
          }
                                 )
      };

      this.update();
  }

  startGryo(){
    window.requestAnimationFrame = ( function() {

                   return window.webkitRequestAnimationFrame ||
                   window.mozRequestAnimationFrame ||
                   window.oRequestAnimationFrame ||
                   window.msRequestAnimationFrame ||
                   function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {

                       window.setTimeout( callback, 1000 / 60 );

                   };

               } )();
  }


    update()
{
        ball.position.x += ball.velocity.x;
        ball.position.y += ball.velocity.y;

        if(ball.position.x > (w-100) && ball.velocity.x > 0)
      {
         ball.position.x = w-100;
      }

      if(ball.position.x < 0 && ball.velocity.x < 0)
      {
        ball.position.x = 0;
      }

      if(ball.position.y > (h-100) && ball.velocity.y > 0)
      {
         ball.position.y = h-100;
      }

      if(ball.position.y < 0 && ball.velocity.y < 0)
      {
         ball.position.y = 0;
      }

    ball.style.top = ball.position.y + "px"
        ball.style.left = ball.position.x + "px"

    requestAnimationFrame( this.update );//KEEP ANIMATING
}


  componentDidMount(){
     this.startGryo()
     this.init()
     this.update()
  }

  componentWillUnmount(){
    this.startGryo()
    this.init()
    this.update()
  }

  render(){
    const style = {
      "-webkit-transition": "all",
      "transition": "all",
      "position":"absolute",
      "width":"100px",
      "height":"100px",
      "border-radius":"50%",
      "background": "white",
    }



    return(
      <div>

         <Time />
          <div id="ball" style = {style}></div>

      </div>
    )
  }

}
