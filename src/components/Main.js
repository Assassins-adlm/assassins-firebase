import React from 'react'
import App from './App'
// import Home from './Home';
import SideBar from './SideBar'
import PlayerProfile from './PlayerProfile'
import Setting from './Setting'
import ChatRoom from './ChatRoom'
import Target from './Target'
import { Route, Switch, Redirect } from 'react-router-dom'
import {Router} from 'react-router'
import { compose } from 'redux'
import {connect} from 'react-redux'

import history from '../history'

export default class Main extends React.Component {

	render() {
		// location.reload(true)
		return (
			<Router history={history}>
				<div>
					<main>
						<Switch>
							<Route path="/home" component={App} />
							<Route path="/profile" component={PlayerProfile}/>
							<Route path="/chat" component={ChatRoom}/>
							<Route path="/setting" component={Setting}/>
							<Route path = "/target" component={Target} />
							<Redirect to="/home" component={App} />
						</Switch>
					</main>
				</div>
			</Router>
		)
	}
}

