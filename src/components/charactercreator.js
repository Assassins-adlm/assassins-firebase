import React from 'react';
import firebase from '../fire';

class CharacterCreator extends React.Component {

  constructor(){
    super()
    this.state = {
      user: ""
    }
    this.handlesubmit = this.handlesubmit.bind(this)
  }

  handlesubmit(e){
        const playerRef = firebase.database().ref('players');
        const player = {
          id: this.props.props.uid,
          name: e.target.tagName.value,
          gender: e.target.gender.value,
          image: e.target.image.value
        }
        playerRef.push(player);

  }


  render(){
    let user = this.props.props
    console.log("id", this.props.props.uid)
    return (
      <div className = "space">
      <h1> CharacterCreator</h1>
      <form onSubmit = {this.handlesubmit}
      action="server.cgi" method="post" encType="multipart/form-data">
            <input type = "text" name="tagName" placeholder = "What are you called?" /><br/>
            Gender?<br/>
            <span><input type="radio" name="gender" value="male" /> Male
            <input type="radio" name="gender" value="female"/> Female
            <input type="radio" name="gender" value="other"/> Other</span><br/>
            <h3> Take An Image</h3>
            <input type="file" name="image" accept="image/*" capture="user"/>
            <input type="submit" value="Submit"/>
        </form>
      </div>
    )

  }
}

export default CharacterCreator
