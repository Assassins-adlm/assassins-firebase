import React from 'react'
import App from './App'
// import Home from './Home';
import SideBar from './SideBar'
import PlayerProfile from './PlayerProfile'
import { Route, Switch, Redirect } from 'react-router-dom'
import {Router} from 'react-router'
import history from '../history'

export default class Main extends React.Component {


	constructor(props) {
		super(props)
	}

	render() {
		return (
		    <Router history={history}>
				<div>
					<main>
						<Switch>
							{/* <Route path="/home" component={Home} /> */}
							<Route path="/home" component={App} />
							<Route path="/profile" component={PlayerProfile}/>
							<Redirect to="/home" component={App} />
						</Switch>
					</main>
				</div>
			</Router>
		)
	}

}

