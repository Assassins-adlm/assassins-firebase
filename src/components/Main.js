import React from 'react';
import App from './App';
import Home from './Home';
import SideBar from './SideBar';
import PlayerProfile from './PlayerProfile';
import { Route, Switch, Redirect } from 'react-router-dom';

export default class Main extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <main>
          <SideBar/>
          <Switch>
            <Route path="/home" component={Home} />
            <Route path="/player" component={PlayerProfile}/>
            <Route path="/login" component={App} />
            <Redirect to="/home" component={Home} />
          </Switch>
        </main>
      </div>
    )
  }
}

