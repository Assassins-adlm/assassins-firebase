import React from 'react'


export default class time extends React.Component{

  constructor(){
    super()
    this.state = {
      time: 0,
      timeRunning: true
    }
    this.tick = this.tick.bind(this)

  }

  tick() {
    var num = this.state.time
    num++
    this.setState({
      time: num
    });
  }

  componentDidMount(){
    var counter = 0;
    this.intervalID =
    setInterval(
      () =>{
        if(counter>8){
          clearInterval(this.intervalID)
          console.log("DONE")
        }
        counter++
        this.tick()
       }, 1000
    );
  }



  render(){

    return (
      this.state.timeRunning ?
      <div> <h1 style = {{"textAlign": "center"}}>{this.state.time}</h1></div> :
      <div><h1>GAME OVER</h1></div>
    )
  }

}
