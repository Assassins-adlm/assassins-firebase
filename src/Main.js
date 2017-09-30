import React from 'react';
import App from './App';
import Home from './Home';
import { Route, Switch, Redirect } from 'react-router-dom';
import MapBox from './MapBox'


export default class Main extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <main>
          <Switch>
            <Route path="/home" component={Home}/>
            <Route path="/login" component={App}/>
            <Route path='/map' component={MapBox} />
            <Redirect to="/home" component={Home}/>
          </Switch>
        </main>
      </div>
    )
  }
}

