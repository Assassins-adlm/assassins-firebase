import React from 'react';
import App from './App';
// import Home from './Home';
import SideBar from './SideBar';
import PlayerProfile from './PlayerProfile';
import Charactercreator from './charactercreator'
import { Route, Switch, Redirect } from 'react-router-dom';

export default class Main extends React.Component {


  render() {
    return (
      <div>
        <main>
          <Switch>
            <Route path="/home" component={App} />
            <Redirect to="/home" component={App} />
            <Redirect to = "/creator" component={Charactercreator} />
          </Switch>
        </main>
      </div>
    )
  }
}

