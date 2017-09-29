import React from 'react';
import App from './App';
import Home from './Home';

class Main extends React.Component {

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
            <Redirect to="/home" component={Home}/>
          </Switch>
        </main>
      </div>
    )
  }
}
