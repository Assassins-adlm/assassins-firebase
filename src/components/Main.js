import React from 'react'
import App from './App'
import PlayerProfile from './PlayerProfile'
import Setting from './Setting'
import ChatRoom from './ChatRoom'
import Target from './Target'
import LandingPage from './LandingPage'
import {Route, Switch, Redirect} from 'react-router-dom'
import {Router} from 'react-router'

import history from '../history'

export default class Main extends React.Component {

	render() {
		return (
			<Router history={history}>
				<Switch>
					<Route exact path="/" component={LandingPage}/>
					<Route path="/home" component={App}/>
					<Route path="/profile" component={PlayerProfile}/>
					<Route path="/chat" component={ChatRoom}/>
					<Route path="/setting" component={Setting}/>
					<Route path="/target" component={Target}/>
					<Redirect to="/home" component={App}/>
				</Switch>
			</Router>
		)
	}
}

