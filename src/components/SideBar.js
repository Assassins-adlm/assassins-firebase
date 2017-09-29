import React from 'react';
import { slide as Menu } from 'react-burger-menu';

class SideBar extends React.Component {

  constructor(props) {
    super(props);
  }

  showSettings (event) {
    event.preventDefault();
  }

  render () {
    return (
      <Menu>
        <a id="home" className="menu-item" href="/home">Home</a>
        <a id="about" className="menu-item" href="#">About</a>
        <a id="contact" className="menu-item" href="#">Contact</a>
        <a onClick={ this.showSettings } className="menu-item--small" href="#">Settings</a>
      </Menu>
    );
  }
}

export default SideBar;
