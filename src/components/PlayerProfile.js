import React from 'react';
import '../profile.css';

class PlayerProfile extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="profile">
          <img align="left" className="profile-background-image" src="./images/profile-background.jpg" alt="Profile image background"/>
          <img align="left" className="image-profile thumbnail" src="./images/avatars/default_avatar.png" alt="Profile image avatar"/>
          <div className="profile-text">
              <h1>Nameless</h1>
              <p>Rookie Assassin / Joined 9/30/2017</p>
          </div>
        </div>
        <hr/>
        <div className="row">
          <div className="col-xs-4 profile-title">Rank<p>Rookie</p></div>
          <div className="col-xs-4 profile-title">Kills<p>5</p></div>
          <div className="col-xs-4 profile-title">Death<p>2</p></div>
        </div>
      </div>
    )
  }
}

export default PlayerProfile;
