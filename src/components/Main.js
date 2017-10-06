import React from 'react'
import App from './App'
// import Home from './Home';
import SideBar from './SideBar'

import PlayerProfile from './PlayerProfile'
import CharCreate from './CharCreate'
import Setting from './Setting'
import ChatRoom from './ChatRoom'
import Target from './Target'
import {Route, Switch, Redirect} from 'react-router-dom'
import {Router} from 'react-router'
import {compose} from 'redux'
import {connect} from 'react-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'

import history from '../history'

export default class Main extends React.Component {

	render() {
		return (
			<Router history={history}>
				<MuiThemeProvider>
					<div>
						<main>
							<Switch>
								<Route path="/createchar" component={CharCreate}/>
								<Route path="/home" component={App}/>
								<Route path="/profile" component={PlayerProfile}/>
								<Route path="/chat" component={ChatRoom}/>
								<Route path="/setting" component={Setting}/>
								<Route path="/target" component={Target}/>
								<Redirect to="/home" component={App}/>
							</Switch>
						</main>
					</div>
				</MuiThemeProvider>
			</Router>
		)
	}
}

