import React from 'react'
import App from './App'
import LandingPage from './LandingPage'
import {Route, Switch, Redirect} from 'react-router-dom'
import {Router} from 'react-router'
import Badge from './NavbarItems/Badge'

import history from '../history'

export default class Main extends React.Component {

	render() {
		return (
			<Router history={history}>
				<Switch>
					<Route exact path="/" component={LandingPage}/>
					<Route exact path="/badge" component={Badge}/>
					<Route path="/home" component={App}/>
					<Redirect to="/" component={LandingPage}/>
				</Switch>
			</Router>
		)
	}
}

