import React from 'react';
import App from './App';
import Home from './Home';
import SideBar from './SideBar';
import { Route, Switch, Redirect } from 'react-router-dom';

export default class Main extends React.Component {


  render() {
    return (
      <div>
        <main>
          <SideBar/>
          <Switch>
            <Route path="/home" component={Home} />
            <Route path="/login" component={App} />
            <Redirect to="/home" component={Home} />
          </Switch>
        </main>
      </div>
    )
  }
}

