import React from 'react';
import SideBar from './SideBar';
<<<<<<< HEAD
=======
import MapBox from './MapBox';

>>>>>>> master

export default class Home extends React.Component {

  constructor(props){
    super(props);
  }

  render() {

    console.log(this.props.props, "PROPS")
    let user = this.props.props

    return (
      <div>
      <SideBar />
<<<<<<< HEAD
=======
      <MapBox />
>>>>>>> master
       <div>
              <div className = "space" >
              <h2> Welcome </h2>
              <div>{user.displayName}</div>
              </div>
<<<<<<< HEAD
              <div>
              <img id="photo" src={user.photoURL} alt={user.displayName}/>

              </div>
=======

>>>>>>> master
       </div>

      </div>
    )
  }
}
