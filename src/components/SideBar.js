import React from 'react';
import firebase from '../fire';
import { slide as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom';

export default class SideBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      user: null
    }
    // console.log('user-->', this.state.user)
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
			this.setState({loading: false, user});
		});
  }

  showSettings (event) {
    event.preventDefault();
  }

  render () {
    const avatarStyle = {
      width: 100
    }
    return (
      this.state.user &&
      <Menu isOpen={this.state.menuOpen}>
        <Link id="profile" className="menu-item" to="/profile">
        <img style={avatarStyle} src={this.state.user.photoURL} alt="avatar"/>
        <span>{this.state.user.displayName}</span>
        </Link>
        <hr/>
        <Link id="targets" className="menu-item" to="home"><i className="fa fa-map-marker" aria-hidden="true"></i><span>Find Targets</span></Link>
        <Link id="chat" className="menu-item" to="#"><i className="fa fa-comments" aria-hidden="true"></i><span>Chat</span></Link>
        <Link id="lists" className="menu-item" to="#"><i className="fa fa-list" aria-hidden="true"></i><span>Target Lists</span></Link>
        <Link id="about" className="menu-item" to="#"><i className="fa fa-info-circle" aria-hidden="true"></i><span>About</span></Link>
        <hr/>
        <Link id="shop" className="menu-item" to="#"><i className="fa fa-shopping-cart" aria-hidden="true"></i><span>Shop</span></Link>
        <hr/>
        <Link onClick={ this.showSettings } className="menu-item--small" to="#"><i className="fa fa-cog" aria-hidden="true"></i><span>Settings</span></Link>

        <Link id="logout" className="menu-item" to="/home"><button onClick={() => {firebase.auth().signOut()}}><i className="fa fa-sign-out" aria-hidden="true"></i><span>Logout</span></button></Link>
      </Menu>
    );
  }
}


