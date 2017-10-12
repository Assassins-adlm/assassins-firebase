import React from 'react'
import App from './App'
import PlayerProfile from './PlayerProfile'
import Setting from './Setting'
import ChatRoom from './ChatRoom'
import Target from './Target'
import Game from './Game'
import MapBX from './MapBoxReact/reactMB'
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
					<Route path="/testmb" component={MapBX}/>
					<Route path="/profile" component={PlayerProfile}/>
					<Route path="/chat" component={ChatRoom}/>
					<Route path="/setting" component={Setting}/>
					<Route path = "/game"component={Game}/>
					<Route path="/target" component={Target}/>
					<Redirect to="/" component={LandingPage}/>
				</Switch>
			</Router>
		)
	}
}

