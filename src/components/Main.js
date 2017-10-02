import React from 'react'
import App from './App'
// import Home from './Home';
import SideBar from './SideBar'
import PlayerProfile from './PlayerProfile'
import ChatRoom from './ChatRoom'
import Target from './Target'
import { Route, Switch, Redirect } from 'react-router-dom'
import {Router} from 'react-router'
import history from '../history'

export default class Main extends React.Component {


	render() {
		return (
			<Router history={history}>
				<div>
					<main>
						<Switch>
							<Route path="/home" component={App} />
							<Route path="/profile" component={PlayerProfile}/>
							<Route path="/chat" component={ChatRoom}/>
							<Route path = "/target" component={Target} />

						</Switch>
					</main>
				</div>
			</Router>
		)
	}
}

