import React from 'react';
import App from './App';
// import Home from './Home';
import SideBar from './SideBar';
import PlayerProfile from './PlayerProfile';
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
<<<<<<< HEAD:src/Main.js
            <Route path="/home" component={Home}/>
            <Route path="/login" component={App}/>
            <Route path='/map' component={MapBox} />
            <Redirect to="/home" component={Home}/>
=======
            {/* <Route path="/home" component={Home} /> */}
            <Route path="/home" component={App} />
            <Route path="/profile" component={PlayerProfile}/>
            <Redirect to="/home" component={App} />
>>>>>>> master:src/components/Main.js
          </Switch>
        </main>
      </div>
    )
  }
}

